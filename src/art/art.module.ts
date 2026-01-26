import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArtService } from './art.service';
import { ArtController } from './art.controller';

@Module({
  controllers: [ArtController],
  providers: [ArtService, PrismaService],
  exports: [ArtService],
})
export class ArtModule { }