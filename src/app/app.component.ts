import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../service/auth.service';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { IdentityPage } from '../pages/identity/identity';
import { PassportPage } from '../pages/passport/passport';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private auth: AuthService,
    private menu: MenuController
    ) {
    this.initializeApp();
    this.pages = [
    { title: 'Lưu trữ', component: HomePage },
    { title: 'Chứng minh thư', component: IdentityPage },
    { title: 'Hộ chiếu', component: PassportPage },
    { title: 'Về chúng tôi', component: AboutPage },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    
  }

  login() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
