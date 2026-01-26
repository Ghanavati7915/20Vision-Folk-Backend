import {
  Controller,
  Body,
  UseGuards,
  Param,
  Get,
  Request,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ArtService } from './art.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { ArtCommentDto, ArtDto, ArtNewDto } from './dto/art.dto';

@ApiTags('Art')
@ApiBearerAuth('JWT-auth')
@Controller('art')
@UseGuards(JwtAuthGuard)
export class ArtController {
  constructor(private readonly artService: ArtService) { }

  //#region Get All
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get All' })
  @ApiResponse({ status: 200, description: 'Arts Data' })
  @ApiResponse({ status: 404, description: 'Arts not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAll(@Query() payload: ArtDto) {
    return this.artService.getAll(payload);
  }
  //#endregion

  //#region Get Art
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get Art By ID' })
  @ApiResponse({ status: 200, description: 'Art Data' })
  @ApiResponse({ status: 404, description: 'Art not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getByID(@Param('id') id: number) {
    return this.artService.getByID(id);
  }
  //#endregion

  //#region Get Arts By Artist
  @Public()
  @Get('artist/:id')
  @ApiOperation({ summary: 'Get All Arts By Artist ID ' })
  @ApiResponse({ status: 200, description: 'Arts Data' })
  @ApiResponse({ status: 404, description: 'Arts not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getByArtist(@Param('id') id: number, @Query() payload: ArtDto) {
    return this.artService.getByArtist(id, payload);
  }
  //#endregion

  //#region New Art
  @Post()
  @ApiOperation({ summary: 'New Art' })
  @ApiResponse({ status: 201, description: 'Art Created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  newArt(@Request() req: any, @Body() payload: ArtNewDto) {
    return this.artService.newArt(req.user.id, payload);
  }
  //#endregion

  //#region Like Art
  @Post('like/:id')
  @ApiOperation({ summary: 'Like a Art' })
  @ApiResponse({ status: 201, description: 'Art Liked successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  like(@Request() req: any, @Param('id') id: number) {
    return this.artService.like(req.user.id, id);
  }
  //#endregion

  //#region Comment Art
  @Post('comment/:id')
  @ApiOperation({ summary: 'Commented on Art' })
  @ApiResponse({ status: 201, description: 'Art Commented successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  comment(
    @Request() req: any,
    @Param('id') id: number,
    @Body() payload: ArtCommentDto,
  ) {
    return this.artService.comment(req.user.id, id, payload);
  }
  //#endregion
}
