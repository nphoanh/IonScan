import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-edit-image',
	templateUrl: 'edit-image.html',
})
export class EditImagePage {

	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	imageid = this.navParams.get('imageid');
	imagename = this.navParams.get('imagename');
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", folderid:"" }; 

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File
		) {
	}

	ionViewDidLoad() {
		this.getCurrentImage(this.navParams.get("imageid"));
	}

	getCurrentImage(imageid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid])
				.then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid])
				.then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create SQLite: ' + e.message));
		}
	}

	updateImage(imageid) {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db'; 
			let name = this.image.name + '.' + 'png';
			let oldName = this.imagename + '.' + 'png';;			
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE image SET name=? WHERE imageid=?',[this.image.name]).then(res => {
					this.file.copyDir(this.image.path, oldName, this.image.path, name).catch(e => console.log('Folder didn\'t copy: ' + e.message));
					this.file.removeRecursively(this.image.path, oldName).catch(e => console.log('Folder didn\'t remove: ' + e.message));
					this.navCtrl.popToRoot();
				}).catch(e => console.log('Folder didn\'t update: ' + e.message));					  								
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
		}
		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let name = this.image.name + '.' + 'png';
			let oldName = this.imagename + '.' + 'png';;			
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE image SET name=? WHERE imageid=?',[this.image.name]).then(res => {
					this.file.copyDir(this.image.path, oldName, this.image.path, name).catch(e => console.log('Folder didn\'t copy: ' + e.message));
					this.file.removeRecursively(this.image.path, oldName).catch(e => console.log('Folder didn\'t remove: ' + e.message));
					this.navCtrl.popToRoot();
				}).catch(e => console.log('Folder didn\'t update: ' + e.message));					  								
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
		}
	}


}
