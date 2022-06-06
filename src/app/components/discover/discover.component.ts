import { Component, OnInit } from '@angular/core';
import { DBconectService } from 'src/app/services/dbconect.service';
import { User } from 'src/app/services/User';
@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  db:DBconectService;
  Users:Array<User>=[];
  MainImg!:String;
  MainUser!:String;
  UsersAlt:Array<User>=[];
  busqueda:string="";
  loading:boolean=true;
  constructor(db:DBconectService) { 
    this.db=db;
    this.loading=true;
    Promise.resolve(this.db.getUsers()).then(item=>{
      setTimeout(()=>{
        item.forEach(data=>{ this.UsersAlt.push(data); });
        this.Users=item;
        this.Users=this.Users.splice(this.Users.length-1, 1);
        this.MainImg=item[0].Img.Img;
        this.MainUser=item[0].UserName;
        setTimeout(()=>{
          this.loading=false;
        },100);
      },800)
      
    })
  }

  ngOnInit(): void {
  }

  Discover(){
    this.Users=[];
    if(this.busqueda==""){
      this.UsersAlt.forEach(User=>{
          this.Users.push(User);
      });
      this.Users.splice(this.Users.length-1, 1);
    }else{
      this.UsersAlt.forEach(User=>{
        if(User.UserName.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase())){
          this.Users.push(User);
        }
      });
    }
  }

}
