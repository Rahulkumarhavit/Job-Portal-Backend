import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (existingCompany) {
      throw new BadRequestException("you can't add same company.");
    }
    const company = this.prisma.company.create({
      data: {
        name,
        description,
        website,
        location,
        logo,
        userId,
      },
    });
    return company;
  }

  async getcompanies(userId: string) {
    const companies = await this.prisma.company.findMany({
      where: { userId },
    });

    if (!companies || companies?.length == 0) {
      throw new NotFoundException('Company not found');
    }
    return companies;
  }

  async getcompaniesbyid(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async deletecompanies(companyId: string) {
    const company = await this.prisma.company.delete({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('company not deleted');
    }

    return company;
  }
}
