import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, FabContainer } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageProvider } from '../../providers/image/image';

import { ExportPage } from '../export/export';
import { AddImagePassportPage } from '../add-image-passport/add-image-passport';
import { AddImageIdentityPage } from '../add-image-identity/add-image-identity';
import { EditImagePage } from '../edit-image/edit-image';

@IonicPage()
@Component({
	selector: 'page-folder',
	templateUrl: 'folder.html',
})
export class FolderPage {

	datas: any;
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images:any = [];
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", folderid:"" }; 
	folder = { folderid:0, name:"", date:"", type:"", display:"yes" };
	foldername = this.navParams.get('foldername');
	folderid = this.navParams.get('folderid');
	path = this.file.externalRootDirectory + 'IonScan';
	photo = { albumId: '', id: '', title: '', url: '', thumbnailUrl: ''};
	hide : boolean;

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		private imagePicker: ImagePicker,
		public imageProvider: ImageProvider
		) {
	}

	ionViewWillEnter() {
		this.getData(this.navParams.get("folderid"));
	}

	getData(folderid){    
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {    
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid]).then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;
						this.folder.display = res.rows.item(0).display;						
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));

				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid]).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid]).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Folder table: ' + e.message));
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
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid]).then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;
						this.folder.display = res.rows.item(0).display;						
					}		
				}).catch(e => console.log('Select nothing from Folder table: ' + e.message));

				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid]).then(res => {
					this.images = [];
					for(var i=0; i<res.rows.length; i++) {
						this.images.push({
							imageid:res.rows.item(i).imageid,
							name:res.rows.item(i).name,
							date:res.rows.item(i).date,
							path:res.rows.item(i).path,
							base64:res.rows.item(i).base64,
							type:res.rows.item(i).type,
							folderid:res.rows.item(i).folderid})
					}
				}).catch(e => console.log('Select nothing from Image table: ' + e.message));

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid]).then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				}).catch(e => console.log('Count nothing from Folder table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	addImage(){
		console.log(this.folder.type);
		if (this.folder.type=="Hộ chiếu") {
			this.navCtrl.push(AddImagePassportPage,{
				folderid:this.folderid,
				foldername:this.foldername
			});
		}
		else {
			this.navCtrl.push(AddImageIdentityPage,{
				folderid:this.folderid,
				foldername:this.foldername
			});
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
					this.getData(this.folderid);        
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
					this.getData(this.folderid);        
				}).catch(e => console.log('Folder didn\'t remove in table: ' + e.message));
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));
		}
	}

	exportImage(imageid) {
		this.navCtrl.push(ExportPage,{imageid:imageid});
	}

	closeButton(fab: FabContainer){
		fab.close();
	}

	uploadImage() {
		this.imageProvider.addImage(this.photo).then((result) => {
			this.hide = true;
		}, (err) => {
			console.log(err);
		});
	}

	editImage(imageid,name){
		this.navCtrl.push(EditImagePage,{
			imageid:imageid,
			imagename:name
		});
	}

	b64toBlob(b64Data, contentType, sliceSize) {
		var contentType = contentType || '';
		var sliceSize = sliceSize || 512;
		var byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
		var byteArrays = [];
		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		}
		return new Blob(byteArrays, {type: contentType});
	}

	savebase64AsFile(folderPath, fileName, base64, contentType){
		var DataBlob = this.b64toBlob(base64,contentType,512);
		this.file.writeFile(folderPath, fileName, DataBlob).catch(e => console.log('File didn\'t save: ' + e.message));       
	}    

	pickImage() {
		this.imagePicker.getPictures({
			outputType: 1
		}).then((results) => {
			let base64 = results;
			let nameFile = this.image.date + '.' + 'png';
			if (this.data != null) { 
				let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
				let nameDB = nameEmail + '.db';
				let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameEmail;                        
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {                
					db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?)', [this.image.date,this.image.date,folderPath,base64,this.image.type,this.folderid]).then(res => {
						this.savebase64AsFile(folderPath, nameFile, base64, this.image.type); 
						this.getData(this.folderid);
					}).catch(e => console.log('Image didn\'t insert: ' + e.message));                    
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));                     
			}

			else {
				let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
				let nameDBPhone = 'u' + namePhone;
				let nameDB = nameDBPhone + '.db';
				let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameDBPhone;                        
				this.sqlite.create({
					name: nameDB,
					location: 'default'
				}).then((db: SQLiteObject) => {                
					db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?)', [this.image.date,this.image.date,folderPath,base64,this.image.type,this.folderid]).then(res => {
						this.savebase64AsFile(folderPath, nameFile, base64, this.image.type); 
						this.getData(this.folderid);
					}).catch(e => console.log('Image didn\'t insert: ' + e.message));                    
				}).catch(e => console.log('SQLite didn\'t create: ' + e.message));   
			}                  
		}, (err) => { });
	}

}
