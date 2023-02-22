import { 
    Body, 
    Controller, 
    HttpException, 
    HttpStatus, 
    Logger, 
    Post
} from '@nestjs/common';
import { 
    ApiTags,
    ApiCreatedResponse,
    ApiNotFoundResponse,
 } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInUserDto } from './dto/login-user.dto';
import { UserService } from './user.service';

@ApiTags('Auth')

@Controller('user')
export class UserController {
    private logger: Logger;

    constructor(
        private readonly userService: UserService
    ){
        this.logger = new Logger(UserController.name); 
    }


    @Post('signup')
    @ApiCreatedResponse({
        description: 'User has been created sucessfully',
    })
    @ApiNotFoundResponse({
        description: 'user not found',
      })
    async signIn(
        @Body() createUserDto: CreateUserDto,
    ) {
        try{
            const user = await this.userService.createUser(createUserDto);
            return {
                status: HttpStatus.CREATED,
                message: 'A user has been created successfully',
                data: user,
            }
        }catch(err){
            throw new HttpException({ message: err.message }, HttpStatus.BAD_REQUEST);
        }
    }

    @Post('signin')
    @ApiCreatedResponse({
        description: 'User has been logged in sucessfully',
    })
    @ApiNotFoundResponse({
        description: 'user not found',
      })
    async login(
        @Body() logInUserDto: LogInUserDto,
    ){
        try{
            const userLoggedIn = await this.userService.logInUser(logInUserDto);
            return {
                status: HttpStatus.CREATED,
                message: 'User has been loggedIn successfully',
                token: userLoggedIn,
            }
        }catch(err){
            throw new HttpException({ status:HttpStatus.BAD_REQUEST ,message: err.message }, HttpStatus.BAD_REQUEST);
        }
    }

}