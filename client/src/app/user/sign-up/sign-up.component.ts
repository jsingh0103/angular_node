import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { AppService } from 'src/app/app.service';
import {Cookie} from 'ng2-cookies/ng2-cookies';
import { ToastrService } from 'ngx-toastr';
import { HttpClient,HttpEvent } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public first_name: any;
  public last_name: any;
  public user_email: any;
  public user_age: any;
  public user_password: any;
  public avatar: any;

  // public selectedFiles?: FileList;
  // public currentFile?: File;
  // public progress = 0;
  // public message = '';

  constructor(public appService: AppService, public router: Router,public toastr: ToastrService) { }

  ngOnInit(): void {
  }

  public goToSignIn():any{
    this.router.navigate(['/']);
  }
  // selectFile(event: any): void {
  //   this.avatar = event.target.files;
  // }
  // upload(): void {
  //   this.progress = 0;
  
  //   if (this.selectedFiles) {
  //     const file: File | null = this.selectedFiles.item(0);
  
  //     if (file) {
  //       this.currentFile = file;
  
  //       this.appService.upload(this.currentFile).subscribe(
  //         (event: any) => {
  //           console.log("Event is here "+ JSON.stringify(event))
  //           // if (event.type === HttpEventType.UploadProgress) {
  //           //   this.progress = Math.round(100 * event.loaded / event.total);
  //           // } else if (event instanceof HttpResponse) {
  //           //   this.message = event.body.message;
  //           //   // this.fileInfos = this.uploadService.getFiles();
  //           // }
  //         },
  //         (err: any) => {
  //             this.message = 'Could not upload the file!';
  
  //           this.currentFile = undefined;
  //         });
  //     }
  
  //     this.selectedFiles = undefined;
  //   }
  // }
  

  
  
  public signupFunction():any{
    // console.log(this.avatar)
    // this.progress = 0;
  
    // if (this.selectedFiles) {
    //   const file: File | null = this.selectedFiles.item(0);
      
    //   if (file) {
    //     this.currentFile = file;
    //   }
    // }
    // console.log("Current file is " + this.currentFile)
    //   debugger;
    // console.log('signup called.')
    
    let data = {
      firstName: this.first_name,
      lastName: this.last_name,
      email: this.user_email,
      age: this.user_age,
      password: this.user_password,
      avatar: ""
      // avatar: JSON.stringify(this.currentFile)
    }
    
    this.appService.signupFunction(data).subscribe(
      (apiResponse:any)=>{
        if(apiResponse.status == 200){
          Cookie.set("firstName",apiResponse.data.first_name)
          Cookie.set("userId",apiResponse.data.user_id)
          Cookie.set("userEmail",apiResponse.data.user_email)
          console.log("User email is "+ Cookie.get("userEmail"))
          let info = {
            first_name: apiResponse.data.first_name,
            user_id: apiResponse.data.user_id,
            user_email: apiResponse.data.user_email,
          }
          this.appService.setUserInfo(info)
          this.toastr.success("Signup Successful.")
          setTimeout(() => {
            this.router.navigate(['user/',apiResponse.data.user_id])
          },1000);
      }
      else{
        this.toastr.warning(apiResponse.message)
      }
      },
      (error:any)=>{
        this.toastr.warning("An error occoured.")
      }
    )
  }


}
