import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetusersService {
  private apiUrl='https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json'
  constructor(private _http:HttpClient) { }

  getUsers():Observable<any>{
    return this._http.get(`${this.apiUrl}`);
  }

}
