import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-info-identity',
  templateUrl: 'info-identity.html',
})
export class InfoIdentityPage {

	pictureFront = this.navParams.get('pictureFront');
	pictureBack = this.navParams.get('pictureBack');
	
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoIdentityPage');
  }

}
