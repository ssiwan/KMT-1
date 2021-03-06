import {Component, OnInit, Output, EventEmitter, Testability} from '@angular/core';
import { ArticleService } from '../../article.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.css']
})
export class CreateArticleComponent implements OnInit {
@Output() backToHome = new EventEmitter;
  data: any = '';
  subData: any = '';
  result: any = '';
  article_title: any;
  article_desc: any;
  article_path: any;
  article_content: any;
  categoryName: any = '';
  SubCategoryName: any = '';
  categoryID: any = '';
  userName: any ;
  roles: any = "";
  user_id: any = +this.articleService.getFromSessionStorage('UserId');
  username: any = this.articleService.getFromSessionStorage('UserName');
  article_tag: any = '';
  articleDetailsData: any = [];
  files: any;
  fileName: any;
  uploadStatus: any;
  fileSuccessMessage: string;
  articleTag1: string = ' ';
  articleTag2: string = ' ';
  articleTag3: string = ' ';
  articleTagResult: string;
  artFileParam: any;
  artTagParam: any;
  validationError: boolean = false;
  artDescParam : any;
  artContent : any;

  constructor(private articleService: ArticleService, private router: Router) {   }

  ngOnInit() {

    if (this.articleService == null) {
      //console.log("Login to append user name")
    } else {
      this.userName = this.articleService.getFromSessionStorage("UserName");
     //below changes are only intended for Production-- added by Mahaboob Mulla
      if(this.userName == "author Kim"){
        this.userName = "Kim";
      } else if (this.userName == "approver Ben"){
        this.userName = "Ben";
      } else {
        this.userName
      }
      
      this.roles = this.articleService.getFromSessionStorage("Roles");
      //console.log("roles:");
     // console.log(this.roles);
    }

    this.articleService.getParentCategory()
      .subscribe((res: Response) => {
        this.result = res;
        this.data = this.result.entries.entry;
       // console.log('displaying parent category');
       // console.log(this.data);
      });

    this.articleService.getSubCategory()
      .subscribe((res: Response) => {
        this.result = res;
        this.subData = this.result.entries.entry;
       // console.log('displaying sub category');
       // console.log(this.subData);
      });


  }

  insertArticleData() {

    console.log(this.article_title);

    if(this.article_title == undefined || this.SubCategoryName == ''|| this.article_title.trim() == "")
    {
       this.validationError = true;
    }
    else
    {

    //console.log(this.username);

    this.categoryID = this.data.categoryID;
    let subCategoryId = +this.SubCategoryName;
    
    if(this.fileName != undefined)
    this.artFileParam = this.fileName;
    else
    this.artFileParam = null;
    

    if(this.articleTagResult != undefined)
    this.artTagParam = this.articleTagResult;
    else
    this.artTagParam = null;

    if(this.article_desc != undefined)
    this.artDescParam = this.article_desc;
    else
    this.artDescParam = null;

    if(this.article_content != undefined)
    this.artContent = this.article_content;
    else
    this.artContent = null;

    
     //console.log(this.fileName);
     //console.log(this.articleTagResult);
     //console.log(this.article_content);

    let dataObj = {
      '_postinsertarticle': {
        'article_title': this.article_title,
        'article_desc': this.artDescParam,
        //'article_desc': this.article_desc,
        //'article_path': this.fileName,
        'article_path':this.artFileParam,
        //'article_content': this.article_content,
        'article_content': this.artContent,
        'user_id': this.user_id,
        'categoryid': subCategoryId,
        'article_tag': this.artTagParam,
        // 'article_tag': this.articleTagResult,
        'username': this.username
      }
    };
    this.articleService.insertArticle(dataObj)
      .subscribe((data) => {
        alert("article inserted successfully");
        //this.router.navigate(['./home']);
        this.backToHome.emit(false);
      },
      (err) => {
        alert(err);
      }
      );
    this.articleService.sendEmail('Knowledge Article Inserted', 'Dear User, The Knowedge article has been inserted successfully. You can review your article in Draft for any changes and submit for approval.');
  }
  }

  public createArticleInputTag(TagName: string) {

    var unit = (<HTMLInputElement>document.getElementById('articleInputTags')).value;

    if (TagName != '')
      unit = TagName;

    var input1 = document.getElementById('inputTag1').innerHTML;
    var input2 = document.getElementById('inputTag2').innerHTML;
    var input3 = document.getElementById('inputTag3').innerHTML;


    if (input1 == '') {
      document.getElementById('inputTag1').innerHTML = unit;
      if (document.getElementById('inputTag1').innerHTML != null) {
        this.articleTag1 = unit;
        this.articleTagResult = this.articleTag1;
      }
    } else {
      if (input2 == '') {
        document.getElementById('inputTag1').innerHTML = unit;
        document.getElementById('inputTag2').innerHTML = input1;
        if (document.getElementById('inputTag1').innerHTML != null) {
          this.articleTag2 = (document.getElementById('inputTag1').innerHTML);
          this.articleTagResult = this.articleTag1 + ' ' + this.articleTag2;
          //console.log(this.articleTagResult);
        };
      } else {
        document.getElementById('inputTag1').innerHTML = unit;
        document.getElementById('inputTag2').innerHTML = input1;
        document.getElementById('inputTag3').innerHTML = input2;
        //this.articleTag3= document.getElementById('inputTag3').innerHTML;
        if (document.getElementById('inputTag1').innerHTML != null) {
          this.articleTag3 = (document.getElementById('inputTag1').innerHTML);
          this.articleTagResult = this.articleTag1 + ' ' + this.articleTag2 + ' ' + this.articleTag3;
          //console.log(this.articleTagResult);
        };
      }
    }
  }

  uploadFile(event) {
    this.files = event.target.files;
    this.fileName = this.files[0].name;
    //console.log(this.fileName);
    this.uploadStatus = this.articleService.uploadFile(this.files[0]);
    if (this.uploadStatus == 'true') {
      this.fileSuccessMessage = 'File uploaded successfully';
    }
    else
      this.fileSuccessMessage = 'Error occured while upload file';
  }

  onbackToHome() {
    this.router.navigate(['./home']);
  }

}
