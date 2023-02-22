import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator';

export class LogInUserDto {
    @ApiProperty()
    @IsString()
    readonly email?: string;

    @ApiProperty()
    @IsString()
    readonly password?: string
}
