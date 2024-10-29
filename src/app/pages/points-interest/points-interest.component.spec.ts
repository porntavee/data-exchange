import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsInterestComponent } from './points-interest.component';

describe('PointsInterestComponent', () => {
  let component: PointsInterestComponent;
  let fixture: ComponentFixture<PointsInterestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsInterestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointsInterestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
