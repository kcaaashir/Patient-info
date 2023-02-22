import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enums/gender.enum';

export class CreatePatientDto {
    @ApiProperty()
    @IsString()
    readonly fullname: string;

    @ApiProperty()
    @IsString()
    readonly email: string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    readonly phoneNo: string;

    @ApiProperty()
    @IsString()
    readonly dateOfBirth?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    readonly address?: string

    @ApiProperty({
        description: 'List of enum',
        enum: Gender,
    })
    @IsOptional()
    @IsEnum(Gender, { each: true })
    @IsString()
    readonly gender?: Gender

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    readonly specialAttention?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    file?: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    publicId?: string
}
