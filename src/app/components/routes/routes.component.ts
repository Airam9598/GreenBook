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
        this.rutas=items;
      },500);
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
      this.rutasAlt.forEach(User=>{
          this.rutas.push(User);
      });
    }else{
      this.rutasAlt.forEach(User=>{
        if(User.Name.toLocaleLowerCase().includes(this.busqueda.toLocaleLowerCase())){
          this.rutas.push(User);
        }
      });
    }
  }

  Deleteroute(id:any){
    this.db.DeleteRuta(id).then(()=>{
      setTimeout(()=>{
        this.router.navigate(["/Routes/"]);
      },1000)
    });
  }

}
