import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
    // this.crop();
  }

  /*crop(){
    setTimeout(()=>{
      var rectimg = <HTMLDivElement>  document.getElementById('rectimg')  ;
      var img = <HTMLImageElement>  document.getElementById('img')  ;
      var canvas = <HTMLCanvasElement> document.getElementById("canvas");

      var r_bbox = rectimg.getBoundingClientRect();
      var img_bbox = img.getBoundingClientRect();

      var scale_x = img_bbox.width / img.naturalWidth;
      var scale_y = img_bbox.height / img.naturalHeight;
      
      var output = {
        x: r_bbox.left - img_bbox.left + rectimg.clientLeft,        
        y: r_bbox.top - img_bbox.top + rectimg.clientTop,        
        w: rectimg.clientWidth,
        h: rectimg.clientHeight
      };

      var ctx = canvas.getContext('2d');
      canvas.width = output.w;
      canvas.height = output.h;
      ctx.drawImage(img,
        output.x / scale_x,
        output.y / scale_y,
        output.w / scale_x,
        output.h / scale_y,
        0,
        0,
        output.w,
        output.h
        );

      var base = canvas.toDataURL();

      console.log(rectimg);
      console.log(img);
      console.log(canvas);

      console.log(r_bbox);
      console.log(img_bbox);

      console.log(img_bbox.width);
      console.log(img_bbox.height);

      console.log(img.naturalWidth);
      console.log(img.naturalHeight);

      console.log(output);

      console.log(ctx);
    }, 0);

  }*/


}
