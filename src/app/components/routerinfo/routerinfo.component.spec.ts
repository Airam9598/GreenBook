import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterinfoComponent } from './routerinfo.component';

describe('RouterinfoComponent', () => {
  let component: RouterinfoComponent;
  let fixture: ComponentFixture<RouterinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouterinfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
