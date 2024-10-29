import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailysummaryComponent } from './dailysummary.component';

describe('DailysummaryComponent', () => {
  let component: DailysummaryComponent;
  let fixture: ComponentFixture<DailysummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailysummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailysummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
