import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Ruta } from 'src/app/services/Ruta';
import { Router } from '@angular/router';
import 'leaflet-routing-machine';
import { HttpClient  } from '@angular/common/http';
declare let L:any;

@Component({
  selector: 'app-routerinfo',
  templateUrl: './routerinfo.component.html',
  styleUrls: ['./routerinfo.component.css']
})
export class RouterinfoComponent implements OnInit  {
  eID:any;
  ruta:Ruta=new Ruta("","");
  router!:Router;
  map:any;
  http:any;
  db:any;
  loading:boolean=true;
  ImageList:any={};
  ImageListAlt:any={};
  actimage:String="";
  actuser!:String;
  actlike!:String;
  Description!:String;
  Name!:String;
  Object=Object;
  Userlikes!:any;



  Imagelenght:number=0;
  actid:number=0;
  UserId:any;
  Useradmin:any;
  
  flowid:any;
  UserName!:any;
  wait:boolean=false;
  page!:number;
  
  


  constructor(private activateroute: ActivatedRoute,db:DBconectService,router:Router,http:HttpClient) { 
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    this.db=db;
    this.router=router;
    this.http=http;
    
    Promise.resolve(db.ObtenerRuta(this.eID)).then(item => {
      setTimeout(() => {
        this.ruta=item;
        this.createMap();
        this.loading=false;
      },400);
    });
  }

       /* try {
          //this.flowid=item.Flora[0].id;
          this.Imagelenght=Object.keys(this.Image).length;
          //this.Name=item.Flora[0].Name;
          this.actimage=this.Image[this.actid].Img;
          this.actuser=this.Image[this.actid].User;
          this.actlike=this.Image[this.actid].Like;
        } catch (error) {
          window.location.reload();
        }
        setTimeout(() => {
          this.loading=false;
        },300);
       // console.log(this.actimage);
        },400);
        if(this.UserId ==null){
          if(db.getToken() !=""){
            Promise.resolve(db.GetUser(db.getToken())).then(item=>{
              if(item !=null){
                this.Useradmin=item["Admin"];
                this.UserId=item["Email"];
                this.Userlikes=item["Likes"];
                this.UserName=item["UserName"];
              }
            });
          }
        }
     // this.Image=item.flora[0].img;
      //this.Description=item.flora[0].Description;
      //this.Name=item.flora[0].Name;
    });
*/
      

  ngOnInit(): void {}

  /*public showflower(item:Flor){
        this.actid=0;
        this.Imagelenght=Object.keys(this.Image).length;
        this.flowid=item.id;
        this.actimage=this.Image[this.actid].Img;
        this.actuser=this.Image[this.actid].User;
        this.actlike=this.Image[this.actid].Like;
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



  Deleteimage(){
    if(this.Image.length>1){
      Promise.resolve(this.db.Deleteimage(this.Image[this.actid].id,this.flowid,this.Name)).then(()=>{
        this.router.navigate(["/Route/"+this.eID]);
      });
    }
  }

  /*Deleteflor(){
    if(this.ruta.Flora.length>1){
      Promise.resolve(this.db.DeleteFlor(this.flowid,this.Name)).then(()=>{
        this.router.navigate(["/Route/"+this.eID]);
      });
    }
  }*/

  createMap(){
    const map = L.map("map",{scrollWheelZoom:true,minZoom: 8}).setView([0, 0], 13);
    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    map.addLayer(satellite);
    var baseMaps = {
      "OpenStreetMap": osm,
      "Satélite": satellite,
    };
    function createCustomIcon (feature:any, latlng:any) {
      let myIcon = L.icon({
        iconUrl: 'https://cdn.onlinewebfonts.com/svg/img_509228.png',
        shadowUrl: 'https://cdn.onlinewebfonts.com/svg/img_509228.png',
        iconSize:     [0, 0],
        shadowSize:   [0, 0], 
        iconAnchor:   [0, 0],
        shadowAnchor: [0, 0],  
        popupAnchor:  [0, 0] 
      })
      return L.marker(latlng, { icon: myIcon })
    }
    L.control.layers(baseMaps,{}, {position: 'bottomleft'}).addTo(map);
    const url =this.ruta.Waypoint;
    this.http.get(url).subscribe((res:any)=>{
      var latlngs:any = [];
      res.features.forEach((element:any)=>{
        latlngs.push(L.latLng(element.geometry.coordinates[1],element.geometry.coordinates[0]))
      });

      map.fitBounds(L.polyline(latlngs, {color: '#ff8300'}).addTo(map).getBounds());
      
      L.geoJson(res,{ pointToLayer: createCustomIcon}).addTo(map);

      //load waypoint images
      const basicBeachIcon = L.icon({
        iconUrl: 'https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Icons%2Fflowermarker.png?alt=media&token=5ee151d3-1bfe-41bf-9041-4c52b3194313',
        iconSize: [35, 50],
        iconAnchor: new L.Point(19, 5)
      });
      let markerOptions = {
        clickable: false,
        icon: basicBeachIcon
      }
      let marker:any;
      if(this.ruta.Marks.length>0){

        for(marker of this.ruta.Marks){
          const mark=L.marker([marker["Lat"], marker["Lng"]], markerOptions).bindPopup('<img src="'+marker["Flor"][0].Img+'"> <div><strong>'+marker["Flor"][0]["Flor"]["Name"]+'</strong> <br> '+marker["Flor"][0]["Flor"]["Info"]+'</div>').openPopup();
          mark.addTo(map);
          let num=0;
          for(let flor of marker["Flor"]){
            let images:any=[];
            let key=mark["_latlng"]["lat"]+""+mark["_latlng"]["lng"]+""+num;
            images.push([flor.Img, flor["Flor"]["Name"],flor.Likes,flor.User,flor["Flor"]["Info"]]);
            num++;
            this.ImageList[key]=images;
            this.ImageListAlt[key]=images;
          }
          mark.on('mouseover',function(ev:any) {
            mark.openPopup();
          });

          mark.on('mouseout',function(ev:any) {
            map.closePopup();
          });

          mark.on('click',()=> {
            this.ImageList=[];
            let key=mark["_latlng"]["lat"]+""+mark["_latlng"]["lng"];
            let num=0;
            while(this.ImageListAlt[key+num]!=null){
              this.ImageList[key+num]=this.ImageListAlt[key+num];
              num++;
            }
          });
        }
      }
    });
  }

  showImage(item:any){
    for(let item2 of this.ImageList[item]){
      this.actimage=item2[0];
      this.actlike=item2[2],
      this.actuser=item2[3];
      this.Description=item2[4];
      this.Name=item2[1];
    }
  }

  showAll(){
    this.ImageList={};
    for(let item2 of Object.keys(this.ImageListAlt)){
      this.ImageList[item2]=this.ImageListAlt[item2];
      //this.actimage=item2[0];
    }
  }

  close(){
    this.actimage="";
  }
}
