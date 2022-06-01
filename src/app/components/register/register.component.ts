import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DBconectService} from 'src/app/services/dbconect.service';
import { Router} from '@angular/router';
import * as crypto from 'crypto-js';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  Formularioregister:FormGroup;
  db:DBconectService;
  resolv:string="";
  router:Router;
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.Formularioregister=this.formulario.group({Email:[''],Pass:[''],User:['']});
    this.db=db2;
    this.router=router
  }

  ngOnInit(): void {
  }

 async enviar_Datos(){
  let pass= crypto.SHA3(this.Formularioregister.value["Pass"]);
  this.resolv=await this.db.RegistrarUsuario(this.Formularioregister.value["Email"],pass.toString(crypto.enc.Hex),this.Formularioregister.value["User"]);
   if( this.resolv =="true"){
    this.router.navigate(["/User"]);
   }
  }

  gohome(){
    this.router.navigate(["/"]);
  }
}
