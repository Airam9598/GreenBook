import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewImageflowerComponent } from './new-imageflower.component';

describe('NewImageflowerComponent', () => {
  let component: NewImageflowerComponent;
  let fixture: ComponentFixture<NewImageflowerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewImageflowerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewImageflowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
