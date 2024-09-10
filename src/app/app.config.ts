import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"animovi","appId":"1:1051399303540:web:78e8c9042cea860e333c21","storageBucket":"animovi.appspot.com","locationId":"asia-south1","apiKey":"AIzaSyDQuTFs6HlS_icr4Dw9So8nPLxLZYbkM88","authDomain":"animovi.firebaseapp.com","messagingSenderId":"1051399303540","measurementId":"G-LY4B7QV1MB"})), provideFirestore(() => getFirestore())]
};
