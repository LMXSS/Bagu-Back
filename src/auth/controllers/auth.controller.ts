import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AlterarSenhaDto } from '../dto/alterar-senha.dto';
import { AuthRegisterDto } from '../dto/auth-register.dto';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { AuthDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário cadastrado com sucesso',
  })
  async register(@Body() registerDto: AuthRegisterDto) {
    await this.authService.registerUser(registerDto);
    return {
      message: 'Usuário cadastrado com sucesso',
    };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiOkResponse({
    description: 'Usuário autenticado com sucesso',
    type: AuthTokenDto,
  })
  async login(@Body() authDto: AuthDto) {
    return this.authService.loginUser(authDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Atualizar token de autenticação' })
  @ApiBody({ schema: { example: { refreshToken: 'seu_refresh_token_aqui' } } })
  @ApiOkResponse({
    description: 'Novo token gerado com sucesso',
    type: AuthTokenDto,
  })
  async refreshToken(@Body() authTokenDto: Pick<AuthTokenDto, 'refreshToken'>) {
    return this.authService.refreshToken(authTokenDto);
  }

  @Post('update-password')
  @ApiOperation({ summary: 'Alterar senha do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Senha alterada com sucesso!',
  })
  async alterarSenha(@Body() data: AlterarSenhaDto) {
    await this.authService.atualizarSenha(data);
    return {
      message: 'Senha alterada com sucesso!'
    }
  }
}
