import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientSchemas } from './schemas/patient.schemas';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: 'Patient', schema: PatientSchemas }
    ])
  ],
  providers: [PatientService],
  controllers: [PatientController],
  exports: [PatientService]
})
export class PatientModule {}
