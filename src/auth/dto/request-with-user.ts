import { Request } from 'express';
import * as firebase from 'firebase-admin';

export interface RequestWithUser extends Request {
  user: firebase.auth.DecodedIdToken;
  idToken: string;
}
