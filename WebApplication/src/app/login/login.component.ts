import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../article.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';

const headers = new HttpHeaders()
  .set("Content-Type", "application/json");

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private articleService: ArticleService, private http: HttpClient) {
  }

  // userName = '';
  value: any = [
    { roleName: "" },
    { pwd: "" }
  ];

  data: any = [] ;
  result: any = [];
  UserResults: any = [];
  rolesData: any = [];
  rolesArray: any = [];
  roleName: any = "";
  usersDropdown: any = [];
  selectedUser:any;
  userFirstName: any = "";
  roleData : any = [];
  loginError: boolean = false;

  onLoginClick() {

    if(this.selectedUser != undefined && this.selectedUser != 0 && this.selectedUser != "select user" )
    {

    console.log(this.selectedUser);
    this.router.navigate(['./home']);
    var userDetails = this.data.filter(el => {
      if (el.userID
        == this.selectedUser){
          this.roleData.push(el.lkpRoleID)
        return true;
      }
    });
      
    this.articleService.saveInSessionStorage("Roles", userDetails);
    this.articleService.saveInSessionStorage("UserId", userDetails[0].userID);
    //this.articleService.saveInSessionStorage("UserName", userDetails[0].userFirstName);
    this.articleService.saveInSessionStorage("UserName", userDetails[0].userLastName);
  }
  else
  {
    this.getUserRoles();
    this.getUsers();
    this.loginError = true;
    //this.router.navigate(['']);
    
  }
  }
  ngOnInit() {      
    this.getUserRoles();
    this.getUsers();
  }

   getUsers() 
   { 
     //console.log('entering users loop')  ; 
    this.articleService.getUsers().subscribe((res: Response) => {
    this.result = res;
    this.usersDropdown = this.result.entries.entry;  
     })    
   }

    getUserRoles()
    {
      //console.log('entering getuserRoles')  ; 
      this.articleService.getUserData().subscribe((res: Response) => {
        this.UserResults = res;
        this.data = this.UserResults.entries.entry;
      })
    }
}
