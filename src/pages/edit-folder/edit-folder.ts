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

	folder = { folderid:0, name:"", date:"", type:"", display:"yes" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	foldername = this.navParams.get('foldername');

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
						this.folder.display = res.rows.item(0).display;						
					}		
				})
			})
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
						this.folder.display = res.rows.item(0).display;				
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
		let temp = this.folder.name;
		console.log(temp);
	}

	updatFolder(folderid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db'; 
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE folder SET name=?,date=?,type=?,display=? WHERE folderid=?',[this.folder.name,this.folder.date,this.folder.type,this.folder.display,this.folder.folderid])
				.then(res => {
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							let path = this.file.externalRootDirectory + 'IonScan';
							let name = this.folder.name + '.' + nameEmail;
							let oldName = this.foldername + '.' + nameEmail;
							this.file.checkDir(path, name).then(response => {
								console.log('Folder existed '+response);
							}).catch(err => {
								console.log('Directory doesn\'t exist '+JSON.stringify(err));
								this.file.copyDir(path, oldName, path, name).then(response => {
									console.log('Folder changed'+response);
									this.file.removeRecursively(path, oldName).then(response => {
										console.log('Folder deleted'+response);
									}).catch(err => {
										console.log('Folder doesn\'t delete '+JSON.stringify(err));          
									});
								}).catch(err => {
									console.log('Folder no change '+JSON.stringify(err));
								}); 
							});
						}
					});  
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
				db.executeSql('UPDATE folder SET name=?,date=?,type=?,display=? WHERE folderid=?',[this.folder.name,this.folder.date,this.folder.type,this.folder.display,this.folder.folderid])
				.then(res => {
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							let path = this.file.externalRootDirectory + 'IonScan';
							let name = this.folder.name + '.' + namePhone;
							let oldName = this.foldername + '.' + namePhone;
							this.file.checkDir(path, name).then(response => {
								console.log('Folder existed '+response);
							}).catch(err => {
								console.log('Directory doesn\'t exist '+JSON.stringify(err));
								this.file.copyDir(path, oldName, path, name).then(response => {
									console.log('Folder changed'+response);
									this.file.removeRecursively(path, oldName).then(response => {
										console.log('Folder deleted'+response);
									}).catch(err => {
										console.log('Folder doesn\'t delete '+JSON.stringify(err));          
									});
								}).catch(err => {
									console.log('Folder no change '+JSON.stringify(err));
								}); 
							});
						}
					});  
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
