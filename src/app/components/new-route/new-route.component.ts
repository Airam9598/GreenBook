import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ruta } from 'src/app/services/Ruta';
import { DBconectService } from 'src/app/services/dbconect.service';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Flor } from 'src/app/services/Flor';


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
  fotogeo!: any;
  FormularioRuta:FormGroup;
  db:DBconectService;
  files!:File;
  subiendo:any=false;
  username!:string;
  router:Router;
  Error:boolean=false;
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router) { 
    this.FormularioRuta=this.formulario.group({Name:[''],Description:[''],Files:[''],Filesgeo:['']});
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

imageRun(e:any){
  this.fotogeo= e.target.files;
}

  ngOnInit(): void {
  }
  enviar_Datos():any{
    if(this.FormularioRuta.value["Name"] !="" && this.FormularioRuta.value["Description"] !="" && this.foto.nativeElement.files.length>0 && Object.keys(this.fotogeo).length>0){
      this.Error=false;
      let ruta= new Ruta("",{Name:this.FormularioRuta.value["Name"],Description:this.FormularioRuta.value["Description"],Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Rutas%2F"+this.foto.nativeElement.files[0].name+"?alt=media&token=e064b6ad-3835-4dae-a1be-339936df46d3",Marks:[],Waypoints:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Rutas%2F"+this.fotogeo[0].name+"?alt=media&token=34cec46d-a49a-4932-813c-d0b957292c26"});
     
      //const random = Math.floor(Math.random() * 200);
     this.db.AgregarRuta(ruta);
      this.db.Subirrchivo(this.fotogeo,this.foto.nativeElement.files);
    }else{
      this.Error=true;
    }
  }

  cancel(){
    this.router.navigate(["/User"]);
  }
}
