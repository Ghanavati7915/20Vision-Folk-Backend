import { GoneException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
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
      //#endregion
      //#region Create Province
      const province = await tx.cities.create({
        data: {
          title: 'اصفهان',
          type: CityType.Province,
          parent_ref: country.id,
          created_by: 0,
        },
      });
      //#endregion
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

  //#region Seed Skills
  async seedSkillsIfNotExists() {
    const existing = await this.prisma.skills.findMany({
      where: { app_action: 1 },
    });

    if (existing.length > 0) {
      console.log('✅ Skills already exist.');
      return;
    }

    console.log('🌱 Seeding skills ...');
    //#region Create Skills
    const items = [
      'مینا سازی',
      'سوخت معرق و منبت چرم',
      'نگارگری',
      'خاتم کاری',
      'قلم زنی',
      'مشبک فلز',
      'احجام فلزی',
      'تئاتر',
      'گردشگری',
    ];

    const payload = items.map((it) => ({
      title: it,
      created_by: 0,
    }));

    await this.prisma.skills.createMany({ data: payload });
    //#endregion

    console.log('✅ Skills seeded successfully.');
  }
  //#endregion

  //#region Seed Types
  async seedTypesIfNotExists() {
    const existing = await this.prisma.types.findMany({
      where: { app_action: 1 },
    });

    if (existing.length > 0) {
      console.log('✅ Types already exist.');
      return;
    }

    console.log('🌱 Seeding types ...');
    //#region Create Types
    const items = ['کاربر', 'هنرمند'];

    const payload = items.map((it) => ({
      title: it,
      created_by: 0,
    }));

    await this.prisma.types.createMany({ data: payload });
    //#endregion

    console.log('✅ Types seeded successfully.');
  }
  //#endregion

  //#region Seed Certificates
  async seedCertificatesIfNotExists() {
    const existing = await this.prisma.certificates.findMany({
      where: { app_action: 1 },
    });

    if (existing.length > 0) {
      console.log('✅ Certificates already exist.');
      return;
    }

    console.log('🌱 Seeding Certificates ...');
    //#region Create certificates
    const items = ['Verified'];

    const payload = items.map((it) => ({
      title: it,
      created_by: 0,
    }));

    await this.prisma.certificates.createMany({ data: payload });
    //#endregion

    console.log('✅ Certificates seeded successfully.');
  }
  //#endregion

  //#region Seed Categories
  async seedCategoriesIfNotExists() {
    const existing = await this.prisma.artsCategories.findMany({
      where: { app_action: 1 },
    });

    if (existing.length > 0) {
      console.log('✅ Categories already exist.');
      return;
    }

    console.log('🌱 Seeding Categories ...');
    //#region Create Categories
    const items = [
      'عمومی',
      'نقاشی و تصویرگری',
      'خطاطی و تذهیب',
      'صنایع دستی',
      'هنرهای تجسمی'
    ];

    const payload = items.map((it) => ({
      title: it,
      created_by: 0,
    }));

    await this.prisma.artsCategories.createMany({ data: payload });
    //#endregion

    console.log('✅ Categories seeded successfully.');
  }
  //#endregion

  //#endregion

  //#region Skills
  async skills() {
    try {
      //#region Transaction
      const results = await this.prisma.skills.findMany({
        where: { app_action: 1 },
        select: {
          id: true,
          title: true,
          description: true,
        },
      });
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
  //#endregion

  //#region Categories
  async categories() {
    try {
      //#region Transaction
      const results = await this.prisma.artsCategories.findMany({
        where: { app_action: 1 },
        select: {
          id: true,
          title: true,
          description: true,
        },
      });
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
  //#endregion

  //#region Cities
  async countriesGetAll() {
    try {
      //#region Query
      const results = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'Country' },
      });
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
      });
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
      });
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
      const results: any[] = [];
      //#region Countries
      const _countries = await this.prisma.cities.findMany({
        where: { app_action: 1, type: 'Country' },
      });
      //#endregion

      for (const country of _countries) {
        //#region Provinces
        const _provinces = await this.prisma.cities.findMany({
          where: { app_action: 1, type: 'Province', parent_ref: country.id },
        });
        //#endregion

        for (const province of _provinces) {
          //#region Provinces
          const cities = await this.prisma.cities.findMany({
            where: { app_action: 1, type: 'City', parent_ref: province.id },
          });
          //#endregion

          //#region Provinces
          cities.forEach((city: any) => {
            results.push({
              id: city.id,
              title: city.title,
              province: { id: province.id, title: province.title },
              country: { id: country.id, title: country.title },
            });
          });
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

  //#region Search
  async search(search: string) {
    try {
      //#region Transaction
      const artists = await this.prisma.users.findMany({
        where: {
          app_action: 1,
          OR: [
            {
              firstname: { contains: search },
            },
            {
              lastname: { contains: search },
            },
          ],
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
      const arts = await this.prisma.arts.findMany({
        where: {
          app_action: 1,
          OR: [{ code: { contains: search } }, { title: { contains: search } }],
        },
        select: {
          id: true,
          title: true,
          code: true,
          cat_ref: true,
          artsFiles: {
            where: {
              app_action: 1,
            },
            select: {
              file: true,
            },
          },
        },
      });
      //#endregion
      //#region Response


      artists.forEach((it: any) => {
        it.avatar = it.avatar ? `${process.env.BACKEND_DOMAIN}/dl/${it.avatar}` : null;
      })


      arts.forEach((it: any) => {
        it.artsFiles.forEach((file: any) => {
          file.file = file.file ? `${process.env.BACKEND_DOMAIN}/dl/${file.file}` : null;
        })
      })


      return {
        results: {
          arts,
          artists,
        },
        message: 'موفق',
      };
      //#endregion
    } catch (e: any) {
      throw new GoneException('مشکلی در دریافت اطلاعات رخ داده است');
    }
  }
  //#endregion
}
