import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedeviceotherComponent } from './managedeviceother.component';

describe('ManagedeviceotherComponent', () => {
  let component: ManagedeviceotherComponent;
  let fixture: ComponentFixture<ManagedeviceotherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedeviceotherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedeviceotherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
