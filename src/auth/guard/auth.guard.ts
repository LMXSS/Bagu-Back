import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { auth } from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
@Injectable()
export class AuthGuard implements CanActivate {
  private auth: auth.Auth;

  constructor(private readonly firebaseService: FirebaseService) {
    this.auth = this.firebaseService.getAuth();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decodedToken = await this.auth.verifyIdToken(token);

      const userId = decodedToken.id || decodedToken.claims?.id;

      if (!userId) {
        throw new UnauthorizedException('Usuário não possui um ID válido');
      }

      request.user = { id: userId, ...decodedToken };
      request.idToken = token;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
