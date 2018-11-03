import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service'; 
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
	selector: 'page-image',
	templateUrl: 'image.html',
})
export class ImagePage {

	picture = this.navParams.get('picture');
	folderid = this.navParams.get('folderid');
	foldername = this.navParams.get('foldername');
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	thisDate: String = new Date().toISOString();
	images:any = [];
	image = { name:"", date:this.thisDate, path:"", base64:"", type:"image/png", upload:0 };  
	sortableContour = [];

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private file: File,
        private sqlite: SQLite,
        private auth: AuthService,
        private toast: Toast,
		) {
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

    saveImage(){
        let nameFile = this.image.name + '.' + 'png';
        if (this.data != null) { 
            let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
            let nameDB = nameEmail + '.db';
            let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + nameEmail;                        
            this.sqlite.create({
                name: nameDB,
                location: 'default'
            }).then((db: SQLiteObject) => {                
                db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?,?)', [this.image.name,this.image.date,folderPath,this.picture,this.image.type,this.image.upload,this.folderid]).then(res => {
                    this.savebase64AsFile(folderPath, nameFile, this.picture, this.image.type); 
                    this.navCtrl.pop();
                }).catch(e => { this.toast.show('Trùng tên ảnh', '5000', 'bottom').subscribe(toast => console.log(toast))});                   
            }).catch(e => console.log('SQLite didn\'t create: ' + e.message));                     
        }

        else {
            let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
            let nameDBPhone = 'u' + namePhone;
            let nameDB = nameDBPhone + '.db';
            let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + this.foldername + '.' + namePhone;
            this.sqlite.create({
                name: nameDB,
                location: 'default'
            }).then((db: SQLiteObject) => {                
                db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,?,?)', [this.image.name,this.image.date,folderPath,this.picture,this.image.type,this.image.upload,this.folderid]).then(res => {
                    this.savebase64AsFile(folderPath, nameFile, this.picture, this.image.type); 
                    this.navCtrl.pop();
                }).catch(e => { this.toast.show('Trùng tên ảnh', '5000', 'bottom').subscribe(toast => console.log(toast))});                   
            }).catch(e => console.log('SQLite didn\'t create: ' + e.message));   
        }                  
    }

}
