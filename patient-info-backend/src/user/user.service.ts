import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/login-user.dto';
import { User } from './interface/user.interface';

@Injectable()
export class UserService {
    private logger: Logger;

    constructor(
        @InjectModel('User')
        public readonly userModel: Model<User>,
        private authService: AuthService,
    ) {
        this.logger = new Logger(UserService.name);
    }

    async createUser(createUserDto: CreateUserDto) {
        try {
            this.logger.log('CreateUser: Start session and transaction');
            const session = await this.userModel.db.startSession();
            session.startTransaction();
            try {
                this.logger.log('CreateUser: Create new model user');
                const newUser = new this.userModel({
                    ...createUserDto,
                });
                this.logger.log('CreateUser: Generate hashed password');
                const hashedPassword = await this.authService.hashPasswordWithSalt(
                    createUserDto.password,
                );
                newUser.password = hashedPassword.hash;
                const savedUser = await newUser.save();
                return savedUser;
            } catch (error) {
                this.logger.error(`CreateUser: abort transaction`);
                this.logger.error(`CreateUser: ${error.message}`);
                await session.abortTransaction();

                throw new HttpException(
                    { message: error.response?.data?.message || error.message },
                    error.response?.data?.statusCode || HttpStatus.BAD_REQUEST,
                );
            } finally {
                this.logger.log(`CreateUser: end session`);
                session.endSession();
            }
        } catch (err) {
            this.logger.error(`CreateUser: User create failed`);
            this.logger.error(`CreateUser: ${err.message}`);
            throw new HttpException(
                { message: err.message },
                err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async logInUser(logInuserDto: LogInUserDto) {
        try {
            this.logger.log('LogInUser: Search user from database');
            const user = await this.userModel.findOne({ email: logInuserDto.email });
            if (!user) {
                this.logger.log('LogInUser: User not found.');
                throw new HttpException(
                    { message: 'Email or username does not exists' },
                    HttpStatus.CONFLICT,
                );
            }
            const compare = await this.authService.comparePassword(
                user.password,
                logInuserDto.password,
            );
            if (!compare) {
                throw new HttpException(
                    { message: 'Incorrect email or password' },
                    HttpStatus.BAD_REQUEST,
                );
            }
            const token = await this.authService.generateJwtToken(user);
            return token;
        } catch (err) {
            this.logger.error(`LogInUser: User log in failed`);
            this.logger.error(`LogInUser: ${err.message}`);
            throw new HttpException(
                { message: err.message },
                err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }
}


