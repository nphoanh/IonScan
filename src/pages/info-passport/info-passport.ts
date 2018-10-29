import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-info-passport',
	templateUrl: 'info-passport.html',
})
export class InfoPassportPage {

	picture = this.navParams.get("picture");

	constructor(public navCtrl: NavController, 
		public navParams: NavParams) {
	}

	ionViewDidLoad() {
	}

	

}
