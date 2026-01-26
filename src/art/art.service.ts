import {
  BadRequestException,
  ConflictException,
  GoneException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ArtCommentDto, ArtDto, ArtNewDto } from './dto/art.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtService {
  constructor(private prisma: PrismaService) { }

  //#region Get All Arts
  async getAll(payload: ArtDto) {
    try {
      //#region Payload
      const { search, pageSize, page } = payload;
      //#endregion
      //#region Where
      const where: Prisma.ArtsWhereInput = search
        ? {
          app_action: 1,
          OR: [
            { code: { contains: search } },
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
        : { app_action: 1 };
      //#endregion
      //#region Pagination
      const currentPage = +page;
      const skip = (+page - 1) * +pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.arts.findMany({
          where,
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: +pageSize,
          select: {
            id: true,
            code: true,
            title: true,
            artsCategories: {
              select: {
                title: true,
              },
            },
            users: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                extentionname: true,
                avatar: true,
              },
            },
            artsFiles: {
              where: {
                app_action: 1,
              },
              select: {
                file: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
          },
        }),
        this.prisma.arts.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion


      results.forEach((it: any) => {
        it.users.avatar = it.users.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${it.users.avatar}` : null;
        it.artsFiles.forEach((file: any) => {
          file.file = file.file ? `${process.env.BACKEND_DOMAIN}/dl/${file.file}` : null;
        })
      })


      //#region Response
      return {
        results,
        totalItems,
        totalPages,
        currentPage,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      console.log('e : ', e)
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

  //#region Get Art
  async getByID(id: number) {
    try {
      //#region Transaction
      const result = await this.prisma.arts.findFirst({
        where: {
          id: +id,
          app_action: 1,
        },
        select: {
          id: true,
          code: true,
          title: true,
          description: true,
          properties: true,
          created_at: true,
          artsCategories: {
            select: {
              title: true,
              description: true,
            },
          },
          users: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              extentionname: true,
              avatar: true,
            },
          },
          artsFiles: {
            where: {
              app_action: 1,
            },
            select: {
              title: true,
              file: true,
            },
          },
          likes: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  extentionname: true,
                  avatar: true,
                },
              },
            },
          },
          comments: {
            select: {
              id: true,
              content: true,
              rate: true,
              created_at: true,
              user: {
                select: {
                  id: true,
                  firstname: true,
                  lastname: true,
                  extentionname: true,
                  avatar: true,
                },
              },
            },
          },
        },
      });
      //#endregion

      //#region Response
      if (result) {
        result.users.avatar = result.users.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${result.users.avatar}` : null;
        result.artsFiles.forEach((file: any) => {
          file.file = file.file ? `${process.env.BACKEND_DOMAIN}/dl/${file.file}` : null;
        })

        result.likes.forEach((l: any) => {
          l.user.avatar = l.user.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${l.user.avatar}` : null;
        })

        result.comments.forEach((c: any) => {
          c.user.avatar = c.user.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${c.user.avatar}` : null;
        })

        return result;
      } else {
        throw new GoneException('اطلاعاتی با این شناسه یافت نشد');
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

  //#region Get All Arts
  async getByArtist(artist_ref: number, payload: ArtDto) {
    try {
      //#region Payload
      const { search, pageSize, page } = payload;
      //#endregion
      //#region Where
      const where: Prisma.ArtsWhereInput = search
        ? {
          app_action: 1,
          user_ref: +artist_ref,
          OR: [
            { code: { contains: search } },
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
        : { user_ref: +artist_ref, app_action: 1 };
      //#endregion
      //#region Pagination
      const currentPage = +page;
      const skip = (+page - 1) * +pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.arts.findMany({
          where,
          orderBy: {
            created_at: 'desc',
          },
          skip,
          take: +pageSize,
          select: {
            id: true,
            code: true,
            title: true,
            artsCategories: {
              select: {
                title: true,
              },
            },
            users: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                extentionname: true,
                avatar: true,
              },
            },
            artsFiles: {
              where: {
                app_action: 1,
              },
              select: {
                file: true,
              },
            },
            likes: {
              select: {
                id: true,
              },
            },
          },
        }),
        this.prisma.arts.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion


      results.forEach((it: any) => {
        it.users.avatar = it.users.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${it.users.avatar}` : null;
        it.artsFiles.forEach((file: any) => {
          file.file = file.file ? `${process.env.BACKEND_DOMAIN}/dl/${file.file}` : null;
        })
      })


      //#region Response
      return {
        results,
        totalItems,
        totalPages,
        currentPage,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      console.log('e : ', e)
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

  //#region New Art
  async newArt(id: number, payload: ArtNewDto) {
    try {
      //#region Check Access
      const check = await this.prisma.users.findFirst({
        where: {
          app_action: 1, id: id, userTypes: {
            some: {
              type_ref: 2,
              app_action: 1,
            },
          }
        },
      });
      if (!check) {
        throw new GoneException('فقط هنرمندان می توانند ثبت اثر کنند ');
      }
      //#endregion

      //#region Create Art
      const art = await this.prisma.arts.create({
        data: {
          user_ref: id,
          cat_ref: payload.cat_ref,
          code: payload.code,
          title: payload.title,
          description: payload.description,
          properties: payload.properties,
          created_by: id,
        }
      });

      if (art) {

        //#region Create Art Files
        if (payload.files && payload.files.length > 0) {
          await this.prisma.artsFiles.createMany({
            data: payload.files.map((it: any) => ({
              art_ref: art.id,
              title: it.title,
              file: it.file,
              created_by: id,
            })),
          });
        }
        //#endregion

        return { message: 'انجام شد', data: { id: art?.id }, statusCode: HttpStatus.OK };
      }
      else {
        throw new GoneException('ثبت اثر با مشکل روبرو شد');
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.log(e);
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion

  //#region Like Art
  async like(id: number, art_ref: number) {
    try {
      //#region Check Access
      const check = await this.prisma.arts.findFirst({
        where: { app_action: 1, id: +art_ref },
      });
      if (!check) {
        throw new NotFoundException('اطلاعات این اثر یافت نشد');
      }
      //#endregion

      //#region Check Like
      const checkLike = await this.prisma.artLikes.findFirst({
        where: { user_ref: id, art_ref: +art_ref },
      });

      //#region Delete Like
      if (checkLike) {
        await this.prisma.artLikes.deleteMany({ where: { id: checkLike.id } });
        return { message: 'بی اثر شد', status: 0, statusCode: HttpStatus.OK };
      }
      //#endregion
      //#region Submit Like
      else {
        await this.prisma.artLikes.createMany({
          data: { art_ref: +art_ref, user_ref: id },
        });
        return { message: 'پسندیده شد', status: 1, statusCode: HttpStatus.OK };
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.log(e);
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion

  //#region Comment Art
  async comment(id: number, art_ref: number, payload: ArtCommentDto) {
    try {
      //#region Check Access
      const check = await this.prisma.arts.findFirst({
        where: { app_action: 1, id: +art_ref },
      });
      if (!check) {
        throw new NotFoundException('اطلاعات این اثر یافت نشد');
      }
      //#endregion

      //#region Check Comment
      const checkComment = await this.prisma.artComments.findFirst({
        where: { user_ref: id, art_ref: +art_ref },
      });

      //#region Delete Comment
      if (checkComment) {
        await this.prisma.artComments.deleteMany({ where: { id: checkComment.id } });
      }
      //#endregion
      //#region Submit Comment
      else {
        await this.prisma.artComments.createMany({
          data: { art_ref: +art_ref, user_ref: id, rate: payload.rate, content: payload.message },
        });
        return { message: 'انجام شد', statusCode: HttpStatus.OK };
      }
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      if (e instanceof ConflictException) {
        throw e;
      }
      if (e instanceof BadRequestException) {
        throw e;
      }
      console.log(e);
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion

}
