import { Component } from '@angular/core';
import { NavController, MenuController, Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';

import { AddFolderPage } from '../add-folder/add-folder';
import { EditFolderPage } from '../edit-folder/edit-folder';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

  data = this.auth.getEmail();
  dataPhone = this.auth.getPhone();
  folders:any = [];
  totalFolder = 0;
  folder = { name:""};

  constructor(public navCtrl: NavController,
    public menuCtrl:MenuController,
    private sqlite: SQLite,
    private auth: AuthService,
    public platform: Platform,
    private toast: Toast,
    private file: File
    ) {
    this.menuCtrl.enable(true, 'myMenu');
  }

  ionViewDidLoad() {
    this.getData();
    this.createRootFolder();
  }

  ionViewWillEnter() {
    this.getData();
  }

  createRootFolder(){
    this.platform.ready().then(() =>{
      if(this.platform.is('android')) {
        this.file.checkDir(this.file.externalRootDirectory, 'IonScan').then(response => {
          console.log('Directory exists '+response);
        }).catch(err => {
          console.log('Directory doesn\'t exist '+JSON.stringify(err));
          this.file.createDir(this.file.externalRootDirectory, 'IonScan', false).then(response => {
            console.log('Directory create '+response);
          }).catch(err => {
            console.log('Directory no create '+JSON.stringify(err));
          }); 
        });
      }
    });  
  }

  getData(){    
    if (this.data != null) {
      let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
      let nameDB = nameEmail + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY, name TEXT, date TEXT, type TEXT, UNIQUE (name))', {} as any)
        .then(res => console.log('Executed SQL' + name))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.folders = [];
          for(var i=0; i<res.rows.length; i++) {
            this.folders.push({folderid:res.rows.item(i).folderid,name:res.rows.item(i).name,date:res.rows.item(i).date,type:res.rows.item(i).type})
          }
        })
        .catch(e => console.log(e));
        db.executeSql('SELECT COUNT(folderid) AS totalFolder FROM folder', {} as any)
        .then(res => {
          if(res.rows.length>0) {
            this.totalFolder = parseInt(res.rows.item(0).totalFolder);
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
        db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY, name TEXT, date TEXT, type TEXT)', {} as any)
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.folders = [];
          for(var i=0; i<res.rows.length; i++) {
            this.folders.push({folderid:res.rows.item(i).folderid,name:res.rows.item(i).name,date:res.rows.item(i).date,type:res.rows.item(i).type})            
          }
        })
        .catch(e => console.log(e));
        db.executeSql('SELECT COUNT(folderid) AS totalFolder FROM folder', {} as any)
        .then(res => {
          if(res.rows.length>0) {
            this.totalFolder = parseInt(res.rows.item(0).totalFolder);
          }
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
  }


  addFolder() {
    if (this.data != null) { 
      this.navCtrl.push(AddFolderPage);
    }
    else {
      this.navCtrl.push(AddFolderPage);
    }
  }

  deleteFolder(folderid) {
    if (this.data != null) {
      let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
      let nameDB = nameEmail + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT name FROM folder WHERE folderid=?', [folderid])
        .then(res => {
          if(res.rows.length > 0) {            
            this.folder.name = res.rows.item(0).name;
          }
          let path = this.file.externalRootDirectory + 'IonScan';
          let name = this.folder.name + '.' + nameEmail;
          this.platform.ready().then(() =>{
            if(this.platform.is('android')) {
              this.file.removeRecursively(path, name).then(response => {
                console.log('Folder deleted'+response);
              }).catch(err => {
                console.log('Folder doesn\'t delete '+JSON.stringify(err));          
              });
            }
          });    
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
            );
        });        
        db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid])
        .then(res => {          
          console.log(res);
          this.getData();        
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
        db.executeSql('SELECT name FROM folder WHERE folderid=?', [folderid])
        .then(res => {
          if(res.rows.length > 0) {            
            this.folder.name = res.rows.item(0).name;
          }
          let path = this.file.externalRootDirectory + 'IonScan';
          let name = this.folder.name + '.' + namePhone;
          this.platform.ready().then(() =>{
            if(this.platform.is('android')) {
              this.file.removeRecursively(path, name).then(response => {
                console.log('Folder deleted'+response);
              }).catch(err => {
                console.log('Folder doesn\'t delete '+JSON.stringify(err));          
              });
            }
          });    
        })
        .catch(e => {
          console.log(e);
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
            );
        });        
        db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid])
        .then(res => {
          console.log(res);
          this.getData();  
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
  }

  editFolder(folderid) {
    this.navCtrl.push(EditFolderPage, {
      folderid:folderid
    });
  }

}
