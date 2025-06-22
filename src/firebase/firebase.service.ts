import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebase: typeof admin) { }

  getAuth(): admin.auth.Auth {
    return this.firebase.auth();
  }
}
