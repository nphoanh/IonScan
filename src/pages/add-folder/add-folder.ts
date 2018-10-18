import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../../service/auth.service';

@IonicPage()
@Component({
	selector: 'page-add-folder',
	templateUrl: 'add-folder.html',
})
export class AddFolderPage {

	folder = { name:"", date:"", type:"" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();

	constructor(public navCtrl: NavController, 
		private sqlite: SQLite,
		private toast: Toast,
		private auth: AuthService) {
	}

	saveData() {
		if (this.data != undefined) { 
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?)',[this.folder.name,this.folder.date,this.folder.type])
				.then(res => {
					console.log(res);
					this.toast.show('Folder saved', '5000', 'center').subscribe(
						toast => {
							this.navCtrl.popToRoot();
						}
						);
				})
				.catch(e => {
					console.log(e);
					this.toast.show(e, '5000', 'center').subscribe(
						toast => {
							console.log(toast);
						}
						);
				});
			}).catch(e => {
				console.log(e);
				this.toast.show(e, '5000', 'center').subscribe(
					toast => {
						console.log(toast);
					}
					);
			});
		}
		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?)',[this.folder.name,this.folder.date,this.folder.type])
				.then(res => {
					console.log(res);
					this.toast.show('Folder saved', '5000', 'center').subscribe(
						toast => {
							this.navCtrl.popToRoot();
						}
						);
				})
				.catch(e => {
					console.log(e);
					this.toast.show(e, '5000', 'center').subscribe(
						toast => {
							console.log(toast);
						}
						);
				});
			}).catch(e => {
				console.log(e);
				this.toast.show(e, '5000', 'center').subscribe(
					toast => {
						console.log(toast);
					}
					);
			});
		}		
	}

	
}
