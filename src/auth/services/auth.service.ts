import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { firstValueFrom } from 'rxjs';
import { FirebaseException } from 'src/common/exceptions/firebase.exception';
import { FirebaseService } from 'src/firebase/firebase.service';
import { isMoreThen18 } from 'src/utils/validation';
import { constants } from '../../config/constants.config';
import { AlterarSenhaDto } from '../dto/alterar-senha.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { AuthDto } from '../dto/auth.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { ConfigService } from '@nestjs/config';
import { EnvironmentDto } from 'src/common/dto/environment.dto';

@Injectable()
export class AuthService {
  auth: auth.Auth
  config: EnvironmentDto

  constructor(
    private readonly httpService: HttpService,
    private readonly authRepository: AuthRepository,
    private readonly firebaseService: FirebaseService,
    private configService: ConfigService<EnvironmentDto>
  ) {
    this.auth = this.firebaseService.getAuth();
    this.config = {
      FIREBASE_AUTH_API: this.configService.get('FIREBASE_AUTH_API') || '',
      FIREBASE_REFRESH_TOKEN_URL: this.configService.get('FIREBASE_REFRESH_TOKEN_URL') || '',
      API_KEY: this.configService.get('API_KEY') || '',
    };
  }

  async registerUser(authRegister: AuthRegisterDto) {
    try {

      if (!isMoreThen18(authRegister.birthdate)) {
        throw new BadRequestException('Usuário deve ter 18 anos ou mais');
      }

      const [userOnAuth, userOnDatabase] = await Promise.all([
        this.auth.getUserByEmail(authRegister.email).catch(() => null),
        this.authRepository.findUserByEmail(authRegister.email)
      ])

      if (!!userOnAuth && !!userOnDatabase) {
        throw new BadRequestException('Usuário ja cadastrado');
      }

      let requestBody = {
        email: authRegister.email,
        password: authRegister.password,
        returnSecureToken: false
      };

      await firstValueFrom(this.httpService.post(`${this.config.FIREBASE_AUTH_API}:signUp?key=${this.config.API_KEY}`, requestBody));

      // await this.auth.setCustomUserClaims('', { id: '' });

    } catch (err) {
      throw new BadRequestException(err?.response?.data);
    }
  }

  async loginUser(authLogin: AuthDto): Promise<AuthTokenDto> {
    try {
      let requestBody = {
        email: authLogin.email,
        password: authLogin.password,
        returnSecureToken: true
      };

      const response = await firstValueFrom(this.httpService.post(`${this.config.FIREBASE_AUTH_API}:signInWithPassword?key=${this.config.API_KEY}`, requestBody));
      const { localId, idToken, refreshToken, expiresIn } = response.data;

      return {
        token: idToken,
        refreshToken,
        expiresIn,
      }
    } catch (error) {
      throw new FirebaseException(error);
    }
  }

  async atualizarSenha(data: AlterarSenhaDto) {
    try {
      const dbUser = await this.authRepository.findUserByFirebaseId('');

      if (!dbUser) {
        throw new BadRequestException('Usuário não encontrado');
      }

      await this.auth.updateUser('', {
        password: data.senha,
      });
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  async refreshToken(authLogin: Pick<AuthTokenDto, 'refreshToken'>): Promise<AuthTokenDto> {
    try {
      const url = `${this.config.FIREBASE_REFRESH_TOKEN_URL}?key=${this.config.API_KEY}`;

      const data = {
        grant_type: 'refresh_token',
        refresh_token: authLogin.refreshToken,
      };

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };

      const response = await firstValueFrom(this.httpService.post(url, data, config));
      const { user_id, access_token, refresh_token, expires_in } = response.data;

      return {
        token: access_token,
        refreshToken: refresh_token,
        expiresIn: expires_in,
      }

    } catch (error) {
      throw new UnauthorizedException(error.message || 'Falha na autenticação');
    }
  }
}
