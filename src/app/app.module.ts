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
import { ExportPage } from '../pages/export/export';
import { AddFolderPage } from '../pages/add-folder/add-folder';
import { EditFolderPage } from '../pages/edit-folder/edit-folder';
import { EditImagePage } from '../pages/edit-image/edit-image';
import { FolderPage } from '../pages/folder/folder';
import { ImagePassportPage } from '../pages/image-passport/image-passport';
import { InfoPassportPage } from '../pages/info-passport/info-passport';
import { ImageIdentityPage } from '../pages/image-identity/image-identity';
import { InfoIdentityPage } from '../pages/info-identity/info-identity';
import { AddImagePassportPage } from '../pages/add-image-passport/add-image-passport';
import { AddImageIdentityPage } from '../pages/add-image-identity/add-image-identity';
import { IdentityBackPage } from '../pages/identity-back/identity-back';
import { ImageIdentityBackPage } from '../pages/image-identity-back/image-identity-back';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../service/auth.service';
import { Firebase } from '@ionic-native/firebase';
import { CameraPreview } from '@ionic-native/camera-preview';
import { SQLite } from '@ionic-native/sqlite';
import { File } from '@ionic-native/file';
import { HttpClientModule } from '@angular/common/http';
import { SocialSharing } from '@ionic-native/social-sharing';
import { FileOpener } from '@ionic-native/file-opener';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageProvider } from '../providers/image/image';

@NgModule({
  declarations: [
  MyApp,
  HomePage,
  LoginPage,
  SignupPage,
  ResetPage,
  AboutPage,
  IdentityPage,
  PassportPage,
  AddFolderPage,
  EditFolderPage,
  ImagePassportPage,
  ImageIdentityPage,
  InfoPassportPage,
  InfoIdentityPage,
  FolderPage,
  AddImagePassportPage,
  AddImageIdentityPage,
  ExportPage,
  IdentityBackPage,
  ImageIdentityBackPage,
  EditImagePage
  ],
  imports: [
  BrowserModule,
  HttpClientModule,
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
  PassportPage,
  AddFolderPage,
  EditFolderPage,
  ImagePassportPage,
  ImageIdentityPage,
  InfoPassportPage,
  InfoIdentityPage,
  FolderPage,
  AddImagePassportPage,
  AddImageIdentityPage,
  ExportPage,
  IdentityBackPage,
  ImageIdentityBackPage,
  EditImagePage
  ],
  providers: [
  StatusBar,
  SplashScreen,
  Toast,
  AuthService,
  Firebase,
  CameraPreview,
  SQLite,
  SocialSharing,
  FileOpener,
  ImagePicker,
  File,
  {provide: ErrorHandler, useClass: IonicErrorHandler},
    ImageProvider
  ]
})
export class AppModule {}
