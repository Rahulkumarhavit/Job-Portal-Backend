import {
  Body,
  Controller,
  Get,
  Param,
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
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllJobs(@Query() query: string) {
    const result = await this.jobService.getAllJobs(query);
    return { result, success: true };
  }

  // get job by id.
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getJobById(@Param('id') id: string) {
    const job = await this.jobService.getJobById(id);
    return { job, success: true };
  }

  //get job by userid.
  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async getJobByUserID(@Req() req: any) {
    const userId = req.user.id;
    const job = await this.jobService.getJobByUserID(userId);
    return { job, success: true };
  }

  //create favourite
  @UseGuards(JwtAuthGuard)
  @Post('fav/:id')
  async createFavourite(@Req() req, @Param('id') id: string) {
    const userId = req.user.id;
    const result = await this.jobService.createFavourite(userId, id);
    return { result, success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('fav')
  async getFavourite(@Req() req) {
    const userId = req.user.id;
    const result = await this.jobService.getFavourite(userId);
    return { result, success: true };
  }
}
