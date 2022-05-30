import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { FLowerImage } from 'src/app/services/FlowerImges';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
db:any;
username!:string;
email!:string;
router:Router;
admin!:boolean;
images!:Array<FLowerImage>;
eID:any;
  constructor(db:DBconectService,router:Router,private activateroute: ActivatedRoute,) { 
    this.db=db;
    this.router=router;
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    if(this.eID ==null){
      Promise.resolve(this.db.GetUser(this.db.getToken())).then(item=>{
        if(item !=null){
          this.username=item["UserName"];
          this.email=item["Email"];
          this.admin=item["Admin"];
          Promise.resolve(this.db.getUserImages(this.username)).then(item=>{
            this.images=item;
          });
        }else{
          this.db.deleteToken();
          router.navigate(["/Login"]);
        }
      });
    }else{
      Promise.resolve(this.db.getUserImages(this.eID)).then(item=>{
        this.images=item;
      });
    }
  }

  ngOnInit(): void {
  }

  closesession(){
    Promise.resolve(this.db.closesesion()).then(item=>{
      this.router.navigate(["/Login"]);
    })
  }

}
