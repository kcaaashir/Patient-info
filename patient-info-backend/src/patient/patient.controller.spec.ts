import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import * as path from 'path';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { Gender } from './enums/gender.enum';
import { Patient } from './interface/patient.interface';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientSchemas } from './schemas/patient.schemas';

describe('PatientController', () => {
  let controller: PatientController;
  let patientService: PatientService;
  const patientModel: Model<Patient> = mongoose.model(
    'Patient',
    PatientSchemas,
  );

  const createPatientDto: any = {
    fullname: 'raju',
    email: 'raju@gmail.com',
    phoneNo: '9876231456',
    dateOfBirth: '2071-01-01',
    address: 'Lalitpur',
    gender: Gender.MALE,
    specialAttention: false,
    file: "<img src='http://res.cloudinary.com/dea1lzwrv/image/upload/c_fill,h_80,w_80/sukj1mjrp3mlfkvkr3zu' />",
    publicId: 'sukj1mjrp3mlfkvkr3zu',
  };

  const updatePatientDto: any = {
    ...createPatientDto,
    _id: '2332sfgdgsmk218bndsjf',
    fullname: 'ashir',
    specialAttention: true,
  };

  const fileMock: any = {
    fieldname: 'file',
    originalname: 'profile.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer:
      '<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 03 e8 00 00 03 e8 08 06 00 00 00 4d a3 d4 e4 00 00 00 04 73 42 49 54 08 08 08 08 7c 08 64 88 00 ... 119297 more bytes>',
    size: 119347,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        PatientService,
        CloudinaryService,
        {
          provide: getModelToken('Patient'),
          useValue: patientModel,
        },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    patientService = module.get<PatientService>(PatientService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPatient', () => {
    it('should create patient and return the value', async () => {
      jest.spyOn(path, 'extname').mockReturnValue('.jpg');
      jest
        .spyOn(patientService, 'createPatient')
        .mockResolvedValue(createPatientDto);

      const response = await controller.createPatient(
        createPatientDto,
        fileMock,
      );

      expect(response).toEqual({
        status: HttpStatus.CREATED,
        message: 'A patient has been created successfully',
        data: createPatientDto,
      });
    });

    it('should return file type not supported if other file type rather than .jpg .jpeg .png is used', async () => {
      jest.spyOn(path, 'extname').mockReturnValue('.exec');

      try {
        await controller.createPatient(createPatientDto, fileMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('File type not supported');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an HttpException when there is an error', async () => {
      const errorMessage = 'File type not supported';
      jest
        .spyOn(patientService, 'createPatient')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.createPatient(createPatientDto, fileMock),
      ).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: errorMessage },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('updatePatient', () => {
    it('should update patient and return updated patient', async () => {
      jest.spyOn(path, 'extname').mockReturnValue('.jpg');
      jest
        .spyOn(patientService, 'updatePatient')
        .mockResolvedValue(updatePatientDto);

      const result = await controller.updatePatient(
        updatePatientDto._id,
        { fullname: 'ashir' },
        fileMock,
      );

      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'A patient has been updated successfully',
        data: updatePatientDto,
      });
      expect(result.data.fullname).toBe('ashir');
    });

    it('should return file type not supported if other file type rather than .jpg .jpeg .png is used', async () => {
      jest.spyOn(path, 'extname').mockReturnValue('.exec');

      try {
        await controller.createPatient(createPatientDto, fileMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('File type not supported');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('findOnePatient', () => {
    it('should find patient from database and return it', async () => {
      jest.spyOn(patientService, 'findOne').mockResolvedValue(updatePatientDto);

      const result = await controller.findOnePatient(updatePatientDto._id);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: updatePatientDto,
      });
    });

    it('should throw an HttpException when there is an error', async () => {
      const errorMessage = 'User Not found';
      jest
        .spyOn(patientService, 'findOne')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.findOnePatient(updatePatientDto._id),
      ).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: errorMessage },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('updatePatientsSpecialAttention', () => {
    it('should update the patient to special attention', async () => {
      jest
        .spyOn(patientService, 'updatePatientSpecialAttention')
        .mockResolvedValue(updatePatientDto);

      const result = await controller.updatePatientsSpecialAttention(
        updatePatientDto._id,
      );

      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'A patient has been updated successfully',
        data: updatePatientDto,
      });
      expect(result.data.specialAttention).toEqual(true);
    });

    it('should throw an HttpException when there is an error', async () => {
      const errorMessage = 'User Not found';
      jest
        .spyOn(patientService, 'updatePatientSpecialAttention')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.updatePatientsSpecialAttention(updatePatientDto._id),
      ).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: errorMessage },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('deletePatient', () => {
    it('should delete the user and return 201', async () => {
      jest
        .spyOn(patientService, 'deletePatient')
        .mockReturnValue(updatePatientDto);

      const result = await controller.deletePatient(updatePatientDto._id);
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        message: 'A Patient has been deleted successfully',
      });
    });

    it('should throw an HttpException when there is an error', async () => {
      const errorMessage = 'User Not found';
      jest
        .spyOn(patientService, 'deletePatient')
        .mockRejectedValue(new Error(errorMessage));

      await expect(
        controller.deletePatient(updatePatientDto._id),
      ).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: errorMessage },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('findAll', () => {
    it('should return all the patient list', async () => {
      jest
        .spyOn(patientService, 'findAll')
        .mockResolvedValue([{ ...updatePatientDto }]);

      const result = await controller.findAll({});

      expect(result).toEqual({
        status: HttpStatus.OK,
        message: 'Patients successfully fetched',
        data: [{ ...updatePatientDto }],
      });
    });

    it('should throw an HttpException when there is an error', async () => {
      const errorMessage = 'User Not found';
      jest
        .spyOn(patientService, 'findAll')
        .mockRejectedValue(new Error(errorMessage));

      await expect(controller.findAll({})).rejects.toThrow(
        new HttpException(
          { status: HttpStatus.BAD_REQUEST, message: errorMessage },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });
});
