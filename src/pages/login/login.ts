import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Toast } from '@ionic-native/toast';

import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetPage } from '../reset/reset';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  user = {} as User;

  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: Toast) {}

  async login(user: User) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      let users = firebase.auth().currentUser;
      let emails = user.email;
      let emailLower = emails.toLowerCase();
      if (users.emailVerified == true && emailLower == users.email) {
        this.navCtrl.push(HomePage);
      }
      if (users.emailVerified == false && emailLower == users.email) {
        this.toast.show('Email chưa được xác thực', '5000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
          )
      }
    }
    catch(e) {
      this.toast.show(e, '5000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
        )
    }
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  resetPwd() {
    this.navCtrl.push(ResetPage);
  }

}
