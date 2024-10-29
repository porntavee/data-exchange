import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatidHistoryComponent } from './catid-history.component';

describe('CatidHistoryComponent', () => {
  let component: CatidHistoryComponent;
  let fixture: ComponentFixture<CatidHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatidHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatidHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
