import { TestBed } from '@angular/core/testing';

import { ProvisioningHistoryService } from '@app/pages/provisioning-history/provisioning-history.service';

describe('ProvisioningHistoryService', () => {
  let service: ProvisioningHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProvisioningHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
