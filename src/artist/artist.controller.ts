import {
  Controller,
  Body,
  UseGuards, Request, Patch, Param, Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArtistService } from './artist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';


@ApiTags('Artist')
@ApiBearerAuth('JWT-auth')
@Controller('artist')
@UseGuards(JwtAuthGuard)
export class ArtistController {
  constructor(private readonly artistService: ArtistService) { }


  //#region Get All
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get All' })
  @ApiResponse({ status: 200, description: 'Artist Data' })
  @ApiResponse({ status: 404, description: 'Artist not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll() {
    return this.artistService.getAll();
  }
  //#endregion

}