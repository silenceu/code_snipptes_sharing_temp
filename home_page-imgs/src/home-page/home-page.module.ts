import { Module } from '@nestjs/common';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomePageImg } from './entities/home-page-img.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HomePageImg])],
  controllers: [HomePageController],
  providers: [HomePageService],
})
export class HomePageModule {}
