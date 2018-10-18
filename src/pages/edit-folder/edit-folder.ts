import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
	selector: 'page-edit-folder',
	templateUrl: 'edit-folder.html',
})
export class EditFolderPage {

	folder = { folderid:0, name:"", date:"", type:"" };
	data = this.navParams.get('data');
	dataPhone = this.navParams.get('dataPhone');

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private toast: Toast) {
		this.getCurrentFolder(navParams.get("folderid"));
	}

	getCurrentFolder(folderid) {
		if (this.data != undefined) {
			let nameDB = this.data + '.db'; 
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid])
				.then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;					
					}
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
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid])
				.then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;					
					}
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

	updateData() {
		if (this.data != undefined) {
			let nameDB = this.data + '.db'; 
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE folder SET name=?,date=?,type=? WHERE folderid=?',[this.data.name,this.data.date,this.data.type,this.data.folderid])
				.then(res => {
					console.log(res);
					this.toast.show('Folder updated', '5000', 'center').subscribe(
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
				db.executeSql('UPDATE folder SET name=?,date=?,type=? WHERE folderid=?',[this.data.name,this.data.date,this.data.type,this.data.folderid])
				.then(res => {
					console.log(res);
					this.toast.show('Folder updated', '5000', 'center').subscribe(
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
