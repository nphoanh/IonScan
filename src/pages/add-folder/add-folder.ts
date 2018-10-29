import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-add-folder',
	templateUrl: 'add-folder.html',
})
export class AddFolderPage {
	
	thisDate: String = new Date().toISOString();
	folder = { name:"", date:this.thisDate, type:"", display:"yes" };
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	

	constructor(public navCtrl: NavController, 
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File
		) {
	}

	saveFolder() {
		if (this.data != null) { 
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			let path = this.file.externalRootDirectory + 'IonScan';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.folder.name,this.folder.date,this.folder.type,this.folder.display]).then(res => {					
					let name = this.folder.name + '.' + nameEmail;
					this.file.createDir(path, name, false).catch(e => console.log('Folder didn\'t add to device: ' + e.message));					
					this.navCtrl.popToRoot();
				}).catch(e => console.log('Folder didn\'t add to table: ' + e.message));					
			}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));	
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let path = this.file.externalRootDirectory + 'IonScan';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('INSERT INTO folder VALUES(NULL,?,?,?,?)',[this.folder.name,this.folder.date,this.folder.type,this.folder.display]).then(res => {					
					let name = this.folder.name + '.' + nameDBPhone;
					this.file.createDir(path, name, false).catch(e => console.log('Folder didn\'t add to device: ' + e.message));					
					this.navCtrl.popToRoot();
				}).catch(e => console.log('Folder didn\'t add to table: ' + e.message));					
			}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));	
		}		
	}
	
}
