import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SignUpComponent } from './sign-up/sign-up.component';
import { UserViewComponent } from './user-view/user-view.component';
import { UserEditComponent } from './user-edit/user-edit.component';

@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    UserViewComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path: "sign-up",component: SignUpComponent},
      {path: "user/:user_id",component: UserViewComponent},
      {path: "edit/:user_id",component: UserEditComponent}
    ])
  ]
})
export class UserModule { }
