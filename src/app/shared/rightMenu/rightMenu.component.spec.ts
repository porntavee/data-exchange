import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RightMenuComponent } from './rightMenu.component';

describe('RightMenuComponent', () => {
  let component: RightMenuComponent;
  let fixture: ComponentFixture<RightMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RightMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RightMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
