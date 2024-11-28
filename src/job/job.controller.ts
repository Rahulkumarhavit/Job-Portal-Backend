import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PostJobDto } from './dto/job.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async postJob(@Req() req: any, @Body() postJobDto: PostJobDto) {
    const userId = req.user.id;
    const result = await this.jobService.postJob(userId, postJobDto);

    return { result, message: 'job created', success: true };
  }

  // get all jobs
  @Get()
  async getAllJobs(@Query() query: string) {
    const result = await this.jobService.getAllJobs(query);
    return { result, success: true };
  }
}
