import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EndPointService {

  constructor(
    private http: HttpClient
  ) { }

  Post(body: object, route: string){
    return this.http.post(`${environment.api}${route}`, body);
  }
}
