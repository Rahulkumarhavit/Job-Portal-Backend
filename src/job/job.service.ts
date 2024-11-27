import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PostJobDto } from './dto/job.dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  async postJob(userId: string, postJobDto: PostJobDto) {
    const {
      title,
      description,
      requirements,
      location,
      jobType,
      experienceLevel,
      position,
      companyId,
      salary,
    } = postJobDto;

    const job = await this.prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        jobType,
        experienceLevel,
        position,
        companyId,
        salary,
        createdById:userId
      },
    });

    if(!job){
        throw new BadRequestException('Job not created.')
    }

    return job;
  }
}
