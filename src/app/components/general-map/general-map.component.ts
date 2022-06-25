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
flowertype:any="";
type:any="heat";
flowername:any="";
flowers:any=[];
  constructor(db:DBconectService,router:Router) { 
   this.db=db;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let map = L.map("map",{scrollWheelZoom:true,minZoom: 8}).setView([27.96, -15.6], 10);
    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"),
    satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    map.addLayer(satellite);
    var baseMaps = {
      "OpenStreetMap": osm,
      "Satélite": satellite,
    };
    L.control.layers(baseMaps,{}, {position: 'bottomleft'}).addTo(map);
    this.map=map;
    this.loaddata(map,this.type,this.flowertype,this.flowername);
  }
  loaddata(map:any,type:any,flowertype:any,flowername:any){
    this.flowers=[];
    Promise.resolve(this.db.getFlowers()).then(item=>{
      if(flowertype==""){
        this.flowers=item;
      }else{
        item.forEach((flor:any)=>{
          if(flor.Type==flowertype){
            this.flowers.push(flor);
          }
        })
      }
      Promise.resolve(this.db.ObtenerRutas("data")).then(rutas=>{
        let llatlngmark:any=[];
        rutas.forEach((ruta:any)=>{
        var basicBeachIcon = new L.Icon({ iconUrl: "https://firebasestorage.googleapis.com/v0/b/greenbook-f6fe4.appspot.com/o/Icons%2Fflowermarker.png?alt=media&token=5ee151d3-1bfe-41bf-9041-4c52b3194313", iconAnchor: new L.Point(19, 5),iconSize: [35, 50] ,scrollWheelZoom:'center' });
          let markerOptions = {
            clickable: false,
            icon: basicBeachIcon
          }
          let marker:any;
          if(ruta.Marks.length>0){
      
            for(marker of ruta.Marks){
              for(let flor of marker["Flor"]){
                let mark=L.marker(new L.LatLng(marker["Lat"], marker["Lng"]), markerOptions);
                this.flowers.forEach((item:any)=>{
                  if(flor.Flor==item.id){
                    if(item["Type"]==flowertype || flowertype==""){
                      if(type=="mark"){
                        if(flowername==""){
                          mark.bindPopup('<img src="'+flor.Img+'"> <div><strong>'+item["Name"]+'</strong> <br> '+item["Info"]+'</div>').openPopup();
                          mark.addTo(map);
                          mark.on('mouseover',function(ev:any) {
                            mark.openPopup();
                          });
                
                          mark.on('mouseout',function(ev:any) {
                            map.closePopup();
                          });
                
                          mark.on('click',()=> {
                            map.closePopup();
                            mark.openPopup();
                          });
                        }else if(item["Name"].includes(flowername)){
                          mark.bindPopup('<img src="'+flor.Img+'"> <div><strong>'+item["Name"]+'</strong> <br> '+item["Info"]+'</div>').openPopup();
                          mark.addTo(map);
                          mark.on('mouseover',function(ev:any) {
                            mark.openPopup();
                          });
                
                          mark.on('mouseout',function(ev:any) {
                            map.closePopup();
                          });
                
                          mark.on('click',()=> {
                            map.closePopup();
                            mark.openPopup();
                          });
                        }
                      }else if(type=="heat" && flowername == ""){
                        llatlngmark.push([marker["Lat"], marker["Lng"], 1000]);
                      }else if(type=="heat" && flowername != ""){
                        if(item["Name"].includes(flowername)){
                          llatlngmark.push([marker["Lat"], marker["Lng"], 1000]);
                        }
                      }
                    }
                  }
                
                })
              }
            }
          }
        });
        setTimeout(()=>{
          if(type=="heat"){
            const heatLayerConfig = {
              "radius": 15,
              "maxOpacity": 1,
              "scaleRadius": true,
              "useLocalExtrema": true,
              latField: 'lat',
              lngField: 'lng',
              valueField: 'count'
            };
    
            L.heatLayer(llatlngmark, heatLayerConfig).addTo(map);
          }
        },500)
      });
    });
  }

  changefiltro(){
    this.map.eachLayer((layer:any) => {
      layer.remove();
    });

    let satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}");
    this.map.addLayer(satellite);
    this.loaddata(this.map, this.type,this.flowertype,this.flowername);
  }
}
