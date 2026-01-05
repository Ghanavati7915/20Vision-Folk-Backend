import {
  ConflictException,
  GoneException,
  HttpStatus,
  Injectable, NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateJobFieldTitleNewDto,
  CreateSkillDto,
} from './dto/create-base.dto';
import { FilterDto } from 'src/common/DTOs/shared';
import { Prisma } from '@prisma/client';
import { CityType } from '../common/enums/enums';

@Injectable()
export class BaseService {
  constructor(private prisma: PrismaService) { }

  //#region Seed
  //#region Seed Cities
  async seedCitiesIfNotExists() {
    const existing = await this.prisma.cities.findMany({
      where: { app_action: 1 },
    });

    if (existing.length > 10) {
      console.log('✅ Cities already exist.');
      return;
    }

    console.log('🌱 Seeding cities...');

    await this.prisma.$transaction(async (tx) => {
      //#region Create Country
      const country = await tx.cities.create({
        data: {
          title: 'ایران',
          type: CityType.Country,
          parent_ref: 0,
          created_by: 0,
        },
      });

      //#region Create Province
      const province = await tx.cities.create({
        data: {
          title: 'اصفهان',
          type: CityType.Province,
          parent_ref: country.id,
          created_by: 0,
        },
      });

      //#region Create Cities of Province
      const isfahanCities = [
        'اصفهان',
        'خمینی‌شهر',
        'نجف‌آباد',
        'شهرضا',
        'مبارکه',
        'کاشان',
        'آران و بیدگل',
        'فلاورجان',
        'لنجان',
        'گلپایگان',
        'خوانسار',
        'نائین',
        'نطنز',
        'دهاقان',
        'فریدن',
        'فریدون‌شهر',
        'سمیرم',
        'برخوار',
        'تیران و کرون',
        'چادگان',
        'خور و بیابانک',
        'ورزنه',
        'زینل‌آباد',
      ];

      const cityData = isfahanCities.map((city) => ({
        title: city,
        type: CityType.City,
        parent_ref: province.id,
        created_by: 0,
      }));

      await tx.cities.createMany({ data: cityData });
      //#endregion

      console.log('✅ Cities seeded successfully.');
    });
  }
  //#endregion

  //#region Skills
  async skillNew(
    creator: number,
    payload: CreateSkillDto,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      //#region Check Exist
      const existing = await this.prisma.skills.findFirst({
        where: { title: payload.title, app_action: 1 },
      });
      if (existing) {
        throw new ConflictException('قبلاً ثبت شده است');
      }
      //#endregion
      //#region Create
      await this.prisma.skills.create({
        data: {
          title: payload.title,
          description: payload.description,
          created_by: creator,
        },
      });
      //#endregion
      //#region Response
      return {
        message: 'ثبت با موفقیت انجام شد',
        statusCode: HttpStatus.CREATED,
      };
      //#endregion
    }
    catch (e: any) {
      if (e instanceof ConflictException) {
        throw e;
      }
      throw new GoneException('مشکلی در ثبت رخ داده است');
    }
  }

  async skillGetAll(filter: FilterDto) {
    try {
      //#region Payload
      const { search, order, pagination } = filter;
      //#endregion
      //#region Where
      const where: Prisma.SkillsWhereInput = search
        ? {
          app_action: 1,
          OR: [
            {
              title: {
                contains: search,
              },
            },
          ],
        }
        : { app_action: 1 };
      //#endregion
      //#region Order
      const allowedOrderFields = ['title', 'created_at'];
      const orderByField = allowedOrderFields.includes(order?.orderBy)
        ? order.orderBy
        : 'created_at';

      const direction = order?.order === 1 ? 'asc' : 'desc';

      const orderBy: Prisma.SkillsOrderByWithRelationInput = {
        [orderByField]: direction,
      };
      //#endregion
      //#region Pagination
      const currentPage = pagination?.page || 1;
      const pageSize = Math.min(pagination?.pageSize || 10, 100); // حداکثر 100
      const skip = (currentPage - 1) * pageSize;
      //#endregion
      //#region Transaction
      const [results, totalItems] = await this.prisma.$transaction([
        this.prisma.skills.findMany({
          where,
          orderBy,
          skip,
          take: pageSize,
          select: {
            id: true,
            title: true,
            description: true,
          },
        }),
        this.prisma.skills.count({ where }),
      ]);
      const totalPages = Math.ceil(totalItems / pageSize);
      //#endregion
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
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion

  //#region Cities
  async countriesGetAll() {
    try {
      //#region Query
      const results = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'Country' },
      })
      //#endregion
      //#region Response
      return {
        results,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  async provincesGetAll(id: number) {
    try {
      //#region Query
      const results = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'Province', parent_ref: id },
      })
      //#endregion
      //#region Response
      return {
        results,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  async citiesGetAll(id: number) {
    try {
      //#region Query
      const results = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'City', parent_ref: id },
      })
      //#endregion
      //#region Response
      return {
        results,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  async cityGetAll() {
    try {
      let results: any[] = [];
      //#region Countries
      const _countries = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'Country' },
      })
      //#endregion

      for (const country of _countries) {
        //#region Provinces
        const _provinces = await this.prisma.cities.findMany({
          where: { app_action: 1, type: 'Province', parent_ref: country.id },
        })
        //#endregion

        for (const province of _provinces) {
          //#region Provinces
          const cities = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'City', parent_ref: province.id },
          })
          //#endregion

          //#region Provinces
          cities.forEach((city: any) => {
            results.push({ id: city.id, title: city.title, province: { id: province.id, title: province.title }, country: { id: country.id, title: country.title } });
          })
          //#endregion
        }
      }

      //#region Response
      return {
        results,
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
}
