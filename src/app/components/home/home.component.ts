import { Component, OnInit } from '@angular/core';
import { DBconectService } from 'src/app/services/dbconect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
db:DBconectService;
rutas:any=[];
  constructor(db:DBconectService) {
    this.db=db;
    Promise.resolve(db.ObtenerRutas()).then(items=>{
      setTimeout(() => {
        this.rutas=items;
        this.rutas=this.rutas.sort((a:any, b:any) => b.Fecha.seconds - a.Fecha.seconds);
      },100);
    });
   }

  ngOnInit(): void {
  }

}
