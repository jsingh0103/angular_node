import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public email:any;
  public password:any;
  constructor(public appService: AppService, public toastr: ToastrService,public router: Router) { }

  ngOnInit(): void {
  }
  public signinFunction():any{
    if(this.email == undefined || this.password == undefined){
      this.toastr.warning("One or more Parameter(s) is missing.")
    }else{
      Cookie.deleteAll()
      let data = {
        email: this.email,
        password: this.password
      }
      this.appService.signinFunction(data).subscribe(
        (res:any)=>{
          if(res.status == 200){
            let result_data:any = Object.values(res)
            let result = result_data[3]
            this.toastr.success("Login Successful")
            Cookie.set("firstName",result.first_name)
            Cookie.set("userId",result.user_id)
            Cookie.set("userEmail",result.user_email)
            setTimeout(()=>{
              this.router.navigate(["/user",result.user_id])
            },1000)
          }else{
            this.toastr.warning(res.message)
          }
        },
        (error:any)=>{
          this.toastr.warning("Login failed.An error occoured.")
        }
      )
    }
  }
}
