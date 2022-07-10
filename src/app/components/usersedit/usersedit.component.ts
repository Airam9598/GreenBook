import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DBconectService} from 'src/app/services/dbconect.service';
import { ActivatedRoute,Router} from '@angular/router';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-usersedit',
  templateUrl: './usersedit.component.html',
  styleUrls: ['./usersedit.component.css']
})
export class UserseditComponent implements OnInit {
  Formularioregister:FormGroup;
  db:DBconectService;
  resolv:string="";
  router:Router;
  errormsg:string="";
  eID!:any;
  UserData:any={};
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router,private activateroute:ActivatedRoute) { 
    this.Formularioregister=this.formulario.group({Email:[''],Pass:[''],User:[''],Admin:['']});
    this.db=db2;
    this.router=router
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    Promise.resolve(this.db.GetUserData(this.eID)).then(item => {
      this.UserData=item;
    });
  }

  ngOnInit(): void {
  }

  async enviar_Datos(){
    this.errormsg="";
    console.log(this.Formularioregister.value["Admin"]+" "+this.Formularioregister.value["User"]);
      let pass="";
      if(this.Formularioregister.value["Pass"]!=""){
        pass=crypto.SHA3(this.Formularioregister.value["Pass"]).toString(crypto.enc.Hex);
      } 
      Promise.resolve(this.db.ModificarUsuario(this.Formularioregister.value["Email"],pass,this.Formularioregister.value["User"],this.Formularioregister.value["Admin"],this.eID)).then(item=>{
        if( item ==true){
          this.router.navigate(["/UsersList"]);
        }else{
          this.errormsg="🚫 "+item;
        }
      });
  }

  gohome(){
    this.router.navigate(["/"]);
  }
}
