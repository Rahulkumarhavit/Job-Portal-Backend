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
          ...(keyword && {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { description: { contains: keyword, mode: 'insensitive' } },
            ],
          }),
          ...(location && {
            location: { contains: location, mode: 'insensitive' },
          }),
          ...(jobtype && {
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

  //job by id
  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return job;
  }

  async getJobByUserID(createdById: string) {
    try {
      const jobs = await this.prisma.job.findMany({
        where: { createdById },
        include: { company: true },
        orderBy: { createAt: 'desc' },
      });
      if (!jobs || jobs?.length == 0) {
        throw new NotFoundException('job not found');
      }
      return jobs;
    } catch (error) {
      throw new NotFoundException('job not found');
    }
  }

  // create favourite
  async createFavourite(userId: string, jobId: string) {
    let newFav: any;
    try {
      const fav = await this.prisma.favorite.findFirst({
        where: { userId, jobId },
      });

      if (fav) {
        throw new NotFoundException('This job is already in favourit');
      }
      newFav = this.prisma.favorite.create({
        data: { userId, jobId },
      });
      if (!newFav) {
        throw new NotFoundException('job not added in favourite');
      }
      return newFav;
    } catch (error) {
      throw new NotFoundException('job not added');
    }
  }

  async getFavourite(userId: string) {
    try {
      const getjobs = await this.prisma.favorite.findMany({
        where: { userId },
        include: { job: { include: { company: true } } },
      });
      if (!getjobs?.length) {
        throw new NotFoundException('job not found');
      }
      return getjobs;
    } catch (error) {
      throw new NotFoundException('job not found');
    }
  }
}
