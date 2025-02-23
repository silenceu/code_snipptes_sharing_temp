import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HomePageImg } from './entities/home-page-img.entity';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(HomePageImg)
    private readonly homePageImgRepo: Repository<HomePageImg>,
  ) {}

  async getAllHomePageImgs(): Promise<HomePageImg[]> {
    return this.homePageImgRepo.find();
  }
}
