import { Component, OnInit } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  public current_user:any;
  public first_name: any;
  public last_name: any;
  public user_email: any;
  public user_age: any;
  public user_password: any;

  constructor(public toastr: ToastrService,private _route: ActivatedRoute, private router: Router, public appService: AppService) { }

  ngOnInit(): void {
    
    let user_id = this._route.snapshot.paramMap.get('user_id');

    this.appService.getCurrentRecord(user_id).subscribe(
    (data:any)=>{
      this.current_user = data
    },
    (error:any)=>{
      console.log(error.errorMessage);
    }
    )
  }
  public editUser():any{
    console.log("UPLOADING PARAMS"+ this.user_password) 
    if(this.user_password !=undefined){
      this.current_user.user_password = this.user_password 
    }
    this.appService.editCurrentUser(this.current_user.user_id,this.current_user).subscribe(
      (data:any)=>{
        console.log("blog edited.");
        this.toastr.success("Profile updated successfully.")
        setTimeout(()=>{
          this.router.navigate(['/user',this.current_user.user_id])
        },1000)
      },
      (error:any)=>{
        this.toastr.warning("An error occoured.")
        console.log("Error Occoured.");
      }
    )
  }
}
