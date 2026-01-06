import {
  BadRequestException,
  ConflictException,
  GoneException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { isNationalCode } from '../common/methods/validator';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  //#region Get Basic Info By ID
  async get(id: number) {
    try {
      //#region Transaction
      const result = await this.prisma.users.findFirst({
        where: { app_action: 1, id },
        select: {
          firstname: true,
          lastname: true,
          extentionname: true,
          gender: true,
          avatar: true,
          bio_long: true,
          bio_small: true,
          address: true,
          email: true,
          website: true,
          nationalCode: true,
          socialNetworks: true,
          birthDate: true,
          city_ref: true,
          userSkills: {
            where: {
              app_action: 1,
            },
            select: {
              skill: {
                select: {
                  id: true,
                  title: true,
                }
              }
            },
          },
          userTypes: {
            where: {
              app_action: 1,
            },
            select: {
              type: {
                select: {
                  id: true,
                  title: true,
                }
              }
            },
          },
        },
      });
      //#endregion

      //#region Check Exist
      if (!result) {
        throw new NotFoundException(' اطلاعات شما یافت نشد');
      }
      //#endregion

      //#region Response
      return { result };
      //#endregion
    } catch (e: any) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

  //#region Update
  async update(id: number, payload: UserDto) {
    try {
      //#region Check Access
      const userFind = await this.prisma.users.findFirst({
        where: { app_action: 1, id },
      });
      if (!userFind) {
        throw new NotFoundException('اطلاعات شما یافت نشد');
      }
      if (payload.nationalCode) {
        if (!isNationalCode(payload.nationalCode)) {
          throw new BadRequestException('کد ملی را بصورت صحیح ارسال کنید');
        }
      }
      //#endregion

      //#region Update User Info
      await this.prisma.users.updateMany({
        where: { id },
        data: {
          firstname: payload.firstname,
          lastname: payload.lastname,
          extentionname: payload.extentionname,
          gender: payload.gender,
          avatar: payload.avatar,
          bio_long: payload.bio_long,
          bio_small: payload.bio_small,
          address: payload.address,
          email: payload.email,
          website: payload.website,
          nationalCode: payload.nationalCode,
          socialNetworks: payload.socialNetworks,
          birthDate: payload.birthDate,
          city_ref: payload.city_ref,
          modify_by: id,
          modify_at: new Date(),
        },
      });
      //#endregion


      //#region User Skills
      //#region Delete User Skills
      await this.prisma.userSkills.deleteMany({
        where: { user_ref: id },
      });
      //#endregion

      //#region Create User Skills
      if (payload.skills && payload.skills.length > 0) {
        await this.prisma.userSkills.createMany({
          data: payload.skills.map((skillId: number) => ({
            user_ref: id,
            skill_ref: skillId,
            created_by: id,
          })),
        });
      }
      //#endregion
      //#endregion

      //#region User Type
      if (!payload.isArtist) {
        //#region Delete User Artist Type
        await this.prisma.userTypes.updateMany({ where: { user_ref: id }, data: { app_action: 0 } });
        //#endregion
      }
      else {
        const checkType = await this.prisma.userTypes.findFirst({ where: { app_action: 1, user_ref: id, type_ref: 2 } });
        if (!checkType) {
          await this.prisma.userTypes.createMany({ data: { user_ref: id, created_by: id, type_ref: 2 } });
        }
      }
      //#endregion

      //#region Response
      return {
        message: 'ویرایش با موفقیت انجام شد',
        statusCode: HttpStatus.OK,
      };
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
      console.log(e)
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }
  //#endregion
}
