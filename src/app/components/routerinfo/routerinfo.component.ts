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
  Imagelenght:number=0;
  Description!:String;
  Name!:String;
  Userlikes!:any;
  actimage!:String;
  actid:number=0;
  actuser!:String;
  actlike!:String;
  loading:boolean=true;
  UserId:any;
  Useradmin:any;
  db:any;
  wait:boolean=false;
  constructor(private activateroute: ActivatedRoute,db:DBconectService) { 
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    this.db=db;
    Promise.resolve(db.ObtenerRuta(this.eID)).then(item => {
      setTimeout(() => {
        this.ruta=item;
        this.Image=item.Flora[0].Img;
        this.Imagelenght=Object.keys(this.Image).length;
        this.Description=item.Flora[0].Description;
        this.Name=item.Flora[0].Name;
        this.actimage=this.Image[this.actid].Img;
        this.actuser=this.Image[this.actid].User;
        this.actlike=this.Image[this.actid].Like;
        setTimeout(() => {
          this.loading=false;
        },300);
       // console.log(this.actimage);
        },400);
        if(this.UserId ==null){
          if(db.getToken() !=""){
            Promise.resolve(db.GetUser(db.getToken())).then(item=>{
              if(item !=null){
                console.log(item);
                this.Useradmin=item["Admin"];
                this.UserId=item["Email"];
                this.Userlikes=item["Likes"];
                console.log(this.Userlikes);
              }
            });
          }
        }
     // this.Image=item.flora[0].img;
      //this.Description=item.flora[0].Description;
      //this.Name=item.flora[0].Name;
    });

  }

  ngOnInit(): void {}

  public showflower(item:Flor){
        this.actid=0;
        this.Image=item.Img;
        this.Imagelenght=Object.keys(this.Image).length;
        this.actimage=this.Image[this.actid].Img;
        this.actuser=this.Image[this.actid].User;
        this.actlike=this.Image[this.actid].Like;
        this.Description=item.Description;
        this.Name=item.Name;
  }

  changeImg(number:number){
    if(this.actid+number<0 || this.actid+number==this.Image.length ){
    }else{
      this.actid=this.actid+number;
      this.actimage=this.Image[this.actid].Img;
      this.actuser=this.Image[this.actid].User;
      this.actlike=this.Image[this.actid].Like;
    }
  }

  likes(){
    if(!this.wait){
      this.wait=true;
      let find;
      let key2:any;
      Object.values(this.Userlikes).forEach((item:any,key:any)=>{
        if(item==this.Image[this.actid].id){
          find=true;
          key2=key;
        }
      });
      if(!find){
        this.Userlikes[Object.keys(this.Userlikes).length]=this.Image[this.actid].id;
        this.actlike=""+(parseInt(this.actlike.toString())+1);
        this.db.LikeImage(this.UserId,this.Image[this.actid].id,parseInt(this.actlike.toString()));
      }else{
        this.Userlikes[key2]="";
        this.actlike=""+(parseInt(this.actlike.toString())-1);
        this.db.UnLikeImage(this.UserId,this.Image[this.actid].id,key2,parseInt(this.actlike.toString()));
      }
      setTimeout(()=>{
        this.wait=false;
      },2000);
    }
  }
}
