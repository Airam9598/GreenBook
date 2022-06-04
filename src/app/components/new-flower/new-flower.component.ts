import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ruta } from 'src/app/services/Ruta';
import { DBconectService } from 'src/app/services/dbconect.service';
import { ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Flor } from 'src/app/services/Flor';
import { FLowerImage } from 'src/app/services/FlowerImges';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-flower',
  templateUrl: './new-flower.component.html',
  styleUrls: ['./new-flower.component.css']
})
export class NewFlowerComponent implements OnInit {
  @ViewChild("foto", {
    read: ElementRef
  })
  
  foto!: ElementRef;
  FormularioFlor:FormGroup;
  db:DBconectService;
  files!:File;
  subiendo:any=false;
  username!:string;
  adminuser:boolean=false;
  router:Router;
  Error:boolean=false;
  eID:any;
  fid!:any;
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router,private activateroute: ActivatedRoute) { 
    this.FormularioFlor=this.formulario.group({Files:[''],FlowerName:[''],FlowerDescription:['']});
    this.db=db2;
    this.router=router;
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    Promise.resolve(this.db.getFlowerid(this.eID)).then(item=>{
      this.fid=item;
    });
    Promise.resolve(this.db.GetUser(this.db.getToken())).then(item=>{
      if(item ==null){
        this.db.deleteToken();
        router.navigate(["/Login"]);
      }else{
        this.username=item["UserName"];
        this.adminuser=item["Admin"];
      }
    })
  }

  ngOnInit(): void {
  }
  async enviar_Datos(){
    if(this.FormularioFlor.value["FlowerName"] !="" && this.FormularioFlor.value["FlowerDescription"] !="" && this.foto.nativeElement.files.length>0){
      this.db.subiendo=true;
      this.Error=false;
      var fileList = this.files=this.foto.nativeElement.files;
      const random = Math.floor(Math.random() * 200);
      let arra:Array<FLowerImage>=[];
      for(let file of fileList){
        await this.db.AgregarImagen(new FLowerImage("",{User:this.username,Likes:0,Img:random+file.name}),random+file.name)?.then(item=>{
          arra.push(new FLowerImage(item.id,{User:this.username,Likes:0,Img:random+file.name}));
        }) 
      }
      let flor= new Flor("",{Name:this.FormularioFlor.value["FlowerName"],Description:this.FormularioFlor.value["FlowerDescription"]},arra);
      await this.db.Addflower2(this.fid,flor)?.then(item=>{
        this.db.subiendo=false;
        setTimeout(()=>{
          this.router.navigate(["/Route/"+this.eID]);
        },2500);
      });




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