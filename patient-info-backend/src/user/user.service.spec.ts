import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model, Query } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interface/user.interface';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

describe('UserService', () => {
  let service: UserService;
  let UserModel: Model<User> = mongoose.model('User', UserSchema);
  let authService: AuthService;



  const hashedPassword = {
    hash: 'hashedPassword',
    salt: 'salt',
  };

  const createUserDto: CreateUserDto = {
    email: 'test@example.com',
    password: 'testpassword',
  };

  const savedUser: any = {
    _id: '123',
    email: createUserDto.email,
    password: hashedPassword.hash,
  };


  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTIzZDM3NThhMmY1MTEzMjQzYzc1OCIsImVtYWlsIjoiYWFzaGlyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTc3MTU3NSwiZXhwIjoxNjc1NzcxNTg1fQ.FNFljhz-0wxQQTcVnYZC21RCwMVqo0fvki9dnHc7v2Y';

  beforeEach(async () => {
    jest.spyOn(UserModel.db, 'startSession').mockImplementation(() => {
      return Promise.resolve({
        startTransaction: function () {
          return '';
        },
        abortTransaction: function () {
          return '';
        },
        endSession: function () {
          return '';
        },
      } as any);
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        JwtService,
        {
          provide: getModelToken('User'),
          useValue: UserModel,
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

    it('should create a new user', async () => {
      jest
        .spyOn(authService, 'hashPasswordWithSalt')
        .mockResolvedValue(hashedPassword);

      jest.spyOn(UserModel.prototype, 'save').mockImplementationOnce(() =>
        Promise.resolve({
          _id: '123',
          email: 'test@example.com',
          password: 'hashedPassword',
        }),
      );
      const result = await service.createUser(createUserDto);
      expect(authService.hashPasswordWithSalt).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(result).toEqual(savedUser);
    });

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('Error creating user');
      jest.spyOn(UserModel.prototype, 'save').mockRejectedValueOnce(error);

      try {
        await service.createUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Error creating user');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });


  describe("logInUser", () => {
    it('should return token on success', async () => {
      const findOne = jest.spyOn(UserModel, 'findOne').mockResolvedValue(savedUser);
      jest
        .spyOn(authService, 'comparePassword')
        .mockResolvedValue(true);
      jest.spyOn(authService, 'generateJwtToken').mockResolvedValue(token)
      const result = await service.logInUser(createUserDto);

      expect(findOne).toBeCalled();
      expect(authService.comparePassword).toHaveBeenCalledWith(
        savedUser.password,
        createUserDto.password,
      );
      expect(result).toEqual(token);
    });

    it("should throw error if user is not found", async () => {
      const error = new Error('Email or username does not exists');
      jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(error);

      try {
        await service.logInUser(createUserDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Email or username does not exists');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it("should throw error if password is not correct", async () => {
      const error = new Error('Incorrect email or password');
      const findOne = jest.spyOn(UserModel, 'findOne').mockResolvedValue(savedUser);
      jest.spyOn(authService, 'comparePassword').mockRejectedValueOnce(error);

      try {
        await service.logInUser(createUserDto);
      } catch (e) {
        expect(findOne).toBeCalled();
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Incorrect email or password');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    })

  })
});