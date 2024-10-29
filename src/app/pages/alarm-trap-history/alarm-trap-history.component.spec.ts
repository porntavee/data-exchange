import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmTrapHistoryComponent } from './alarm-trap-history.component';

describe('AlarmTrapHistoryComponent', () => {
  let component: AlarmTrapHistoryComponent;
  let fixture: ComponentFixture<AlarmTrapHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlarmTrapHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmTrapHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
