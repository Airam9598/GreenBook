import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Router } from '@angular/router';
import * as crypto from 'crypto-js'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Formulariologin:FormGroup;
  db:DBconectService;
  resolv:string="";
  router:Router;
  errormsg:string="";
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.Formulariologin=this.formulario.group({Email:[''],Pass:['']});
    this.db=db2;
    this.router=router
    if(this.db.getToken()!=""){
      router.navigate(["/User"]);
    }
  }

  ngOnInit(): void {
  }
  async send_info(){
    this.errormsg="";
    if(this.Formulariologin.value["Email"]!= "" && this.Formulariologin.value["Pass"]!= ""){
      let pass= crypto.SHA3(this.Formulariologin.value["Pass"]);
      Promise.resolve(this.db.CheckUsuarios(this.Formulariologin.value["Email"],pass.toString(crypto.enc.Hex))).then(item=>{
        if(item=="true"){
          this.router.navigate(["/User"]);
        }else{
          this.errormsg="🚫 "+item;
        }
      });
    }else{
      this.errormsg="🚫 Faltan datos";
    }
  }
  gohome(){
    this.router.navigate(["/"]);
  }
}

