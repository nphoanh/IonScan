import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Toast } from '@ionic-native/toast';

import { LoginPage } from '../login/login';


@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {

	user = {} as User;

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private afAuth: AngularFireAuth,
		private toast: Toast) {		
	}

	async signup(user: User) {
		try {
			await this.afAuth.auth.createUserWithEmailAndPassword(user.email,user.password);
			let users = firebase.auth().currentUser;
			users.sendEmailVerification().then(
				() => this.toast.show('Đã gửi email xác thực', '5000', 'center').subscribe(
					toast => {
						console.log(toast);
						this.navCtrl.push(LoginPage);
					}),	
				);				
		}
		catch(e) {
			this.toast.show(e, '5000', 'center').subscribe(
				toast => {
					console.log(toast);
				}
				)
		}
	}

}
