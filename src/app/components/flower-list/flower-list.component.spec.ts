import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowerListComponent } from './flower-list.component';

describe('FlowerListComponent', () => {
  let component: FlowerListComponent;
  let fixture: ComponentFixture<FlowerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlowerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
