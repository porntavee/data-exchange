import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnpmProfileComponent } from './snpm-profile.component';

describe('SnpmProfileComponent', () => {
  let component: SnpmProfileComponent;
  let fixture: ComponentFixture<SnpmProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SnpmProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnpmProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
