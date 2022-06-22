import { Component, DoBootstrap, OnInit,AfterViewInit } from '@angular/core';
import { DBconectService } from 'src/app/services/dbconect.service';
import 'leaflet-routing-machine';
declare let L:any;
import { Ruta } from 'src/app/services/Ruta';
import { Router } from '@angular/router';
@Component({
  selector: 'app-general-map',
  templateUrl: './general-map.component.html',
  styleUrls: ['./general-map.component.css']
})
export class GeneralMapComponent implements OnInit,AfterViewInit {
ruta=new Ruta("","");
map:any;
db:any;
username!:string;
  constructor(db:DBconectService,router:Router) { 
   this.db=db;

    if(this.db.getToken()!=""){
      Promise.resolve(this.db.GetUser(this.db.getToken())).then(item=>{
        if(item ==null){
          this.db.deleteToken();
          router.navigate(["/Login"]);
        }else{
          this.username=item["UserName"];
        }
      })
    }else{
      router.navigate(["/Login"]);
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    const map = L.map("map",{scrollWheelZoom:true}).setView([27.96, -15.6], 10);
    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    map.addLayer(satellite);
    var baseMaps = {
      "OpenStreetMap": osm,
      "Satélite": satellite,
    };
    L.control.layers(baseMaps,{}, {position: 'bottomleft'}).addTo(map);

    Promise.resolve(this.db.ObtenerRutas("data")).then(rutas=>{
      rutas.forEach((ruta:any)=>{
        var pinAnchor = new L.Point(23, 47);
      var basicBeachIcon = new L.Icon({ iconUrl: "https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Icons%2Fflowermarker.png?alt=media&token=5ee151d3-1bfe-41bf-9041-4c52b3194313", iconAnchor: pinAnchor,iconSize: [35, 50] ,scrollWheelZoom:'center' });
        /*const basicBeachIcon = L.icon({
          iconUrl: 'https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Icons%2Fflowermarker.png?alt=media&token=5ee151d3-1bfe-41bf-9041-4c52b3194313',
          iconSize: [35, 50],
        });*/
        let markerOptions = {
          clickable: false,
          icon: basicBeachIcon
        }
        let marker:any;
        if(ruta.Marks.length>0){
    
          for(marker of ruta.Marks){
            for(let flor of marker["Flor"]){
              let mark=L.marker(new L.LatLng(marker["Lat"], marker["Lng"]), markerOptions);
              Promise.resolve(this.db.GetFlowerData(flor["Flor"])).then(item=>{
                mark.bindPopup('<img src="'+flor.Img+'"> '+item["Info"]).openPopup();
                mark.addTo(map);
                mark.on('mouseover',function(ev:any) {
                  mark.openPopup();
                });
      
                mark.on('mouseout',function(ev:any) {
                  map.closePopup();
                });
      
                mark.on('click',()=> {
                });
              })
            }
          }
        }
      })
    });
  }

}
