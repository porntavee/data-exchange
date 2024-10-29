import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedeviceprofileComponent } from './managedeviceprofile.component';

describe('ManagedeviceprofileComponent', () => {
  let component: ManagedeviceprofileComponent;
  let fixture: ComponentFixture<ManagedeviceprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedeviceprofileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedeviceprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
