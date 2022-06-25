import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { Inject }  from '@angular/core';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
app:any;
show=false;
constructor(@Inject(DOCUMENT) document: Document,app:AppComponent) {
  this.app=app;
}

  ngOnInit(): void {
  }
  showmenu(){
    this.show=!this.show;
  }
  
}
