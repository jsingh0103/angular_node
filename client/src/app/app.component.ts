import { Component } from '@angular/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'login-frontend';
  constructor(private router: Router){}

  public userSignout=():any=>{

    Cookie.deleteAll()
    this.router.navigate(['/login'])
  }
}
