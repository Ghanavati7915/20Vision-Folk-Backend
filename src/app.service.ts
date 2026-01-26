import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseService } from './base/base.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly baseService: BaseService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async onApplicationBootstrap() {
    await this.baseService.seedCitiesIfNotExists();
    await this.baseService.seedSkillsIfNotExists();
    await this.baseService.seedTypesIfNotExists();
    await this.baseService.seedCertificatesIfNotExists();
    await this.baseService.seedCategoriesIfNotExists();
  }
}
