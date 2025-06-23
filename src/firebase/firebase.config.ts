import * as firebase from 'firebase-admin';

export function initializeFirebase() {
  if (process.env.FIREBASE == undefined)
    throw new Error('ERROR: FIREBASE CONFIGURATION (.ENV)');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const serviceAccount = JSON.parse(process.env.FIREBASE);

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
      });
    }
  } catch (error) {
    throw new Error(`Error: initializing Firebase: ${error}`);
  }
}
