import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule, 
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [AuthService],
})
export class AppModule {}
