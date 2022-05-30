import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Ruta } from 'src/app/services/Ruta';
import { Flor } from 'src/app/services/Flor';
import { FLowerImage } from 'src/app/services/FlowerImges';

@Component({
  selector: 'app-routerinfo',
  templateUrl: './routerinfo.component.html',
  styleUrls: ['./routerinfo.component.css']
})
export class RouterinfoComponent implements OnInit {
  eID:any;
  ruta:Ruta=new Ruta("","");
  Image!:Array<FLowerImage>;
  Description!:String;
  Name!:String;
  actimage!:String;
  actid:number=0;
  actuser!:String;
  loading:boolean=true;
  constructor(private activateroute: ActivatedRoute,db:DBconectService) { 
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    Promise.resolve(db.ObtenerRuta(this.eID)).then(item => {
      setTimeout(() => {
        this.ruta=item;
        console.log(item.Flora);
        this.Image=item.Flora[0].Img;
        this.Description=item.Flora[this.actid].Description;
        this.Name=item.Flora[this.actid].Name;
        this.actimage=this.Image[this.actid].Img;
        this.actuser=this.Image[this.actid].User;
        setTimeout(() => {
          this.loading=false;
        },300);
       // console.log(this.actimage);
        },400);
     // this.Image=item.flora[0].img;
      //this.Description=item.flora[0].Description;
      //this.Name=item.flora[0].Name;
    });

  }

  ngOnInit(): void {}

  public showflower(item:Flor){
        this.actid=0;
        this.Image=item.Img;
        this.actimage=this.Image[this.actid].Img;
        this.actuser=this.Image[this.actid].User;
        this.Description=item.Description;
        this.Name=item.Name;
  }

  changeImg(number:number){
    if(this.actid+number<0 || this.actid+number==this.Image.length ){
    }else{
      this.actid=this.actid+number;
      this.actimage=this.Image[this.actid].Img;
      this.actuser=this.Image[this.actid].User;
    }
  }
}
