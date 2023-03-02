import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { Gender } from './enums/gender.enum';
import { Patient } from './interface/patient.interface';
import { PatientService } from './patient.service';
import { PatientSchemas } from './schemas/patient.schemas'

describe('PatientService', () => {
  let service: PatientService;
  let patientModel: Model<Patient> = mongoose.model("Patient", PatientSchemas)
  let cloudinaryService: CloudinaryService

  const createPatientDto: any = {
    "fullname": "raju",
    "email": "raju@gmail.com",
    "phoneNo": "9876231456",
    "dateOfBirth": "2071-01-01",
    "address": "Lalitpur",
    "gender": Gender.MALE,
    "specialAttention": false,
    "file": "<img src='http://res.cloudinary.com/dea1lzwrv/image/upload/c_fill,h_80,w_80/sukj1mjrp3mlfkvkr3zu' />",
    "publicId": "sukj1mjrp3mlfkvkr3zu",
  }

  const updatePatientDto: any = {
    ...createPatientDto,
    _id: '2332sfgdgsmk218bndsjf',
    fullname: 'ashir',
    specialAttention: true,
  }

  const fileMock: any = {
    fieldname: 'file',
    originalname: 'profile.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: "<Buffer 89 50 4e 47 0d 0a 1a 0a 00 00 00 0d 49 48 44 52 00 00 03 e8 00 00 03 e8 08 06 00 00 00 4d a3 d4 e4 00 00 00 04 73 42 49 54 08 08 08 08 7c 08 64 88 00 ... 119297 more bytes>",
    size: 119347
  }

  const cloudinaryMock = {
    url: `<img src='http://res.cloudinary.com/dea1lzwrv/image/upload/c_fill,h_100,w_100/djkvtf7fe6ufy595duke' />`,
    public_id: 'djkvtf7fe6ufy595duke'
  }

  beforeEach(async () => {

    jest.spyOn(patientModel.db, 'startSession').mockImplementation(() => {
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
        PatientService,
        CloudinaryService,
        {
          provide: getModelToken('Patient'),
          useValue: patientModel
        }
      ],

    }).compile();

    service = module.get<PatientService>(PatientService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPatient', () => {
    it('should create new patient', async () => {
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue(cloudinaryMock);
      const save = jest.spyOn(patientModel.prototype, 'save').mockImplementationOnce(() =>
        Promise.resolve(updatePatientDto),
      );
      const result = await service.createPatient(createPatientDto, fileMock);

      expect(result).toEqual(updatePatientDto)
      expect(cloudinaryService.uploadImage).toHaveBeenCalled()
      expect(save).toHaveBeenCalled();
    });

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('Error creating patient');
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue(cloudinaryMock);
      jest.spyOn(patientModel.prototype, 'save').mockRejectedValue(error);

      try {
        await service.createPatient(createPatientDto, fileMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('Error creating patient');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });

  });

  describe('updatePatientSpecialAttention', () => {
    it('should update patient special attention to true', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(createPatientDto);
      jest.spyOn(patientModel, 'findOneAndUpdate').mockResolvedValue(updatePatientDto)

      const result = await service.updatePatientSpecialAttention(updatePatientDto._id)

      expect(result).toBe(updatePatientDto);
      expect(result.specialAttention).toEqual(true);
    })

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('cannot find the patient');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      try {
        await service.updatePatientSpecialAttention(updatePatientDto._id);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('cannot find the patient');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('updatePatient', () => {
    it('should update patient', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(createPatientDto);
      const deleteImage = jest.spyOn(cloudinaryService, 'deleteImage').mockReturnThis()
      jest.spyOn(cloudinaryService, 'uploadImage').mockResolvedValue(cloudinaryMock);
      jest.spyOn(patientModel, 'findByIdAndUpdate').mockResolvedValue(updatePatientDto);
      jest.spyOn(patientModel, 'findOneAndUpdate').mockResolvedValue(updatePatientDto);

      const result = await service.updatePatient(updatePatientDto, { fullname: "ashir" }, fileMock);

      expect(result).toBe(updatePatientDto);
      expect(deleteImage).toHaveBeenCalled();
      expect(patientModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(patientModel.findOneAndUpdate).toHaveBeenCalled();
      expect(result.fullname).toEqual('ashir');
    });

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('cannot find the patient');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      try {
        await service.updatePatient(updatePatientDto._id, createPatientDto, fileMock);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toEqual('cannot find the patient');
        expect(e.status).toEqual(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('findOne', () => {
    it('should find and return one data', async () => {
      jest.spyOn(patientModel, 'findById').mockResolvedValue(updatePatientDto);

      const result = await service.findOne(updatePatientDto._id);
      expect(result).toBe(updatePatientDto);
    });

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('cannot find the patient');
      jest.spyOn(patientModel, 'findById').mockRejectedValue(error);

      try {
        await service.findOne(updatePatientDto._id);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('cannot find the patient');
      }
    });
  });

  describe('deletePatient', () => {
    it('should delete the user details and file in cloudinary', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce({
        ...updatePatientDto,
        remove: jest.fn(),
      } as any);
      jest.spyOn(cloudinaryService, 'deleteImage').mockReturnThis();
      jest.spyOn(patientModel.prototype, 'remove');

      await service.deletePatient(updatePatientDto._id);

      expect(cloudinaryService.deleteImage).toHaveBeenCalled();
      expect(service.findOne).toHaveBeenCalled();
    });

    it('should throw an HttpException if an error occurs', async () => {

      const error = new Error('cannot find the patient');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      try {
        await service.deletePatient(updatePatientDto._id);
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e.message).toEqual('cannot find the patient');
      }
    });
  });

  describe('findAll', () => {
    it('should return all patients with default limit and offset', async () => {
      const patients = [
        { _id: 'patient-1', fullname: 'John Doe', specialAttention: true },
        { _id: 'patient-2', fullname: 'Jane Doe', specialAttention: false },
      ];
      jest.spyOn(patientModel, 'find').mockReturnValueOnce({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValueOnce(patients),
      } as any);

      const result = await service.findAll({});

      expect(result).toEqual(patients);
      expect(patientModel.find).toHaveBeenCalled();
    });
  })
});
