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
  errormsg:string="";
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.Formularioregister=this.formulario.group({Email:[''],Pass:[''],User:['']});
    this.db=db2;
    this.router=router
  }

  ngOnInit(): void {
  }

  async enviar_Datos(){
    this.errormsg="";
    if(this.Formularioregister.value["Email"]!= "" && this.Formularioregister.value["User"]!= "" && this.Formularioregister.value["Pass"]!= ""){
      let pass= crypto.SHA3(this.Formularioregister.value["Pass"]);
      Promise.resolve(this.db.RegistrarUsuario(this.Formularioregister.value["Email"],pass.toString(crypto.enc.Hex),this.Formularioregister.value["User"])).then(item=>{
        if( item =="true"){
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
