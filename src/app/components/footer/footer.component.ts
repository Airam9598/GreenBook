import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
greeds:boolean=false;
  constructor() { }

  ngOnInit(): void {
  }

changeGreeds(){
  this.greeds=!this.greeds;
}
}
