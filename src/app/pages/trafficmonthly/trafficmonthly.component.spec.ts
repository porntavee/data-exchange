import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficmonthlyComponent } from './trafficmonthly.component';

describe('TrafficmonthlyComponent', () => {
  let component: TrafficmonthlyComponent;
  let fixture: ComponentFixture<TrafficmonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficmonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrafficmonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
