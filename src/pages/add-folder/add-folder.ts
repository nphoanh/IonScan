import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
	selector: 'page-add-folder',
	templateUrl: 'add-folder.html',
})
export class AddFolderPage {

	folder = { name:"", date:"", type:"" };
	data = this.navParams.get('data');
	dataPhone = this.navParams.get('dataPhone');

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private toast: Toast) {
	}

	saveData() {
		if (this.data != undefined) { 
			let nameDB = this.data + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.data.name,this.data.date,this.data.type])
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
			let nameDB = this.dataPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.data.name,this.data.date,this.data.type])
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
