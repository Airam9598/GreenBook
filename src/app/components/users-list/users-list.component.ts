import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { User } from 'src/app/modules/User';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  db:DBconectService;
  Users!:Array<User>;
  UsersAlt:Array<User>=[];
  busqueda:string="";
  loading:boolean=true;
  router!:Router;
  page!:any;
  constructor(db:DBconectService,router:Router) { 
    this.db=db;
    this.loading=true;
    this.router=router;
  }

  ngOnInit(): void {
    Promise.resolve(this.db.getUsers()).then(item=>{
      setTimeout(()=>{
        item.forEach(data=>{ this.UsersAlt.push(data); });
        this.Users=item;
        setTimeout(()=>{
          this.loading=false;
        },100);
      },800)
      
    })
  }

  Discover(){
    this.Users=[];
    if(this.busqueda==""){
      this.UsersAlt.forEach(User=>{
          this.Users.push(User);
      });
    }else{
      this.UsersAlt.forEach(User=>{
        if(User.UserName.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase())){
          this.Users.push(User);
        }
      });
    }
  }

  DeleteUser(id:any){
    Promise.resolve(this.db.DeleteUser(id)).then(()=>{
      this.ngOnInit();
    });
  }
}
