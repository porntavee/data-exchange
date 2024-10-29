import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagedeviceauthenComponent } from './managedeviceauthen.component';

describe('ManagedeviceauthenComponent', () => {
  let component: ManagedeviceauthenComponent;
  let fixture: ComponentFixture<ManagedeviceauthenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagedeviceauthenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagedeviceauthenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
