import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ImageServiceProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ImageServiceProvider Provider');
  }

}
