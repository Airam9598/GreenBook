import { Component, OnInit } from '@angular/core';
import { Ruta } from 'src/app/services/Ruta';
import { DBconectService } from 'src/app/services/dbconect.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  ruta:any;
  db:any;
  rutas:Array<Ruta> = [];
  rutasAlt:Array<Ruta> = [];
  busqueda:string="";
  UserId:any;
  Useradmin!:any;
  router!:Router;
  constructor(db:DBconectService,router:Router) { 
    this.db=db;
    this.router=router;
    Promise.resolve(db.ObtenerRutas()).then(items=>{
      setTimeout(() => {
        items.forEach(data=>{ this.rutasAlt.push(data); });
        items.forEach(data=>{ this.rutas.push(data); });
      },100);
    });
    if(this.UserId ==null){
      if(db.getToken() !=""){
        Promise.resolve(db.GetUser(db.getToken())).then(item=>{
          if(item !=null){
            this.Useradmin=item["Admin"];
            this.UserId=item["Email"];
          }
        });
      }
    }
  }

  ngOnInit(): void {
   // console.log(this.rutas);
  }

  Discover(){
    this.rutas=[];
    if(this.busqueda==""){
      this.rutasAlt.forEach(ruta=>{
          this.rutas.push(ruta);
      });
    }else{
      this.rutasAlt.forEach(ruta=>{
        if(ruta.Name.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase())){
          this.rutas.push(ruta);
        }
      });
    }
  }

  Deleteroute(id:any){
    this.db.DeleteRuta(id).then(()=>{
      setTimeout(()=>{
        this.reloadComponent();
      },1000)
    });
  }

  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }

}
