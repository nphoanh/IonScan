import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-edit-folder',
	templateUrl: 'edit-folder.html',
})
export class EditFolderPage {

	folder = { folderid:0, name:"", date:"", type:"" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private toast: Toast,
		private auth: AuthService,
		public platform: Platform,
		private file: File) {
		this.getCurrentFolder(navParams.get("folderid"));
	}

	getCurrentFolder(folderid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
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
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
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

	updatFolder(folderid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db'; 
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE folder SET name=?,date=?,type=? WHERE folderid=?',[this.folder.name,this.folder.date,this.folder.type,this.folder.folderid])
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
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {			
				db.executeSql('UPDATE folder SET name=?,date=?,type=? WHERE folderid=?',[this.folder.name,this.folder.date,this.folder.type,this.folder.folderid])
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
