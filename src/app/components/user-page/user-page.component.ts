import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { FLowerImage } from 'src/app/services/FlowerImges';
import * as crypto from 'crypto-js';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {
Changepass:FormGroup;
db:any;
username!:string;
email!:string;
router:Router;
admin!:boolean;
images!:Array<FLowerImage>;
eID:any;
errormsg:string="";
correctmsg:boolean=false;
  constructor(db:DBconectService,router:Router,private activateroute: ActivatedRoute,public formulario:FormBuilder) { 
    this.db=db;
    this.router=router;
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    this.Changepass=this.formulario.group({oldpass:[''],newpass1:[''],newpass2:['']});
    if(this.eID ==null){
      console.log(this.db.getToken());
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

  async enviar_Datos(){
    this.errormsg="";
    this.correctmsg=false;
    if(this.Changepass.value["newpass1"] != "" && this.Changepass.value["newpass2"] != "" && this.Changepass.value["oldpass"] != ""){
      if(this.Changepass.value["newpass1"]==this.Changepass.value["newpass2"]){
        if(this.Changepass.value["newpass1"] != this.Changepass.value["oldpass"]){
              Promise.resolve(this.db.CheckUsuarios(this.email,crypto.SHA3(this.Changepass.value["oldpass"]).toString(crypto.enc.Hex))).then(item=>{
                if(item=="true"){
                  let pass= crypto.SHA3(this.Changepass.value["newpass1"]);
                  Promise.resolve(this.db.Changepass(this.email,pass.toString(crypto.enc.Hex))).then(item2=>{
                    if(item2){
                      this.correctmsg=true;
                      }else{
                        this.errormsg="🚫 Error al cambiar la contraseña";
                      }
                  })
                }else{
                  this.errormsg="🚫 "+item;
                }
              })
        }else{
          this.errormsg="🚫 La contraseña antigua y nueva son iguales";
        }
      }else{
        this.errormsg="🚫 Las contraseñas nuevas no coinciden";
      }
    }else{
      this.errormsg="🚫 Faltan datos";
    }
  }

}
