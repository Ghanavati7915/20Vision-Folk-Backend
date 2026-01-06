import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from './decorators/public.decorator';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload.username, payload.password);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'User Register' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 200, description: 'Register successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async register(@Body() payload: RegisterDto) {
    return this.authService.register(payload.username, payload.password, payload.firstname, payload.lastname);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh2')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refreshToken(@Request() req) {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('userInfo')
  @ApiOperation({ summary: 'Get current user info from token' })
  @ApiResponse({ status: 200, description: 'User info retrieved successfully' })
  async userInfo(@Request() req) {
    return {
      id: req.user.id,
      userName: req.user.userName,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      permissions: req.user.permissions,
      title: req.user.title,
    };
  }
}
