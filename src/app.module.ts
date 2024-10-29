import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { ApplicationModule } from './application/application.module';
import { ApplicationService } from './application/application.service';

@Module({
  imports: [ConfigModule, UserModule, CompanyModule, JobModule, ApplicationModule],
  controllers: [AppController],
  providers: [AppService,PrismaService, UserService,ApplicationService],
})
export class AppModule {}
