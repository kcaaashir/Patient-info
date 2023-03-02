import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrpyt from 'bcrypt'

describe('AuthService', () => {
  let service: AuthService;

  const salt = 'sfsa232xdsf123sdf';
  const hash = 'asdfsdf98281hsd12';

  const password = 'testing';

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTIzZDM3NThhMmY1MTEzMjQzYzc1OCIsImVtYWlsIjoiYWFzaGlyQGdtYWlsLmNvbSIsImlhdCI6MTY3NTc3MTU3NSwiZXhwIjoxNjc1NzcxNTg1fQ.FNFljhz-0wxQQTcVnYZC21RCwMVqo0fvki9dnHc7v2Y';

  const inputPassword = 'testing'
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateSalt', () => {
    it('should generate salt of random string', async () => {
      jest.spyOn(bcrpyt, 'genSalt').mockResolvedValue(salt);

      await service.generateSalt();

      expect(bcrpyt.genSalt).toHaveBeenCalled();
    });
  });

  describe('hashPasswordWithSalt', () => {
    it('should hash password with salt', async () => {
      jest.spyOn(service, 'generateSalt').mockResolvedValue(salt);
      jest.spyOn(bcrpyt, 'hash').mockResolvedValue(hash);

      await service.hashPasswordWithSalt(password);

      expect(service.generateSalt).toHaveBeenCalled();
      expect(bcrpyt.hash).toHaveBeenCalled();
    });
  });

  describe('comparePassword', () => {
    it('should compare user and input password', async () => {
      jest.spyOn(bcrpyt, 'compare');
      await service.comparePassword(password, inputPassword);

      expect(bcrpyt.compare).toHaveBeenCalledWith(password, inputPassword);
    });
  });

  describe('generateJwtToken', () => {
    it('should generate jwt token', async () => {
      const jwt = jest.spyOn(JwtService.prototype, 'signAsync').mockResolvedValue(token);

      const result = await service.generateJwtToken({ email: 'test@yahoo.com', password: password });

      expect(result).toBe(token);
      expect(jwt).toHaveBeenCalled();
    });
  });
});
