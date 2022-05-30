import { Component, OnInit } from '@angular/core';
import { Ruta } from 'src/app/services/Ruta';
import { DBconectService } from 'src/app/services/dbconect.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {
  ruta:any;
  db:any;
  rutas:Array<Ruta> = [];
  constructor(db:DBconectService) { 
    this.db=db;
    Promise.resolve(db.ObtenerRutas()).then(items=>{
      setTimeout(() => {
        this.rutas=items;
        },500);
    });
  }

  ngOnInit(): void {
   // console.log(this.rutas);
  }

}
