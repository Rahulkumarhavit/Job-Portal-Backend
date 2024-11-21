import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { RegisterUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const {
      fullname,
      email,
      phoneNumber,
      password,
      profileBio,
      profileSkills,
      profileResume,
      profileResumeOriginalName,
      profilePhoto,
      role,
    } = registerUserDto;

    if (!fullname || !email || !phoneNumber || !password) {
      throw new BadRequestException('All fields are required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullname,
        email,
        phoneNumber,
        password: hashedPassword,
        profileBio,
        profileSkills,
        profileResume,
        profileResumeOriginalName,
        profilePhoto,
        role,
      },
    });
    if (!user) {
      throw new BadRequestException('User not created.');
    }

    return { user, success: true, message: 'Successfully user created.' };
  }

  async login(email: string, password: string, role: string) {
    if (!email || !password || !role) {
      throw new BadRequestException('All fields are required');
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('User not exist..');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Incorrect password');
    }

    if (role !== user.role) {
      throw new BadRequestException("Account doesn't exist with current role.");
    }

    const tokenData = { userId: user.id };
    const token = this.jwtService.sign(tokenData, {
      secret: process.env.SECRET_KEY,
      expiresIn: '1d',
    });

    return {
      token,
      user,
      success: true,
      message: 'Successfully loged in',
    };
  }

  // logout
  async logout(): Promise<{ message: string; success: boolean }> {
    return {
      message: 'Logout successfully',
      success: true,
    };
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const {
      fullname,
      email,
      phoneNumber,
      profileBio,
      profileSkills,
      profileResume,
      profilePhoto,
      profileResumeOriginalName,
    } = updateUserDto;
    if (!fullname || !email || !phoneNumber || !profileBio || !profileSkills) {
      throw new BadRequestException('All fields are required..');
    }
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        fullname,
        email,
        phoneNumber,
        profileBio,
        profileSkills,
        profileResume,
        profilePhoto,
        profileResumeOriginalName,
      },
    });
    return user;
  }
}
