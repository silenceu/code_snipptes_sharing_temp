import { Controller, Get, UseFilters } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { HttpExceptionFilter } from '../untis/exception-filters/http-exception.filter';
import { AnyExceptionsFilter } from '../untis/exception-filters/any-exception.filter';

@Controller('api/home-page')
@UseFilters(new HttpExceptionFilter())
@UseFilters(new AnyExceptionsFilter())
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  @Get('/imgs')
  async getAllHomePageImgs(): Promise<object> {
    const imgs = await this.homePageService.getAllHomePageImgs();
    return { imgs };
  }
}
