import {
  GoneException,
  Injectable,
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
          userCertificates: {
            where: {
              app_action: 1,
            },
            select: {
              certificate: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
            },
          },
        },
      });
      //#endregion

      results.forEach((it:any)=>{
         it.avatar = it.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${it.avatar}` : null;
      })


      //#region Response
      return { results };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion


  //#region Get Artist
  async getByID(id: number) {
    try {
      //#region Transaction
      const result = await this.prisma.users.findFirst({
        where: {
          id: +id,
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
          bio_long: true,
          bio_small: true,
          email: true,
          website: true,
          socialNetworks: true,
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
          userCertificates: {
            where: {
              app_action: 1,
            },
            select: {
              certificate: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
            },
          },
          arts: {
            where: {
              app_action: 1,
            },
            select: {
              code: true,
              title: true,
              description: true,
              properties: true,
              artsFiles: {
                select: {
                  id: true,
                  title: true,
                  file: true,
                },
              },
            },
          },
        },
      });

      //#endregion

      //#region Response
      if (result) {
        result.avatar = result.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${result.avatar}` : null;
        return result;
      } else {
        throw new GoneException("اطلاعاتی با این شناسه یافت نشد");
      }

      //#endregion
    } catch (e: any) {
      if (e instanceof GoneException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

}
