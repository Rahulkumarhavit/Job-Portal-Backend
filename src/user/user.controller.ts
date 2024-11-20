import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/user.dto';

@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService){}


    @Post("register")
    async register(@Body() registerUserDto:RegisterUserDto){
        return this.userService.register(registerUserDto);
    }
}

