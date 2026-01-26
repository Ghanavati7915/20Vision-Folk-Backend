import {
  Controller,
  UseGuards, Get, Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BaseService } from './base.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Base')
@ApiBearerAuth('JWT-auth')
@Controller('base')
@UseGuards(JwtAuthGuard)
export class BaseController {
  constructor(private readonly baseService: BaseService) { }

  //#region categories
  @Public()
  @Get('/categories')
  @ApiOperation({ summary: 'Get all Categories' })
  @ApiResponse({ status: 200, description: 'List of Categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  categories() {
    return this.baseService.categories();
  }
  //#endregion

  //#region Skills
  @Public()
  @Get('/skills')
  @ApiOperation({ summary: 'Get all Skills' })
  @ApiResponse({ status: 200, description: 'List of Skills' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  skills() {
    return this.baseService.skills();
  }
  //#endregion

  //#region Cities
  @Public()
  @Get('/countries')
  @ApiOperation({ summary: 'Get all Countries' })
  @ApiResponse({ status: 200, description: 'List of Countries' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  countriesGetAll() {
    return this.baseService.countriesGetAll();
  }

  @Public()
  @Get('/provinces/:id')
  @ApiOperation({ summary: 'Get all Provinces' })
  @ApiResponse({ status: 200, description: 'List of Provinces' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  provincesGetAll(@Param('id') id: string) {
    return this.baseService.provincesGetAll(+id);
  }

  @Public()
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


  //#region Search
  @Public()
  @Get('/search/:text')
  @ApiOperation({ summary: 'Search In Artist and Arts' })
  @ApiResponse({ status: 200, description: 'List of Search Result' })
  search(@Param('text') text: string) {
    return this.baseService.search(text);
  }
  //#endregion

}