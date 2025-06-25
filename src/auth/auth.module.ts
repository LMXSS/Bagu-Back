import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    HttpModule.register({}),
    FirebaseModule,
    ConfigModule
  ]
})
export class AuthModule { }
