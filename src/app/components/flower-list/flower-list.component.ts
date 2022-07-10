import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Flor } from 'src/app/modules/Flor';

@Component({
  selector: 'app-flower-list',
  templateUrl: './flower-list.component.html',
  styleUrls: ['./flower-list.component.css']
})
export class FlowerListComponent implements OnInit {
  db:DBconectService;
  Flower:Array<Flor>=[];
  FlowerAlt:Array<Flor>=[];
  busqueda:string="";
  loading:boolean=true;
  router!:Router;
  page!:any;
  constructor(db:DBconectService,router:Router) { 
    this.db=db;
    this.loading=true;
    this.router=router;
  }

  ngOnInit(): void {
    Promise.resolve(this.db.getFlowers()).then(item=>{
      setTimeout(()=>{
        item.forEach(data=>{ this.FlowerAlt.push(data); });
        this.Flower=item;
        setTimeout(()=>{
          this.loading=false;
        },100);
      },800)
      
    })
  }

  filter(){
    this.Flower=[];
    if(this.busqueda==""){
      this.FlowerAlt.forEach(Flor=>{
          this.Flower.push(Flor);
      });
    }else{
      this.FlowerAlt.forEach(Flor=>{
        if(Flor.Name.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase())){
          this.Flower.push(Flor);
        }
      });
    }
  }

  DeleteFlower(id:any){
    Promise.resolve(this.db.DeleteFlor(id)).then(()=>{
      this.ngOnInit();
    });
  }

}
