import { HttpException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import  mongoose, { Model } from 'mongoose';
import * as sinon from 'sinon';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';
import { testModel } from './schemas/user.schema'

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;
  let authService: AuthService;
  let test: any;

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
            save: jest.fn()
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>('UserModel');
    authService = module.get<AuthService>(AuthService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });


  describe('createUser', () => {
    
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const hashedPassword = {
        hash: 'hashedPassword',
        salt: 'salt',
      };
  
      const session: any = {
        startTransaction: jest.fn(),
        endSession: jest.fn(),
      };
  
      const savedUser: any = {
        _id: '123',
        email: createUserDto.email,
        password: hashedPassword.hash,
      };
  
      jest.spyOn(session, 'startTransaction').mockImplementation(() => {});
      jest.spyOn(service, 'createUser').mockResolvedValueOnce(savedUser);
      const a = jest.spyOn(new testModel, 'save');
      jest.spyOn(authService, 'hashPasswordWithSalt');
      // jest.spyOn(test, 'save')s
      
     
      const result =  await service.createUser(createUserDto);
      // let b = new testModel({
      //   email: 'test@example.com',
      //   password: 'testpassword',
      // })

     
      // expect(b).toHaveBeenCalled();
      expect(a).toHaveBeenCalled();
      expect(result).toEqual(savedUser);
      expect(authService.hashPasswordWithSalt).toHaveBeenCalledWith(createUserDto.password);
    });

    // it('should throw an HttpException if an error occurs', async () => {
    //   const error = new Error('Error creating user');
    //   jest.spyOn(userModel, 'create');

    //   await expect(service.createUser(createUserDto)).rejects.toThrow(HttpException);
    //   expect(Logger.error).toHaveBeenCalled();
    //   expect(Logger.error).toHaveBeenCalledWith(`CreateUser: ${error.message}`);
    // });
  });


});
