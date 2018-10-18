import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

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
		private auth: AuthService,
		public platform: Platform,
		private file: File
		) {
	}

	saveFolder() {
		if (this.data != null) { 
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?)',[this.folder.name,this.folder.date,this.folder.type])
				.then(res => {
					let path = this.file.externalRootDirectory + 'IonScan';
					let name = this.folder.name + '.' + nameEmail;
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							this.file.checkDir(path, name).then(response => {								
								console.log('Folder existed '+response);
							}).catch(err => {
								console.log('Folder doesn\'t exist '+JSON.stringify(err));
								this.file.createDir(path, name, false).then(response => {
									console.log('Folder created '+response);
								}).catch(err => {
									console.log('Folder doesn\'t create '+JSON.stringify(err));
								}); 
							});
						}
					});  
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
					let path = this.file.externalRootDirectory + 'IonScan';
					let name = this.folder.name + '.' + namePhone;
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							this.file.checkDir(path, name).then(response => {								
								console.log('Folder existed '+response);
							}).catch(err => {
								console.log('Folder doesn\'t exist '+JSON.stringify(err));
								this.file.createDir(path, name, false).then(response => {
									console.log('Folder created '+response);
								}).catch(err => {
									console.log('Folder doesn\'t create '+JSON.stringify(err));
								}); 
							});
						}
					});  
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
