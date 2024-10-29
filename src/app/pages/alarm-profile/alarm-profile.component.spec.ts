import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmProfileComponent } from './alarm-profile.component';

describe('AlarmProfileComponent', () => {
  let component: AlarmProfileComponent;
  let fixture: ComponentFixture<AlarmProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
