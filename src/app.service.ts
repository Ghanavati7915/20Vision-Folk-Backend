import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BaseService } from './base/base.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly baseService: BaseService) { }

  async onApplicationBootstrap() {
    await this.baseService.seedCitiesIfNotExists();
  }
}
