import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPage } from '../pages/reset/reset';
import { AboutPage } from '../pages/about/about';
import { IdentityPage } from '../pages/identity/identity';
import { PassportPage } from '../pages/passport/passport';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../service/auth.service';
import { Firebase } from '@ionic-native/firebase';

@NgModule({
  declarations: [
  MyApp,
  HomePage,
  LoginPage,
  SignupPage,
  ResetPage,
  AboutPage,
  IdentityPage,
  PassportPage
  ],
  imports: [
  BrowserModule,
  IonicModule.forRoot(MyApp),
  AngularFireModule.initializeApp(FIREBASE_CONFIG),
  AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
  MyApp,
  HomePage,
  LoginPage,
  SignupPage,
  ResetPage,
  AboutPage,
  IdentityPage,
  PassportPage
  ],
  providers: [
  StatusBar,
  SplashScreen,
  Toast,
  AuthService,
  Firebase,
  {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
