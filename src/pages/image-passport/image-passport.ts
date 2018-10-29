import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { Toast } from '@ionic-native/toast';

import { InfoPassportPage } from '../info-passport/info-passport';

declare var cv: any;

@IonicPage()
@Component({
	selector: 'page-image-passport',
	templateUrl: 'image-passport.html',
})
export class ImagePassportPage {

	picture = this.navParams.get('picture');
    data = this.auth.getEmail();
    dataPhone = this.auth.getPhone();
    thisDate: String = new Date().toISOString();
    images:any = [];
    image = { name:"", date:this.thisDate, path:"", base64:"", type:"image/png" };  

    constructor(public navCtrl: NavController, 
        public navParams: NavParams,
        private file: File,
        private sqlite: SQLite,
        private auth: AuthService,
        private toast: Toast,
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
                db.executeSql('SELECT * FROM image ORDER BY imageid DESC', {} as any).then(res => {
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
                db.executeSql('SELECT * FROM image ORDER BY imageid DESC', {} as any).then(res => {
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
            }).catch(e => console.log('SQLite didn\'t create: ' + e.message));
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
        this.file.writeFile(folderPath, fileName, DataBlob).catch(e => console.log('File didn\'t save: ' + e.message));       
    }    

    saveImage(){
        let pic = document.getElementById('img') as HTMLImageElement;
        let src = pic.src;
        let base = src.substr(src.lastIndexOf(',')+1);
        let nameFile = this.image.name + '.' + 'png';
        if (this.data != null) { 
            let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
            let nameDB = nameEmail + '.db';
            let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameEmail;                        
            this.sqlite.create({
                name: nameDB,
                location: 'default'
            }).then((db: SQLiteObject) => {                
                db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,"2")', [this.image.name,this.image.date,folderPath,src,this.image.type]).then(res => {
                    this.savebase64AsFile(folderPath, nameFile, base, this.image.type); 
                    this.navCtrl.push(InfoPassportPage,{picture:src}); 
                }).catch(e => {
                    this.toast.show('Trùng tên ảnh', '5000', 'bottom').subscribe(toast => console.log(toast))
                });                     
            }).catch(e => console.log('SQLite didn\'t create: ' + e.message));                     
        }

        else {
            let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
            let nameDBPhone = 'u' + namePhone;
            let nameDB = nameDBPhone + '.db';
            let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + namePhone;
            this.sqlite.create({
                name: nameDB,
                location: 'default'
            }).then((db: SQLiteObject) => {                
               db.executeSql('INSERT INTO image VALUES (NULL,?,?,?,?,?,"2")', [this.image.name,this.image.date,folderPath,src,this.image.type]).then(res => {
                    this.savebase64AsFile(folderPath, nameFile, base, this.image.type); 
                    this.navCtrl.push(InfoPassportPage,{picture:src}); 
                }).catch(e => {
                    this.toast.show('Trùng tên ảnh', '5000', 'bottom').subscribe(toast => console.log(toast))
                });                     
            }).catch(e => console.log('SQLite didn\'t create: ' + e.message));   
        }                  
    }

    rotateRight() {
        let src = cv.imread('img');
        let dst = new cv.Mat();
        let dsize = new cv.Size(src.rows, src.cols);
        let center = new cv.Point(src.cols/2, src.rows/2);
        let M = cv.getRotationMatrix2D(center, -90, 1);
        cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        cv.imshow('canvasOutput', dst);
        src.delete(); dst.delete(); M.delete();
        var canvasOutput = document.getElementById('canvasOutput') as HTMLCanvasElement;
        let picture = document.getElementById("img") as HTMLImageElement;
        picture.src = canvasOutput.toDataURL();
    }

    rotateLeft() {
        let src = cv.imread('img');
        let dsize = new cv.Size(src.rows, src.cols);
        let center = new cv.Point(src.cols / 2, src.rows / 2);
        let M = cv.getRotationMatrix2D(center, 90, 1);
        cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        cv.imshow('canvasOutput', src);
        var canvasOutput = document.getElementById('canvasOutput') as HTMLCanvasElement;
        let picture = document.getElementById("img") as HTMLImageElement;
        picture.src = canvasOutput.toDataURL();
        src.delete(); M.delete();
    }

}
