import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, MenuController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

import { AddImagePassportPage } from '../add-image-passport/add-image-passport';
import { AddImageIdentityPage } from '../add-image-identity/add-image-identity';

@IonicPage()
@Component({
	selector: 'page-folder',
	templateUrl: 'folder.html',
})
export class FolderPage {

	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	totalImage = 0;
	images:any = [];
	folders:any = [];
	folder = { folderid:0, name:"", date:"", type:"", display:"yes" };
	image = { imageid:"", name:"", date:"", path:"", base64:"", type:"image/png", folderid:"" }; 
	foldername = this.navParams.get('foldername');
	folderid = this.navParams.get('folderid');

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public menuCtrl:MenuController,
		private sqlite: SQLite,
		private auth: AuthService,
		public platform: Platform,
		private file: File,
		) {
		this.menuCtrl.enable(true, 'myMenu');
	}

	ionViewWillEnter() {
		this.getData(this.navParams.get("folderid"));
	}

	addImage(){
		if (this.folder.type="Passport") {
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
	
	getData(folderid){    
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
				}).catch(e => console.log(e));

				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid])
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

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid])
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
				db.executeSql('SELECT * FROM folder WHERE folderid=?', [folderid])
				.then(res => {
					if(res.rows.length > 0) {
						this.folder.folderid = res.rows.item(0).folderid;
						this.folder.name = res.rows.item(0).name;
						this.folder.date = res.rows.item(0).date;
						this.folder.type = res.rows.item(0).type;
						this.folder.display = res.rows.item(0).display;						
					}		
				}).catch(e => console.log(e));

				db.executeSql('SELECT * FROM image WHERE folderid=? ORDER BY imageid DESC', [folderid])
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

				db.executeSql('SELECT COUNT(imageid) AS totalImage FROM image WHERE folderid=? ', [folderid])
				.then(res => {
					if(res.rows.length>0) {
						this.totalImage = parseInt(res.rows.item(0).totalImage);
					}
				})
				.catch(e => console.log(e));
			}).catch(e => console.log(e));	
		}
	}
}
