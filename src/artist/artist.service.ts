import {
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) { }

  //#region Get All Artists
  async getAll() {
    try {
      //#region Transaction
      const results = await this.prisma.users.findMany({
        where: {
          app_action: 1,
          userTypes: {
            some: {
              type_ref: 2,
              app_action: 1,
            },
          },
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          extentionname: true,
          gender: true,
          avatar: true,
          userSkills: {
            where: {
              app_action: 1,
            },
            select: {
              skill: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
      //#endregion

      //#region Response
      return { results };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

}
