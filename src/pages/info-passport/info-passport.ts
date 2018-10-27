import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-info-passport',
	templateUrl: 'info-passport.html',
})
export class InfoPassportPage {

	picture = this.navParams.get("picture");
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private toast: Toast,
		private auth: AuthService,
		public platform: Platform,
		private file: File) {
	}

	ionViewDidLoad() {
	}

	

}
