import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { Toast } from '@ionic-native/toast';

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
    image = { name:"", date:this.thisDate };


    constructor(public navCtrl: NavController, 
        private toast: Toast,
        public navParams: NavParams,
        public platform: Platform,
        private file: File,
        private sqlite: SQLite,
        private auth: AuthService,) {
    }

    ionViewDidLoad() {
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

    saveImage(){
        if (this.data != null) { 
            let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
            let nameDB = nameEmail + '.db';
            this.sqlite.create({
                name: nameDB,
                location: 'default'
            }).then((db: SQLiteObject) => {
                db.executeSql('CREATE TABLE IF NOT EXISTS image(imageid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, folderid, FOREIGN KEY(folderid) REFERENCES folder (folderid))', {} as any)
                .then(res => console.log('Create image table'))
                .catch(e => console.log(e));

                db.executeSql('INSERT INTO image VALUES (NULL,?,?,"2")', [this.image.name,this.image.date])
                .then(res => {
                    console.log('Insert image');   
                    let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + nameEmail;
                    let base = this.picture.substr(this.picture.lastIndexOf(',')+1);
                    let nameFile = this.image.name + '.' + 'png';
                    let type = 'image/png';
                    if (this.image.name == null) {                        
                        this.toast.show('Chưa nhập tên ảnh', '5000', 'center').subscribe(
                            toast => {
                                this.navCtrl.popToRoot();
                            }
                            );
                    }
                    else {
                        this.savebase64AsFile(folderPath, nameFile, base, type); 
                        this.toast.show('Lưu ảnh thành công', '5000', 'center').subscribe(
                            toast => {
                                this.navCtrl.popToRoot();
                            }
                            );                                       
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
                db.executeSql('CREATE TABLE IF NOT EXISTS image(imageid INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, date TEXT, folderid INTEGER, FOREIGN KEY(folderid) REFERENCES folder (folderid))', {} as any)
                .then(res => console.log('Create image table'))
                .catch(e => console.log(e));

                db.executeSql('INSERT INTO image VALUES (NULL,?,?,"2")', [this.image.name,this.image.date])
                .then(res => {
                    console.log('INSERT Hộ chiếu');
                    let folderPath = this.file.externalRootDirectory + 'IonScan' + '/' + 'Passport' + '.' + namePhone;
                    let base = this.picture.substr(this.picture.lastIndexOf(',')+1);
                    let nameFile = this.image.name + '.' + 'png';
                    let type = 'image/png';
                    if (this.image.name == null) {                        
                        this.toast.show('Chưa nhập tên ảnh', '5000', 'center').subscribe(
                            toast => {
                                this.navCtrl.popToRoot();
                            }
                            );
                    }
                    else {
                        this.savebase64AsFile(folderPath, nameFile, base, type); 
                        this.toast.show('Lưu ảnh thành công', '5000', 'center').subscribe(
                            toast => {
                                this.navCtrl.popToRoot();
                            }
                            );                                       
                    }                })
                .catch(e => console.log(e));
            }).catch(e => console.log(e));
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
