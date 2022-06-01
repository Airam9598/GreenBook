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
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.Formulariologin=this.formulario.group({Email:[''],Pass:['']});
    this.db=db2;
    crypto
    this.router=router
    if(this.db.getToken()!=""){
      router.navigate(["/User"]);
    }
  }

  ngOnInit(): void {
  }
 async enviar_Datos(){
  let pass= crypto.SHA3(this.Formulariologin.value["Pass"]);
  this.resolv=await this.db.CheckUsuarios(this.Formulariologin.value["Email"],pass.toString(crypto.enc.Hex));
   if( this.resolv =="true"){
    this.router.navigate(["/User"]);
   }
  }
  gohome(){
    this.router.navigate(["/"]);
  }
}

