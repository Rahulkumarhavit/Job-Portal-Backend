import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async applyJob(@Req() req: any, @Param('id') jobId: string) {
    const userId = req.user.id;
    const application = await this.applicationService.applyJob(userId, jobId);
    return { message: 'job applied successfully', application, success: true };
  }
}
