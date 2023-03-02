import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt';
import * as bcrpyt from 'bcrypt'

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generateSalt() {
        return bcrpyt.genSalt();
    }

    async hashPasswordWithSalt(password: string) {
        const salt = await this.generateSalt();
        const hash = await bcrpyt.hash(password, salt);
        const data = {
            salt: salt,
            hash: hash
        }
        return data;
    }


    async comparePassword(userPassword: string, inputPassword: string) {
        const compare = await bcrpyt.compare(inputPassword, userPassword);
        return compare;
    }

    async generateJwtToken(user) {
        const token = await this.jwtService
            .signAsync({
                id: user._id,
                email: user.email,
                fullName: user.fullName
            });
        return token;
    }
}
