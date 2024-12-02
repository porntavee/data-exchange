import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStatusHeaderComponent } from './service-status-header.component';

describe('ServiceStatusHeaderComponent', () => {
  let component: ServiceStatusHeaderComponent;
  let fixture: ComponentFixture<ServiceStatusHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceStatusHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStatusHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
