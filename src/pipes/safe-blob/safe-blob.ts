import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
	name: 'safeBlob',
})
export class SafeBlobPipe implements PipeTransform {
	constructor(private sanitizer:DomSanitizer){}
	
	transform(html) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(html);
	}
}
