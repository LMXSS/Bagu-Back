import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guard/auth.guard';
import { Roles } from './utils/enum/roles.enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @UseGuards(AuthGuard(Roles.ADMIN))
  getHello(): string {
    return this.appService.getHello();
  }
}
