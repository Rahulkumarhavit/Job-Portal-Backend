import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
        createdById: userId,
      },
    });

    if (!job) {
      throw new BadRequestException('Job not created.');
    }

    return job;
  }

  async getAllJobs(query: any) {
    const { keyword, location, jobtype, salary } = query;

    const salaryRange = salary?.split('-');
    let jobs = [];
    if (keyword || location || jobtype || salary) {
      jobs = await this.prisma.job.findMany({
        where: {
          ...(keyword != '' && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          }),
          ...(location != '' && {
            location: { contains: location, mode: 'insensitive' },
          }),
          ...(jobtype != '' && {
            jobType: { contains: jobtype, mode: 'insensitive' },
          }),

          ...(salary &&
            salaryRange?.length && {
              salary: {
                gte: parseInt(salaryRange[0], 10),
                lte: parseInt(salaryRange[1], 10),
              },
            }),
        },
        include: { company: true },
        orderBy: { createAt: 'desc' },
      });
    } else {
      jobs = await this.prisma.job.findMany({ skip: 0, take: 6 });
    }

    if (!jobs || jobs.length == 0) {
      throw new NotFoundException('jobs are not found');
    }

    return jobs;
  }
}
