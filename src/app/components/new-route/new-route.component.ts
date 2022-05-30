import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ruta } from 'src/app/services/Ruta';
import { DBconectService } from 'src/app/services/dbconect.service';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Flor } from 'src/app/services/Flor';
import { FLowerImage } from 'src/app/services/FlowerImges';


@Component({
  selector: 'app-new-route',
  templateUrl: './new-route.component.html',
  styleUrls: ['./new-route.component.css']
})
export class NewRouteComponent implements OnInit {
  @ViewChild("foto", {
    read: ElementRef
  })
  
  foto!: ElementRef;
  FormularioRuta:FormGroup;
  db:DBconectService;
  files!:File;
  subiendo:any=false;
  username!:string;
  router:Router;
  Error:boolean=false;
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.FormularioRuta=this.formulario.group({Name:[''],Description:[''],Files:[''],FlowerName:[''],FlowerDescription:['']});
    this.db=db2;
    this.router=router;
    Promise.resolve(this.db.GetUser(this.db.getToken())).then(item=>{
      if(item ==null){
        this.db.deleteToken();
        router.navigate(["/Login"]);
      }else{
        this.username=item["UserName"];
      }
    })
  }

  ngOnInit(): void {
  }
  enviar_Datos():any{
    if(this.FormularioRuta.value["Name"] !="" && this.FormularioRuta.value["Description"] !="" && this.FormularioRuta.value["FlowerName"] !="" && this.FormularioRuta.value["FlowerDescription"] !="" && this.foto.nativeElement.files.length>0){
      this.Error=false;
      let ruta= new Ruta("",{Name:this.FormularioRuta.value["Name"],Description:this.FormularioRuta.value["Description"],flora:[]});
      let flor= new Flor("",{Name:this.FormularioRuta.value["FlowerName"],Description:this.FormularioRuta.value["FlowerDescription"]},[]);
      var fileList = this.files=this.foto.nativeElement.files;
      const random = Math.floor(Math.random() * 200);
      this.db.AgregarRuta(ruta,flor,fileList,random,this.username);
      if(fileList.length>0){
        this.db.Subirrchivo(fileList,random);
      }
    }else{
      this.Error=true;
    }
  }

  cancel(){
    this.router.navigate(["/User"]);
  }
}
