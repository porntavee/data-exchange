import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlatmhistoryComponent } from './alatmhistory.component';

describe('AlatmhistoryComponent', () => {
  let component: AlatmhistoryComponent;
  let fixture: ComponentFixture<AlatmhistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlatmhistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlatmhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
