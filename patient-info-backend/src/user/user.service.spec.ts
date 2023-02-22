import { HttpException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let UserModel: Model<User>;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        {
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
            save: jest.fn().mockResolvedValue({})
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    UserModel = module.get<Model<User>>('UserModel');
    authService = module.get<AuthService>(AuthService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'testpassword',
    };
    const hashedPassword = {
      hash: 'hashedPassword',
      salt: 'salt',
    };

    it('should create a new user', async () => {
      jest.spyOn(authService, 'hashPasswordWithSalt').mockResolvedValue(hashedPassword);

      const savedUser: any = {
        _id: '123',
        email: createUserDto.email,
        password: hashedPassword.hash,
      };

     
      const result = await service.createUser(createUserDto);
      // const newUserSaveSpy = jest.spyOn(UserModel, result.save).mockImplementationOnce(savedUser);


      expect(authService.hashPasswordWithSalt).toHaveBeenCalledWith(createUserDto.password);
      // expect(newUserSaveSpy).toHaveBeenCalledWith();
      expect(result).toEqual(savedUser);
    });

    it('should throw an HttpException if an error occurs', async () => {
      const error = new Error('Error creating user');
      jest.spyOn(UserModel.prototype, 'save').mockRejectedValueOnce(error);

      await expect(service.createUser(createUserDto)).rejects.toThrow(HttpException);
      expect(Logger.error).toHaveBeenCalled();
      expect(Logger.error).toHaveBeenCalledWith(`CreateUser: ${error.message}`);
    });
  });


});
