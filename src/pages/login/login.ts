import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController } from 'ionic-angular';
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
  signin: string = "Email";
  public recaptchaVerifier:firebase.auth.RecaptchaVerifier;

  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
    private toast: Toast,
    public menuCtrl:MenuController,    
    ) {
    this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewDidLoad() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }

  async loginPhone(user){
    try {
      const appVerifier = this.recaptchaVerifier;
      const phoneNumberString = "+" + user.phone;
      await firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier).then(confirmationResult => {
        let prompt = this.alertCtrl.create({
          title: 'Nhập mã xác thực',
          inputs: [{ name: 'confirmationCode', placeholder: 'Mã xác thực' }],
          buttons: [
          { text: 'Hủy',
          handler: data => { console.log('Cancel clicked'); }
        },
        { text: 'Gửi',
        handler: data => {
          confirmationResult.confirm(data.confirmationCode)
          .then(result => {this.navCtrl.setRoot(HomePage);
          }).catch(error => {this.toast.show(error, '5000', 'bottom').subscribe(toast => {console.log(toast);})
        });}}]
        });
        prompt.present();
      }).catch(error => {
        this.toast.show(error, '5000', 'bottom').subscribe(
          toast => {
            console.log(toast);
          }
          )
      });           
    }
    catch(e) {
      this.toast.show(e, '5000', 'bottom').subscribe(
        toast => {
          console.log(toast);
        }
        )
    }

  }

  async login(user: User) {
    try {
      await this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
      let users = firebase.auth().currentUser;
      let emails = user.email;
      let emailLower = emails.toLowerCase();
      if (users.emailVerified == true && emailLower == users.email) {
        this.navCtrl.setRoot(HomePage);
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
