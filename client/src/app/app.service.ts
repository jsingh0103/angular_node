import { Injectable } from '@angular/core';
import { HttpClient,HttpRequest,HttpHeaders} from "@angular/common/http";
import { HttpErrorResponse,HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private baseUrl = 'http://localhost:3000/api/v1/users';
 
  constructor(public http: HttpClient) { }
  public signupFunction(data:any):any{
    const params = new HttpParams()
    .set('first_name',data.firstName)
    .set('last_name', data.lastName)
    .set('user_email',data.email)
    .set('user_age',data.age)
    .set('user_password',data.password)
    .set('avatar',data.avatar);
    let responseData = this.http.post(this.baseUrl + '/signup',params);
    return responseData
  }

  // upload(file: File):any{
  //   const formData: FormData = new FormData();

  //   formData.append('avatar', file);


  //   return this.http.post(this.baseUrl +"/signup",formData)
  // }

  getCurrentRecord(providedId:any):any{
    let myResponse = this.http.get(this.baseUrl + "/user/" + providedId)
    return myResponse;
  }
  public signinFunction(data:any):any{
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password);
    return this.http.post(this.baseUrl + '/login',params);
  }

  public editCurrentUser(user_id:any,user_info:any):any{
    let myResponse = this.http.put(this.baseUrl + "/edit/" + user_id, user_info)
    return myResponse
  }
  public uploadCSV(fileValue:any):any{
    return this.http.post(this.baseUrl + "/uploadcsv",fileValue)
  }

  public getAllRecords():any{
    return this.http.get(this.baseUrl +"/all")
  }
  public getUserInfo = ()=>{
    return JSON.parse(localStorage.getItem("userInfo")||'{}');
  }
  
  public setUserInfo= (data:any)=>{
    localStorage.setItem("userInfo",JSON.stringify(data));
  }
}
