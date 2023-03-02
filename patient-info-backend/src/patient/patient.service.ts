import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient } from './interface/patient.interface';

@Injectable()
export class PatientService {
    private logger: Logger;

    constructor(
        @InjectModel('Patient')
        private readonly patientModel: Model<Patient>,
        private cloudinaryService: CloudinaryService
    ) {
        this.logger = new Logger(PatientService.name);
    }

    async createPatient(createPatientDto: CreatePatientDto, file) {
        try {
            this.logger.log('CreatePatient: Start session and transaction');
            const session = await this.patientModel.db.startSession();
            session.startTransaction();
            try {
                this.logger.log('CreatePatient: Create new model patient');
                const result = await this.cloudinaryService.uploadImage(file);
                const newPatient = new this.patientModel({
                    ...createPatientDto,
                });
                if (result.url) {
                    newPatient.file = result.url;
                    newPatient.publicId = result.public_id;
                }
                this.logger.log('CreatePatient: Save new patient record');
                const savedPatient = await newPatient.save();
                return savedPatient;
            } catch (error) {
                this.logger.error(`CreatePatient: abort transaction`);
                this.logger.error(`CreatePatient: ${error.message}`);
                await session.abortTransaction();

                throw new HttpException(
                    { message: error.response?.data?.message || error.message },
                    error.response?.data?.statusCode || HttpStatus.BAD_REQUEST,
                );
            } finally {
                this.logger.log(`CreatePatient: end session`);
                session.endSession();
            }
        } catch (err) {
            this.logger.error(`CreatePatient: Patient create failed`);
            this.logger.error(`CreatePatient: ${err.message}`);
            throw new HttpException(
                { message: err.message },
                err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updatePatientSpecialAttention(id: string) {
        try {
            this.logger.log('UpdatePatient: Checking if the patient exist in database');
            const patient = await this.findOne(id);
            if (!patient) {
                this.logger.log('UpdatePatient: throw exception as patient not found');
                throw new NotFoundException('cannot find the patient');
            }
            this.logger.log('UpdatePatient: Start session and transaction');
            const session = await this.patientModel.db.startSession();
            session.startTransaction();
            try {
                this.logger.log('UpdatePatient: Updating patient data');
                const updatePatient = await this.patientModel
                    .findOneAndUpdate(
                        { _id: id },
                        {
                            specialAttention: true
                        },
                        { new: true },
                    );
                return updatePatient;
            } catch (error) {
                this.logger.error(`UpdatePatient: abort transaction`);
                this.logger.error(`UpdatePatient: ${error.message}`);
                await session.abortTransaction();
                throw new HttpException(
                    { message: error.response?.data?.message || error.message },
                    error.response?.data?.statusCode || HttpStatus.BAD_REQUEST,
                );
            } finally {
                this.logger.log(`UpdatePatient: end session`);
                session.endSession();
            }
        } catch (err) {
            this.logger.error(`UpdatePatient: Patient update failed`);
            this.logger.error(`UpdatePatient: ${err.message}`);
            throw new HttpException(
                { message: err.message },
                err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async updatePatient(id: string, updatePatientDto: UpdatePatientDto, file) {
        try {
            this.logger.log('UpdatePatient: Checking if the patient exist in database');
            const patient = await this.findOne(id);
            if (!patient) {
                this.logger.log('UpdatePatient: throw exception as patient not found');
                throw new NotFoundException('cannot find the patient');
            }
            this.logger.log('UpdatePatient: Start session and transaction');
            const session = await this.patientModel.db.startSession();
            session.startTransaction();
            try {
                if (file) {
                    this.logger.log('UpdateUser: Updating user image');
                    if (patient.file) {
                        this.logger.log('UpdateUser: Removing old image of user');
                        await this.cloudinaryService.deleteImage(patient.publicId);
                    }
                    const result = await this.cloudinaryService.uploadImage(file);
                    this.logger.log('UpdateUser: Updating image of user');
                    await this.patientModel.findByIdAndUpdate(
                        patient._id,
                        {
                            file: result.url,
                            publicId: result.public_id
                        },
                        { new: true },
                    );
                }
                this.logger.log('UpdatePatient: Updating patient data');
                const updatePatient = await this.patientModel
                    .findOneAndUpdate(
                        { _id: id },
                        {
                            ...updatePatientDto,
                        },
                        { new: true },
                    );
                return updatePatient;
            } catch (error) {
                this.logger.error(`UpdatePatient: abort transaction`);
                this.logger.error(`UpdatePatient: ${error.message}`);
                await session.abortTransaction();
                throw new HttpException(
                    { message: error.response?.data?.message || error.message },
                    error.response?.data?.statusCode || HttpStatus.BAD_REQUEST,
                );
            } finally {
                this.logger.log(`UpdatePatient: end session`);
                session.endSession();
            }
        } catch (err) {
            this.logger.error(`UpdatePatient: Patient update failed`);
            this.logger.error(`UpdatePatient: ${err.message}`);
            throw new HttpException(
                { message: err.message },
                err.status || HttpStatus.BAD_REQUEST,
            );
        }
    }

    async findOne(id: string) {
        const patient = this.patientModel.findById(id);
        if (!patient) {
            throw new NotFoundException(`Patient is not found`);
        }
        return patient;
    }

    async deletePatient(id: string) {
        this.logger.log(`DeletePatient: Findind patient with id`);
        const patient = await this.findOne(id);
        if (!patient) {
            this.logger.log('DeletePatient: throw exception as patient not found');
            throw new NotFoundException('cannot find the patient');
        }
        await this.cloudinaryService.deleteImage(patient.publicId);
        return await patient.remove();
    }

    async findAll(patientQueryDto: PatientQueryDto) {
        const { fullname, limit, offset } = patientQueryDto;
        let dataQuery = {};
        if (fullname) {
            dataQuery = { fullname: { $regex: fullname, $options: 'i' } };
        }

        const patient = await this.patientModel
            .find(dataQuery)
            .sort({ specialAttention: -1, fullname: 1 })
            .skip(offset)
            .limit(limit);

        return patient;
    }
}
