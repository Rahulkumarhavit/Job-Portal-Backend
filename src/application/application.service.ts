import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

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
}
