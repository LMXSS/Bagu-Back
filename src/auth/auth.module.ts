import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthService, AuthRepository, AuthGuard],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    HttpModule.register({}),
    FirebaseModule,
    ConfigModule
  ]
})
export class AuthModule { }
