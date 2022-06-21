import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Router,ActivatedRoute } from '@angular/router';
import { Flor } from 'src/app/services/Flor';

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
  subiendo:any=true;
  username!:string;
  adminuser:boolean=false;
  router:Router;
  Error:boolean=false;
  eID:any;
  FlowerData:any={};
  constructor(public formulario:FormBuilder,private db2:DBconectService,router:Router,private activateroute: ActivatedRoute) { 
    this.FormularioFlor=this.formulario.group({Files:[''],FlowerName:[''],FlowerDescription:[''],Tipo:['']});
    this.db=db2;
    this.router=router;
    this.subiendo=true;
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    if(this.eID !=null){
      Promise.resolve(this.db.GetFlowerData(this.eID)).then(item => {
        this.FlowerData=item;
      });
    }

    Promise.resolve(this.db.GetUser(this.db.getToken())).then(item=>{
      if(item ==null){
        this.db.deleteToken();
        router.navigate(["/Login"]);
      }else{
        this.username=item["UserName"];
        this.adminuser=item["Admin"];
      }
      this.subiendo=false;
    })
  }

  ngOnInit(): void {
  }
  async enviar_Datos(){
    if(this.eID !=null){
        this.subiendo=true;
        this.Error=false;
        let fileList =this.foto.nativeElement.files;
        await this.db.ModificarFlora(this.FormularioFlor.value["FlowerName"],this.FormularioFlor.value["FlowerDescription"],this.FormularioFlor.value["Tipo"],fileList,this.eID);
        if(fileList.length>0){
          Promise.resolve( this.db.subirImgFlora(fileList)).then(()=>{
            this.subiendo=false;
          })
        }else{
          this.subiendo=false;
        }

    }else{
      if(this.FormularioFlor.value["FlowerName"] !="" && this.FormularioFlor.value["FlowerDescription"] !="" && this.foto.nativeElement.files.length>0 && this.FormularioFlor.value["Tipo"] !=""){
        this.subiendo=true;
        this.Error=false;
        let fileList =this.foto.nativeElement.files;

        let flor= new Flor("",{Name:this.FormularioFlor.value["FlowerName"],Info:this.FormularioFlor.value["FlowerDescription"],Type:this.FormularioFlor.value["Tipo"],Img:"https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Img-Flor%2F"+fileList[0].name+"?alt=media&token=f03b7cf8-df71-44f2-83f5-c71c95c53a8d"});
        await this.db.AgregarFlora(flor);
        Promise.resolve( this.db.subirImgFlora(fileList)).then(()=>{
          this.subiendo=false;
        })
      }else{
        this.Error=true;
      }
    }
  }

  cancel(){
    this.router.navigate(["/FlowerList"]);
  }
}
