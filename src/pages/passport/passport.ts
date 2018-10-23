import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions } from '@ionic-native/camera-preview';

import { ImagePassportPage } from '../image-passport/image-passport';

@IonicPage()
@Component({
  selector: 'page-passport',
  templateUrl: 'passport.html',
})
export class PassportPage {

  picture: any;
  image: any;

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	private cameraPreview: CameraPreview
  	) {
  }

  ionViewDidLoad() {
    this.initializePreview();
  }

  initializePreview() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height:  window.screen.height,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      toBack: true,
      tapPhoto: false,
      previewDrag: false,
      tapToFocus: true
    };

    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      });
  }

  takePicture() {    
    const pictureOpts: CameraPreviewPictureOptions = {
      width: window.screen.width,
      height:  window.screen.height,
      quality: 100
    }
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.navCtrl.push(ImagePassportPage, {picture:this.picture});
    }, (err) => {
      console.log(err);
    });
  }

  flashModeOn(){
    var button_flash_on = document.getElementById('button_flash_on');
    var button_flash_off = document.getElementById('button_flash_off');
    button_flash_on.style.visibility = "hidden";
    button_flash_off.style.visibility = "";
    var flash_mode = 'on';
    this.cameraPreview.setFlashMode(flash_mode);
  }

  flashModeOff(){
    var button_flash_on = document.getElementById('button_flash_on');
    var button_flash_off = document.getElementById('button_flash_off');
    button_flash_on.style.visibility = "";
    button_flash_off.style.visibility = "hidden";
    var flash_mode = 'off';
    this.cameraPreview.setFlashMode(flash_mode);
  }
}
