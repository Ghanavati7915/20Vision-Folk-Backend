import {
  BadRequestException,
  ConflictException,
  GoneException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(username: string, pass: string) {
    try {
      const user = await this.prisma.users.findUnique({
        where: { username },
      });

      if (!user) return null;
      if (pass != user.password) return null

      const { password, ...result } = user;
      return result;
    } catch (error) {
      return null;
    }
  }

  async login(username: string, password: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { username, app_action: 1 },
      });

      if (!user) throw new GoneException('اطلاعات صحیح نیست');
      if (password != user.password) throw new GoneException('رمز عبور صحیح نیست');

      const tokens = await this.getTokens(user);
      return tokens;
    } catch (e) {
      if (e instanceof GoneException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }


  }

  async register(username: string, password: string, firstname: string, lastname: string) {
    try {
      const user = await this.prisma.users.findFirst({
        where: { username, app_action: 1 },
      });

      if (user) throw new GoneException('این نام کاربری قبلاً انتخاب شده است');
      const newUser = await this.prisma.users.create({
        data: {
          username,
          password,
          firstname,
          lastname,
          uniquename: username,
          mobile: username,
          app_action: 1,
        },
      });

      await this.prisma.users.update({
        where: { id: newUser.id },
        data: { created_by: newUser.id },
      });

      const tokens = await this.getTokens(newUser);
      return tokens;
    } catch (e) {
      console.log('e: ', e)
      if (e instanceof GoneException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }


  }

  private async getTokens(user: any) {
    let Token: any = null;

    //#region Access Expire
    const accessExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN'); // مثلاً '900s'
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'); // مثلاً '7d'
    if (!accessExpiresIn || !refreshExpiresIn) {
      throw new Error('Missing JWT_EXPIRES_IN or JWT_REFRESH_EXPIRES_IN in config');
    }
    //#endregion

    //#region Expire Date
    const now = new Date();
    const accessExpireDate = new Date(now.getTime() + this.parseExpiresIn(accessExpiresIn)).getTime();
    const refreshExpireDate = new Date(now.getTime() + this.parseExpiresIn(refreshExpiresIn)).getTime();
    //#endregion

    //#region Generate Token
    let payload: TokenPayload = {
      userName: user.username,
      firstName: user.firstname,
      lastName: user.lastname,
      permissions: [],
      title: `${user.firstname} ${user.lastname}`,
      id: user.id,
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: accessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExpiresIn,
      }),
    ]);
    await this.updateRefreshToken(user.id, refreshToken);
    Token = {
      access: accessToken,
      refresh: refreshToken,
      accessExpireDate,
      refreshExpireDate,
      title: payload.title,
    }
    //#endregion

    return Token;
  }

  async logout(id: number) {
    await this.prisma.refreshTokens.deleteMany({
      where: { user_ref: id },
    });
  }

  async refreshTokens(id: number, refreshToken: string) {
    const user = await this.prisma.users.findUnique({
      where: { id: id },
    });
    if (!user) throw new UnauthorizedException('User not found');

    const storedToken = await this.prisma.refreshTokens.findFirst({
      where: { user_ref: user.id, token: refreshToken },
    });

    if (!storedToken || storedToken.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user);
    // await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private parseExpiresIn(expiresIn: string): number {
    const time = parseInt(expiresIn);
    if (expiresIn.endsWith('ms')) return time;
    if (expiresIn.endsWith('s')) return time * 1000;
    if (expiresIn.endsWith('m')) return time * 60 * 1000;
    if (expiresIn.endsWith('h')) return time * 60 * 60 * 1000;
    if (expiresIn.endsWith('d')) return time * 24 * 60 * 60 * 1000;
    throw new Error(`Unsupported expiresIn format: ${expiresIn}`);
  }

  private async updateRefreshToken(id: number, refreshToken: string) {
    const expires_at = new Date();

    // Get refresh token expiration time with null check
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');
    if (!refreshExpiresIn) {
      throw new Error('JWT_REFRESH_EXPIRES_IN is not defined in config');
    }

    // Convert expiration time to seconds (remove 's' if present and parse to integer)
    const expiresInSeconds = parseInt(refreshExpiresIn.replace(/s$/, ''), 10);
    if (isNaN(expiresInSeconds)) {
      throw new Error('Invalid JWT_REFRESH_EXPIRES_IN format');
    }

    expires_at.setSeconds(expires_at.getSeconds() + expiresInSeconds);

    await this.prisma.refreshTokens.upsert({
      where: {
        token: refreshToken // استفاده از فیلد unique
      },
      update: {
        token: refreshToken,
        expires_at,
        user_ref: id, // اضافه کردن این خط اگر نیاز است
      },
      create: {
        token: refreshToken,
        user_ref: id,
        expires_at,
      },
    });
  }






}
