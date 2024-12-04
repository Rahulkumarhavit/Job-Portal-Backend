import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UpdateStatusDto } from './dto/application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prisma: PrismaService) {}

  async applyJob(applicantId: string, jobId: string) {
    if (!jobId) throw new BadRequestException('job id required');

    const existingApplication = await this.prisma.application.findFirst({
      where: { jobId, applicantId },
    });

    if (existingApplication) {
      throw new BadRequestException('you have already apply for job.');
    }

    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new BadRequestException('job not found');
    }

    const newApplication = this.prisma.application.create({
      data: {
        jobId,
        applicantId,
      },
    });
    return newApplication;
  }

  async getAppliedJobs(userId: string) {
    const application = await this.prisma.application.findMany({
      where: { applicantId: userId },
      orderBy: { createAt: 'desc' },
      include: { job: { include: { company: true } } },
    });

    if (!application || application?.length === 0) {
      throw new NotFoundException('no application found');
    }
    return application;
  }

  //get all aplicants by job
  async getApplicants(jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: {
        applications: {
          orderBy: { createAt: 'desc' },
          include: {
            applicant: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('job not found');
    }
    return job;
  }

  // update status
  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const { status } = updateStatusDto;

    const application = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }
    const updatedApplication = await this.prisma.application.update({
      where: { id },
      data: {
        status: status?.toLowerCase(),
      },
    });
    return updatedApplication;
  }
}
