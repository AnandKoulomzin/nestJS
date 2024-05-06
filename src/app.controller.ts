import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() //where path starts
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() //where path needs to get
  @Header('Content-Type', 'text/html')
  getHello(): string {
    return this.appService.getHello();
  }
}
