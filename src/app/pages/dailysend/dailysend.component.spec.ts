import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailysendComponent } from '@app/pages/dailysend/dailysend.component';

describe('DailysendComponent', () => {
  let component: DailysendComponent;
  let fixture: ComponentFixture<DailysendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailysendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailysendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
