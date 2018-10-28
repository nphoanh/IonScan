import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';

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
		public menuCtrl:MenuController,
		private sqlite: SQLite,
		private auth: AuthService,
		public platform: Platform,
		private file: File,
		private toast: Toast,) {
		this.menuCtrl.enable(true, 'myMenu');
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
				db.executeSql('SELECT * FROM image WHERE folderid="2" ORDER BY imageid DESC', {} as any)
				.then(res => {
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
				})
				.catch(e => console.log(e));

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid="2"', {} as any)
				.then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				})
				.catch(e => console.log(e));
			}).catch(e => console.log(e));
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE folderid="2" ORDER BY imageid DESC', {} as any)
				.then(res => {
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
				})
				.catch(e => console.log(e));

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid="2"', {} as any)
				.then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				})
				.catch(e => console.log(e));
			}).catch(e => console.log(e));
		}
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
		this.file.checkFile(folderPath, fileName).then(response => {
			console.log('File exists '+response);
		}).catch(err => {
			console.log('File doesn\'t exist '+JSON.stringify(err));
			this.file.writeFile(folderPath, fileName, DataBlob).then(response => {
				console.log('File create '+response);
			}).catch(err => {
				console.log('File no create '+JSON.stringify(err));
			}); 
		});        
	}    

	moveImage(imageid){
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db';
			let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameEmail;                        
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameEmail;                        
			let nameFile = this.image.name + '.' + 'png';
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
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							this.file.removeFile(folderPath, nameFile).then(response => {
								console.log('File deleted'+response);								
							}).catch(err => {
								console.log('File did not delete'+JSON.stringify(err));          
							});
						}
					});
					let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);    
					this.savebase64AsFile(folderPathNew, nameFile, base, this.image.type); 
				})
				.catch(e => console.log(e));

				db.executeSql('UPDATE image SET path=?,folderid=? WHERE imageid=?',[folderPathNew,this.folderid,imageid])
				.then(res => {										
					this.toast.show('Thêm ảnh thành công', '5000', 'center').subscribe(
						toast => {
							console.log(toast);
						});
				}).catch(e => console.log(e));
			}).catch(e => console.log(e));
			this.navCtrl.pop();
		}

		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let folderPathNew = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameDBPhone;                        
			let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameDBPhone;                        
			let nameFile = this.image.name + '.' + 'png';
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {				
				db.executeSql('SELECT * FROM image WHERE imageid=?', [imageid])
				.then(res => {
					if(res.rows.length > 0) {
						this.image.folderid = res.rows.item(0).folderid;
						this.image.name = res.rows.item(0).name;
						this.image.date = res.rows.item(0).date;
						this.image.path = res.rows.item(0).path;
						this.image.base64 = res.rows.item(0).base64;
						this.image.type = res.rows.item(0).type;
						this.image.folderid = res.rows.item(0).folderid;						
					}	
					this.platform.ready().then(() =>{
						if(this.platform.is('android')) {
							this.file.removeFile(folderPath, nameFile).then(response => {
								console.log('File deleted'+response);								
							}).catch(err => {
								console.log('File did not delete'+JSON.stringify(err));          
							});
						}
					});    
				})
				.catch(e => console.log(e));

				let base = this.image.base64.substr(this.image.base64.lastIndexOf(',')+1);
				db.executeSql('UPDATE image SET path=?,folderid=? WHERE imageid=?',[folderPathNew,this.folderid,this.image.imageid])
				.then(res => {				
					this.savebase64AsFile(folderPathNew, this.image.name, base, this.image.type); 	
					this.toast.show('Thêm ảnh thành công', '5000', 'center').subscribe(
						toast => {
							console.log(toast);
						}
						);
				}).catch(e => console.log(e));
			}).catch(e => console.log(e));
		}
	}

}
