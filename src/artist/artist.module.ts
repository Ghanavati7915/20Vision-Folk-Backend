import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';

@Module({
  controllers: [ArtistController],
  providers: [ArtistService, PrismaService],
  exports: [ArtistService],
})
export class ArtistModule { }