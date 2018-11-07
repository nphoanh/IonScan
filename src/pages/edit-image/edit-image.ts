import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AuthService } from '../../service/auth.service';
import { File } from '@ionic-native/file';

declare var cv: any;

@IonicPage()
@Component({
	selector: 'page-edit-image',
	templateUrl: 'edit-image.html',
})
export class EditImagePage {

	image = { imageid:0, name:"", path:"", base64:"", type:"image/png"};  
	imageid = this.navParams.get('imageid');
	imagename = this.navParams.get('imagename');
	picture = this.navParams.get('base64');
	path = this.navParams.get('path');
	hide : boolean = false;
	data = this.auth.getEmail();
	dataPhone = this.auth.getPhone();
	sortableContour = [];

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams,
		private sqlite: SQLite,
		private auth: AuthService,
		private file: File,
		) {
	}

	hideDiv(){
		this.hide = true;
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

	rotateRight() {
		let src = cv.imread('img');
		let dsize = new cv.Size(src.rows, src.cols);         
		let center = new cv.Point(src.rows/2, src.rows/2); 
		let M = cv.getRotationMatrix2D(center, -90, 1);
		cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
		cv.imshow('canvasOutput', src);
		let canvasOutput = document.getElementById('canvasOutput') as HTMLCanvasElement;
		let picture = document.getElementById("img") as HTMLImageElement;       
		picture.src = canvasOutput.toDataURL();
		src.delete(); M.delete();
	}

	rotateLeft() {
		let src = cv.imread('img');
		let dsize = new cv.Size(src.rows, src.cols);
		let center = new cv.Point(src.cols/2, src.cols/2); 
		let M = cv.getRotationMatrix2D(center, 90, 1);
		cv.warpAffine(src, src, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
		cv.imshow('canvasOutput', src);
		var canvasOutput = document.getElementById('canvasOutput') as HTMLCanvasElement;
		let picture = document.getElementById("img") as HTMLImageElement;
		picture.src = canvasOutput.toDataURL();
		src.delete(); M.delete();
	}

	crop() {
		let image = cv.imread('img');
		let gray = new cv.Mat();
		let edge = new cv.Mat();
		let finalDest = new cv.Mat();
		cv.cvtColor(image, gray, cv.COLOR_RGBA2GRAY, 0);
		let ksize = new cv.Size(5, 5);
		cv.GaussianBlur(gray, gray, ksize, 0, 0, cv.BORDER_DEFAULT);
		cv.Canny(gray, edge, 75, 200, 3, false);
		let M = cv.Mat.ones(3, 3, cv.CV_8U);
		let anchor = new cv.Point(-1, -1);
		cv.dilate(edge, edge, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());
		let contours = new cv.MatVector();
		let hierarchy = new cv.Mat();
		cv.findContours(edge, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
		let sortableContours = this.sortableContour;
		for (let i = 0; i < contours.size(); i++) {
			let cnt = contours.get(i);
			let area = cv.contourArea(cnt, false);
			let perim = cv.arcLength(cnt, false);
			this.sortableContour.push({ areaSize: area, perimiterSize: perim, contour: cnt });
		}
		sortableContours = sortableContours.sort((item1, item2) => { return (item1.areaSize > item2.areaSize) ? -1 : (item1.areaSize < item2.areaSize) ? 1 : 0; }).slice(0, 5);
		let approx = new cv.Mat();
		cv.approxPolyDP(sortableContours[0].contour, approx, .05 * sortableContours[0].perimiterSize, true);
		let foundContour = null;
		if (approx.rows == 4) {
			console.log('Found a 4-corner approx');
			foundContour = approx;
		}
		else{
			console.log('No 4-corner large contour!');
			return;
		}
		let corner1 = new cv.Point(foundContour.data32S[0], foundContour.data32S[1]);
		let corner2 = new cv.Point(foundContour.data32S[2], foundContour.data32S[3]);
		let corner3 = new cv.Point(foundContour.data32S[4], foundContour.data32S[5]);
		let corner4 = new cv.Point(foundContour.data32S[6], foundContour.data32S[7]);
		let cornerArray = [{ corner: corner1 }, { corner: corner2 }, { corner: corner3 }, { corner: corner4 }];
		cornerArray.sort((item1, item2) => { return (item1.corner.y < item2.corner.y) ? -1 : (item1.corner.y > item2.corner.y) ? 1 : 0; }).slice(0, 5);
		let tl = cornerArray[0].corner.x < cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
		let tr = cornerArray[0].corner.x > cornerArray[1].corner.x ? cornerArray[0] : cornerArray[1];
		let bl = cornerArray[2].corner.x < cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
		let br = cornerArray[2].corner.x > cornerArray[3].corner.x ? cornerArray[2] : cornerArray[3];
		let widthBottom = Math.hypot(br.corner.x - bl.corner.x, br.corner.y - bl.corner.y);
		let widthTop = Math.hypot(tr.corner.x - tl.corner.x, tr.corner.y - tl.corner.y);
		let theWidth = (widthBottom > widthTop) ? widthBottom : widthTop;
		let heightRight = Math.hypot(tr.corner.x - br.corner.x, tr.corner.y - br.corner.y);
		let heightLeft = Math.hypot(tl.corner.x - bl.corner.x, tr.corner.y - bl.corner.y);
		let theHeight = (heightRight > heightLeft) ? heightRight : heightLeft;
		let finalDestCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, theWidth - 1, 0, theWidth - 1, theHeight - 1, 0, theHeight - 1]); //
		let srcCoords = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.corner.x, tl.corner.y, tr.corner.x, tr.corner.y, br.corner.x, br.corner.y, bl.corner.x, bl.corner.y]);
		let dsize = new cv.Size(theWidth, theHeight);
		let N = cv.getPerspectiveTransform(srcCoords, finalDestCoords)
		cv.warpPerspective(image, finalDest, N, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());       
		cv.imshow('canvasOutput', finalDest);
		var canvasOutput = document.getElementById('canvasOutput') as HTMLCanvasElement;
		let picture = document.getElementById("img") as HTMLImageElement;
		picture.src = canvasOutput.toDataURL();
	}

	light(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.style.borderStyle = "none";
		origin.style.borderColor = "none";
		origin.style.borderWidth = "0px";
		gray.style.borderStyle = "none";
		gray.style.borderColor = "none";
		gray.style.borderWidth = "0px";
		bw.style.borderStyle = "none";
		bw.style.borderColor = "none";
		bw.style.borderWidth = "0px";
		light.style.borderStyle = "solid";
		light.style.borderColor = "black";
		light.style.borderWidth = "1px";
	}

	origin(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		light.style.borderStyle = "none";
		light.style.borderColor = "none";
		light.style.borderWidth = "0px";
		gray.style.borderStyle = "none";
		gray.style.borderColor = "none";
		gray.style.borderWidth = "0px";
		bw.style.borderStyle = "none";
		bw.style.borderColor = "none";
		bw.style.borderWidth = "0px";
		origin.style.borderStyle = "solid";
		origin.style.borderColor = "black";
		origin.style.borderWidth = "1px";
	}

	gray(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.style.borderStyle = "none";
		origin.style.borderColor = "none";
		origin.style.borderWidth = "0px";
		light.style.borderStyle = "none";
		light.style.borderColor = "none";
		light.style.borderWidth = "0px";
		bw.style.borderStyle = "none";
		bw.style.borderColor = "none";
		bw.style.borderWidth = "0px";
		gray.style.borderStyle = "solid";
		gray.style.borderColor = "black";
		gray.style.borderWidth = "1px";
	}

	bw(){
		let origin = document.getElementById('origin') as HTMLDivElement;
		let light = document.getElementById('light') as HTMLDivElement;
		let gray = document.getElementById('gray') as HTMLDivElement;
		let bw = document.getElementById('bw') as HTMLDivElement;
		origin.style.borderStyle = "none";
		origin.style.borderColor = "none";
		origin.style.borderWidth = "0px";
		gray.style.borderStyle = "none";
		gray.style.borderColor = "none";
		gray.style.borderWidth = "0px";
		light.style.borderStyle = "none";
		light.style.borderColor = "none";
		light.style.borderWidth = "0px";
		bw.style.borderStyle = "solid";
		bw.style.borderColor = "black";
		bw.style.borderWidth = "1px";
	}

	updateImage() {
		if (this.data != null) {
			let nameEmail = this.data.substr(0,this.data.lastIndexOf('@'));
			let nameDB = nameEmail + '.db'; 	
			let name = this.imagename + '.' + 'png';
			let newName = this.image.name + '.' + 'png';	
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE image SET name=?,base64=? WHERE imageid=?',[this.image.name,this.picture,this.imageid]).then(res => {
					console.log(this.path);
					console.log(name);
					console.log(newName);
					this.file.removeFile(this.path, name).catch(e => console.log('Image didn\'t remove: ' + e.message));					
					this.savebase64AsFile(this.path, newName, this.picture, this.image.type); 
					this.navCtrl.pop();
				}).catch(e => console.log(e));                   
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
		}
		else {
			let namePhone = this.dataPhone.substr(this.dataPhone.lastIndexOf('+')+1);
			let nameDBPhone = 'u' + namePhone;
			let nameDB = nameDBPhone + '.db';
			let name = this.imagename + '.' + 'png';
			let newName = this.image.name + '.' + 'png';	
			this.sqlite.create({
				name: nameDB,
				location: 'default'
			}).then((db: SQLiteObject) => {
				db.executeSql('UPDATE image SET name=?,base64=? WHERE imageid=?',[this.image.name,this.picture,this.imageid]).then(res => {
					console.log(this.path);
					console.log(name);
					console.log(newName);
					this.file.removeFile(this.path, name).catch(e => console.log('Image didn\'t remove: ' + e.message));					
					this.savebase64AsFile(this.path, newName, this.picture, this.image.type); 
					this.navCtrl.pop();
				}).catch(e => console.log(e));                   
			}).catch(e => console.log('SQLite didn\'t create: ' + e.message));	
		}
	}

}
