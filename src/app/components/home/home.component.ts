import { Component, OnInit } from '@angular/core';
import { DBconectService } from 'src/app/services/dbconect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
db:DBconectService;
  constructor(db:DBconectService) {
    this.db=db;
   }

  ngOnInit(): void {
    this.db.ObtenerRutas();
  }

}
