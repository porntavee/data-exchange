import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZtpComponent } from './ztp.component';

describe('ZtpComponent', () => {
  let component: ZtpComponent;
  let fixture: ComponentFixture<ZtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
