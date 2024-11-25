import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RegisterCompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async registerCompany(
    userId: string,
    registerCompanyDto: RegisterCompanyDto,
  ) {
    const { name, description, website, location, logo } = registerCompanyDto;
    const existingCompany = await this.prisma.company.findUnique({
      where: { name },
    });
    if (!existingCompany) {
      throw new BadRequestException("you can't add same company.");
    }
    const company = this.prisma.company.create({
      data: {
        name,
        description,
        website,
        logo,
        userId,
      },
    });
    return company;
  }
}
