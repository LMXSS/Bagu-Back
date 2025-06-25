import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  mixin,
  Type,
} from '@nestjs/common';
import { auth } from 'firebase-admin';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Roles } from 'src/utils/enum/roles.enum';

export function AuthGuard(requiredRole?: Roles): Type<CanActivate> {
  @Injectable()
  class RoleAuthGuard implements CanActivate {
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

        const userId = decodedToken.uid || decodedToken.id || decodedToken.claims?.id;
        const userRole = decodedToken.role;

        if (!userId) {
          throw new UnauthorizedException('Usuário não possui um ID válido');
        }

        if (requiredRole && userRole !== requiredRole) {
          throw new UnauthorizedException('Permissão insuficiente');
        }

        request.user = { id: userId, role: userRole, ...decodedToken };
        request.idToken = token;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }
  }

  return mixin(RoleAuthGuard);
}
