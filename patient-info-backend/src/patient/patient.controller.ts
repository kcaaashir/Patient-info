import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePatientDto } from './dto/create-patient.dto';
import { PatientQueryDto } from './dto/patient-query.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientService } from './patient.service';
import * as path from 'path';
import { ValidImageFormat } from 'src/common/cloudinary/constants/constants';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';

@ApiTags('Auth')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({
    description: 'Patient has been created sucessfully',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async createPatient(
    @Body() createPatientDto: CreatePatientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const fileExtension = path.extname(file.originalname);
      if (!ValidImageFormat.includes(fileExtension)) {
        throw new BadRequestException({ message: 'File type not supported' });
      }
      const patient = await this.patientService.createPatient(
        createPatientDto,
        file,
      );
      return {
        status: HttpStatus.CREATED,
        message: 'A patient has been created successfully',
        data: patient,
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiCreatedResponse({
    description: 'Patient has been updated sucessfully',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  @UseInterceptors(FileInterceptor('file'))
  async updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        const fileExtension = path.extname(file.originalname);
        if (!ValidImageFormat.includes(fileExtension)) {
          throw new BadRequestException({ message: 'File type not supported' });
        }
      }
      const patient = await this.patientService.updatePatient(
        id,
        updatePatientDto,
        file,
      );
      return {
        status: HttpStatus.CREATED,
        message: 'A patient has been updated successfully',
        data: patient,
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('specialAttention/:id')
  @ApiCreatedResponse({
    description: 'Patient has been updated sucessfully',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  async updatePatientsSpecialAttention(@Param('id') id: string) {
    try {
      const patient = await this.patientService.updatePatientSpecialAttention(
        id,
      );
      return {
        status: HttpStatus.CREATED,
        message: 'A patient has been updated successfully',
        data: patient,
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOnePatient(@Param('id') id: string) {
    try {
      const patient = await this.patientService.findOne(id);
      return {
        status: HttpStatus.CREATED,
        data: patient,
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiCreatedResponse({
    description: 'Patient has been deleted sucessfully',
  })
  @ApiNotFoundResponse({
    description: 'Patient not found',
  })
  async deletePatient(@Param('id') id: string) {
    try {
      await this.patientService.deletePatient(id);
      return {
        status: HttpStatus.CREATED,
        message: 'A Patient has been deleted successfully',
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: Object,
    isArray: true,
    description: 'Returns list of  patients',
  })
  @ApiNotFoundResponse({
    description: 'Patients not found',
  })
  @Get()
  async findAll(@Query() patientQueryDto: PatientQueryDto) {
    try {
      const patients = await this.patientService.findAll(patientQueryDto);
      return {
        status: HttpStatus.OK,
        message: 'Patients successfully fetched',
        data: patients,
      };
    } catch (err) {
      throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
    }
  }
}
