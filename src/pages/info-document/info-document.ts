import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-info-document',
	templateUrl: 'info-document.html',
})
export class InfoDocumentPage {

	picture = this.navParams.get("picture");

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams
		) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad InfoDocumentPage');
	}

}
