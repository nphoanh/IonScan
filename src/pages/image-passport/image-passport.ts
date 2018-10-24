import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var cv: any;

@IonicPage()
@Component({
	selector: 'page-image-passport',
	templateUrl: 'image-passport.html',
})
export class ImagePassportPage {

	picture = this.navParams.get('picture');


	constructor(public navCtrl: NavController, 
		public navParams: NavParams) {
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ImagePassportPage');
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
