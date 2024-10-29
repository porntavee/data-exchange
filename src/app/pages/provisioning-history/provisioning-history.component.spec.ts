import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisioningHistoryComponent } from '@app/pages/provisioning-history/provisioning-history.component';

describe('ProvisioningHistoryComponent', () => {
  let component: ProvisioningHistoryComponent;
  let fixture: ComponentFixture<ProvisioningHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvisioningHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisioningHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
