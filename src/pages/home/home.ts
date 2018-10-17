import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { AddFolderPage } from '../add-folder/add-folder';


@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})
export class HomePage {

  data = this.navParams.get('data');
  dataPhone = this.navParams.get('dataPhone');
  datas:any = [];
  totalFolder = 0;
  nameDB: any;

  constructor(public navCtrl: NavController,
    public menuCtrl:MenuController,
    private navParams: NavParams,
    private sqlite: SQLite
    ) {
    this.menuCtrl.enable(true, 'myMenu');
    this.getData();
  }

  getData(){
    if (this.data != undefined) {
      let nameDB = this.data + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY, name TEXT, date TEXT, type TEXT, UNIQUE (name))', {} as any)
        .then(res => console.log('Executed SQL' + name))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.datas = [];
          for(var i=0; i<res.rows.length; i++) {
            this.datas.push({folderid:res.rows.item(i).folderid,name:res.rows.item(i).name,date:res.rows.item(i).date,type:res.rows.item(i).type})
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
      let nameDB = this.dataPhone + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS folder(folderid INTEGER PRIMARY KEY, name TEXT, date TEXT, type TEXT, UNIQUE (name))', {} as any)
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
        db.executeSql('SELECT * FROM folder ORDER BY folderid DESC', {} as any)
        .then(res => {
          this.datas = [];
          for(var i=0; i<res.rows.length; i++) {
            this.datas.push({folderid:res.rows.item(i).folderid,name:res.rows.item(i).name,date:res.rows.item(i).date,type:res.rows.item(i).type})
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
    if (this.data != undefined) { 
      this.navCtrl.push(AddFolderPage,{data:this.data});
    }
    else {
      this.navCtrl.push(AddFolderPage,{dataPhone:this.dataPhone});
    }
    
  }

  deleteFolder(folderid) {
    if (this.data != undefined) {
      let nameDB = this.data + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid])
        .then(res => {
          console.log(res);
          this.getData();        
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
    else {
      let nameDB = this.dataPhone + '.db';
      this.sqlite.create({
        name: nameDB,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM folder WHERE folderid=?', [folderid])
        .then(res => {
          console.log(res);
          this.getData();  
        })
        .catch(e => console.log(e));
      }).catch(e => console.log(e));
    }
  }


}
