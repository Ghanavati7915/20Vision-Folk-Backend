import {
  Controller,
  Post,
  Body,
  UseGuards, Request, Get, Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSkillDto } from './dto/create-base.dto';
import { FilterDto } from '../common/DTOs/shared';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Base')
@ApiBearerAuth('JWT-auth')
@Controller('base')
@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor(private readonly baseService: BaseService) { }

  //#region Skills
  @Post('/skills')
  @ApiOperation({ summary: 'Create a new skill' })
  @ApiResponse({ status: 201, description: 'skill created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  skillNew(@Request() req: any, @Body() payload: CreateSkillDto) {
    return this.baseService.skillNew(req.user.sub, payload);
  }

  @Get('/skills')
  @ApiOperation({ summary: 'Get all Skills' })
  @ApiResponse({ status: 200, description: 'List of Skills' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  skillGetAll(@Body() filter: FilterDto) {
    return this.baseService.skillGetAll(filter);
  }
  //#endregion

  //#region Cities
  @Get('/countries')
  @ApiOperation({ summary: 'Get all Countries' })
  @ApiResponse({ status: 200, description: 'List of Countries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  countriesGetAll() {
    return this.baseService.countriesGetAll();
  }

  @Get('/provinces/:id')
  @ApiOperation({ summary: 'Get all Provinces' })
  @ApiResponse({ status: 200, description: 'List of Provinces' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  provincesGetAll(@Param('id') id: string) {
    return this.baseService.provincesGetAll(+id);
  }

  @Get('/cities/:id')
  @ApiOperation({ summary: 'Get all Cities' })
  @ApiResponse({ status: 200, description: 'List of Cities' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  citiesGetAll(@Param('id') id: string) {
    return this.baseService.citiesGetAll(+id);
  }

  @Public()
  @Get('/city')
  @ApiOperation({ summary: 'Get all Cities From All Countries And All Provinces' })
  @ApiResponse({ status: 200, description: 'List of All Cities' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  cityGetAll() {
    return this.baseService.cityGetAll();
  }
  //#endregion
}