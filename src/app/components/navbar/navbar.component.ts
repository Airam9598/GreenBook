import { Component, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
import { Inject }  from '@angular/core';


@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
show:boolean=true;
constructor(@Inject(DOCUMENT) document: Document) {
    if(document.getElementById('menu')!=null){
      this.show=false;
    }else{
      this.show=true;
    }
}

  ngOnInit(): void {
  }
  showmenu(){
    this.show=!this.show;
  }
  
}
