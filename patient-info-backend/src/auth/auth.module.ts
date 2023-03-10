import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async( configService: ConfigService ) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: {expiresIn: '1d'}
      })
  })
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
