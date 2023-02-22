import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PatientQueryDto {
  @IsOptional()
  @IsString()
  fullname?: string;

  @IsOptional()
  @IsPositive()
  limit?: number;

  @IsOptional()
  offset?: number;
}
