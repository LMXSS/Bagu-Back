import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as admin from 'firebase-admin';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    FirebaseService,
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const firebaseConfig = configService.get<string>('FIREBASE');
        if (!firebaseConfig) {
          throw new Error('Missing FIREBASE config in environment');
        }

        const serviceAccount = JSON.parse(firebaseConfig);

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        return admin;
      },
    },
  ],
  exports: [FirebaseService, 'FIREBASE_ADMIN'],
})
export class FirebaseModule { }
