import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopchartComponent } from '@app/pages/topchart/topchart.component';

describe('TopchartComponent', () => {
  let component: TopchartComponent;
  let fixture: ComponentFixture<TopchartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopchartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
