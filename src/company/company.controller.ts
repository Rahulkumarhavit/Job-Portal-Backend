import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RegisterCompanyDto, UpdateCompanyDto } from './dto/company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post('register')
  async registerCompany(
    @Req() req,
    @Body() registerCompanyDto: RegisterCompanyDto,
  ) {
    const userId = req.user.id;
    const result = await this.companyService.registerCompany(
      userId,
      registerCompanyDto,
    );

    return {
        message:"company created successfully",
        result,
        success:true,
    }
  }

  // get companies
  @UseGuards(JwtAuthGuard)
  @Get()
  async getcompanies(@Req() req:any){
    const  userId = req.user.id;
    const result = await this.companyService.getcompanies(userId);
    return {
      result,
      success:true,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getcompaniesbyid(@Req() req:any,@Param('id') id:string){
  
    const result = await this.companyService.getcompaniesbyid(id);
    return {
      result,
      success:true,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deletecompanies(@Req() req:any,@Param('id') id:string){
  
    const result = await this.companyService.deletecompanies(id);
    return {
      result,
      success:true,
      message:"company deleted successfully."
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put("update/:id")
  async updatecompanies(@Param('id') id:string,@Body() updateCompanyDto:UpdateCompanyDto){
    const result = await this.companyService.updatecompanies(id,updateCompanyDto);

    return {
      result,
      success:true,
      message:"company updated successfully."
    }
  } 
}
