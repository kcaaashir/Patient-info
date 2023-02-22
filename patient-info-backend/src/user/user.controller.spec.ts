import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { LogInUserDto } from './dto/login-user.dto';

fdescribe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, AuthService, JwtService, {
        provide: 'UserModel',
        useFactory: () => ({
          db: {
            startSession: jest.fn().mockReturnValue({
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              abortTransaction: jest.fn(),
              endSession: jest.fn(),
            }),
          },
          findOne: jest.fn(),
          findById: jest.fn(),
          create: jest.fn(),
        }),
      },],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should create a user and return a success response', async () => {
      const createUserDto: CreateUserDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const user: any = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      jest.spyOn(service, 'createUser').mockResolvedValue(user);

      const response = await controller.signIn(createUserDto);

      expect(response).toEqual({
        status: HttpStatus.CREATED,
        message: 'A user has been created successfully',
        data: user,
      });
    });

    it('should throw an HttpException with a bad request status code if there is an error creating the user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'johndoe@example.com',
        password: 'password123',
      };

      const errorMessage = 'Email already exists';

      jest.spyOn(service, 'createUser').mockRejectedValue(new Error(errorMessage));

      await expect(controller.signIn(createUserDto)).rejects.toThrow(new HttpException({ message: errorMessage }, HttpStatus.BAD_REQUEST));
    });
  });

  describe('login', () => {
    it('should return a token when a user logs in', async () => {
      const logInUserDto: LogInUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const token = 'testtoken';
      jest.spyOn(service, 'logInUser').mockResolvedValue(token);

    
      const result = await controller.login(logInUserDto);

      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'User has been loggedIn successfully',
        token: token,
      });
    });

    it('should throw an HttpException when there is an error', async () => {
      const logInUserDto: LogInUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const errorMessage = 'test error message';
      jest.spyOn(service, 'logInUser').mockRejectedValue(new Error(errorMessage));

      await expect(controller.login(logInUserDto)).rejects.toThrow(new HttpException({ status: HttpStatus.BAD_REQUEST, message: errorMessage }, HttpStatus.BAD_REQUEST));
    });
  });
});
