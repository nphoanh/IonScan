import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
	selector: 'page-add-image-passport',
	templateUrl: 'add-image-passport.html',
})
export class AddImagePassportPage {

	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images:any = [];
	folderid = this.navParams.get("folderid");
	foldername = this.navParams.get('foldername');
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", folderid:"" }; 

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		) {
	}

	ionViewWillEnter() {
		this.getData();		
	}

	getData(){
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE folderid="2" ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,							
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid
						})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid="2"', {} as any).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Image table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE folderid="2" ORDER BY imageid DESC', {} as any).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,							
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid
						})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));
				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid="2"', {} as any).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Image table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	moveImage(imageid){
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameEmail;                        		
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameEmail;                        			
			console.log(folderPathNew);
			console.log(folderPath);
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}						
					let nameFile = this.image.name + '.' + 'png';
					let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);    
					this.file.copyFile(folderPath, nameFile, folderPathNew, nameFile).catch(e => console.log('File didn\'t remove: ' + e.message));		  				
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));		  				
				db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?)', [this.image.name,this.image.date,folderPathNew,this.image.base64,this.image.type,this.folderid]).catch(e => console.log('Image didn\'t add to table: ' + e.message));				
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
			this.navCtrl.pop();
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameDBPhone;                        
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameDBPhone;                        
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid]).then(res => {
					if(res.rows.length > 0) {
						this.image.imageid = res.rows.item(0).imageid;
						this.image.name = res.rows.item(0).name;
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}						
					let nameFile = this.image.name + '.' + 'png';
					let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);    
					this.file.copyFile(folderPath, nameFile, folderPathNew, nameFile).catch(e => console.log('File didn\'t remove: ' + e.message));		  				
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));		  				
				db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?)', [this.image.name,this.image.date,folderPathNew,this.image.base64,this.image.type,this.folderid]).catch(e => console.log('Image didn\'t add to table: ' + e.message));				
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
			this.navCtrl.pop();
		}
	}

	deleteImage(imageid){
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
					let name = this.image.name + '.' + nameEmail;
					this.file.removeRecursively(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          
				}).catch(e => console.log('Image didn\'t remove: ' + e.message));
				db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
					this.getData();        
				}).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
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
					let name = this.image.name + '.' + nameDBPhone;
					this.file.removeRecursively(this.image.path, name).catch(e => console.log('Image didn\'t remove in device: ' + e.message));          
				}).catch(e => console.log('Image didn\'t remove: ' + e.message));
				db.executeSql('DELETE FROM image WHERE imageid=?', [imageid]).then(res => { 
					this.getData();        
				}).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}



}
