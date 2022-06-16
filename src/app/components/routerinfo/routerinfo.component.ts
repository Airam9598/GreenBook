import { Component, OnInit, ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Ruta } from 'src/app/services/Ruta';
import { Flor } from 'src/app/services/Flor';
import { FLowerImage } from 'src/app/services/FlowerImges';
import { Router } from '@angular/router';
import 'leaflet-routing-machine';
import { HttpHeaders,HttpClient  } from '@angular/common/http';
declare let L:any;

@Component({
  selector: 'app-routerinfo',
  templateUrl: './routerinfo.component.html',
  styleUrls: ['./routerinfo.component.css']
})
export class RouterinfoComponent implements OnInit,AfterViewInit  {
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
  flowid:any;
  UserName!:any;
  wait:boolean=false;
  page!:number;
  router!:Router;
  map:any;
  http:any;

  ngAfterViewInit(){
   /* const map = L.map("map",{scrollWheelZoom:true}).setView([0, 0], );
    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {});
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
    //map.addLayer(satellite);
  console.log(this.ruta.Waypoint);    const url =this.ruta.Waypoint;
    this.http.get(url).subscribe((res:any)=>{
      var latlngs:any = [];
      res.features.forEach((element:any)=>{
        latlngs.push(L.latLng(element.geometry.coordinates[1],element.geometry.coordinates[0]))
      });
      var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
      map.fitBounds(polyline.getBounds());
      
      let myLayerOptions = {
        pointToLayer: createCustomIcon
      }
      L.geoJson(res,myLayerOptions).addTo(map);
    });

    const basicBeachIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/shacheeswadia/leaflet-map/main/beach-icon-chair.svg',
      iconSize: [40, 40],
    });

   /* const marker1 = L.marker([-37.699450, 176.279420], {icon: basicBeachIcon})
    .bindPopup('Whitehaven Beach, Whitsunday Island')
    .addTo(map);
const marker2 = L.marker([-27.643310, 153.305140], {icon: basicBeachIcon})
    .bindPopup('Turquoise Bay Exmouth, Australia')
    .addTo(map);
const marker3 = L.marker([-33.956330, 122.150270], {icon: basicBeachIcon})
    .bindPopup('Cape Le Grand National Park Esperance, Australia')
    .addTo(map);
const marker4 = L.marker([-34.962390, 117.391220], {icon: basicBeachIcon})
    .bindPopup('Greens Pool Denmark, Australia')
    .addTo(map);
const marker5 = L.marker([-17.961210, 122.214820], {icon: basicBeachIcon})
    .bindPopup('Cable Beach Broome, Australia')
    .addTo(map);
const marker6 = L.marker([-16.505960, 151.751520], {icon: basicBeachIcon})
    .bindPopup('Matira Beach, Society Islands')
    .addTo(map);
const marker7 = L.marker([-22.594400, 167.484440], {icon: basicBeachIcon})
    .bindPopup('Piscine Naturelle Ile Des Pins, New Caledonia')
    .addTo(map);
const marker8 = L.marker([-37.977000, 177.057000], {icon: basicBeachIcon})
    .bindPopup('Ohope Beach Whakatane, New Zealand')
    .addTo(map);
const marker9 = L.marker([-41.037600, 173.017000], {icon: basicBeachIcon})
    .bindPopup('Kaiteriteri Beach, New Zealand')
    .addTo(map);
const marker10 = L.marker([-37.670300, 176.212000], {icon: basicBeachIcon})
    .bindPopup('Mt Maunganui Main Beach, New Zealand')
    .addTo(map);
    var states = [{
      "type": "Feature",
      "properties": {"party": "Republican"},
      "geometry": {
          "type": "Polygon",
          "coordinates": [[
              [-104.05, 48.99],
              [-97.22,  48.98],
              [-96.58,  45.94],
              [-104.03, 45.94],
              [-104.05, 48.99]
          ]]
      }
  }, {
      "type": "Feature",
      "properties": {"party": "Democrat"},
      "geometry": {
          "type": "Polygon",
          "coordinates": [[
              [-109.05, 41.00],
              [-102.06, 40.99],
              [-102.03, 36.99],
              [-109.04, 36.99],
              [-109.05, 41.00]
          ]]
      }
  }];
    L.geoJSON(states, {
      style: function(feature:any) {
          switch (feature.properties.party) {
              case 'Republican': return {color: "#ff0000"};
              case 'Democrat':   return {color: "#0000ff"};
              default: return {color: "#0000ff"};
          }
      }
  }).addTo(map);
*/


  }
  constructor(private activateroute: ActivatedRoute,db:DBconectService,router:Router,http:HttpClient) { 
    this.eID=this.activateroute.snapshot.paramMap.get("id");
    this.db=db;
    this.router=router;
    this.http=http;
    
    Promise.resolve(db.ObtenerRuta(this.eID)).then(item => {
      setTimeout(() => {
        this.ruta=item;
        const map = L.map("map",{scrollWheelZoom:true}).setView([0, 0], 13);
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
          var polyline = L.polyline(latlngs, {color: '#ff8300'}).addTo(map);
          map.fitBounds(polyline.getBounds());
          
          let myLayerOptions = {
            pointToLayer: createCustomIcon
          }
          L.geoJson(res,myLayerOptions).addTo(map);
        });

        const basicBeachIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/shacheeswadia/leaflet-map/main/beach-icon-chair.svg',
          iconSize: [40, 40],
        });
        try {
          this.flowid=item.Flora[0].id;
          this.Image=item.Flora[0].Img;
          this.Imagelenght=Object.keys(this.Image).length;
          this.Description=item.Flora[0].Description;
          this.Name=item.Flora[0].Name;
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

  }

  ngOnInit(): void {}

  public showflower(item:Flor){
        this.actid=0;
        this.Image=item.Img;
        this.Imagelenght=Object.keys(this.Image).length;
        this.flowid=item.id;
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

  Deleteimage(){
    if(this.Image.length>1){
      Promise.resolve(this.db.Deleteimage(this.Image[this.actid].id,this.flowid,this.Name)).then(()=>{
        this.router.navigate(["/Route/"+this.eID]);
      });
    }
  }

  Deleteflor(){
    if(this.ruta.Flora.length>1){
      Promise.resolve(this.db.DeleteFlor(this.flowid,this.Name)).then(()=>{
        this.router.navigate(["/Route/"+this.eID]);
      });
    }
  }
}
