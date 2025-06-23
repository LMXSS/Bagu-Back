import { HttpException, HttpStatus, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';

export class FirebaseException extends HttpException {
  constructor(error: any) {
    const firebaseError = error?.response?.data?.error;

    if (firebaseError) {
      switch (firebaseError.message) {
        case 'INVALID_PASSWORD':
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_LOGIN_CREDENTIALS':
          throw new UnauthorizedException('E-mail ou senha incorretos.');
        case 'USER_DISABLED':
          throw new ForbiddenException('Usuário desativado.');
        default:
          throw new BadRequestException(`Erro de autenticação: ${firebaseError.message}`);
      }
    }

    super('Erro inesperado ao tentar autenticar.', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
