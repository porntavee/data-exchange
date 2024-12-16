import { TestBed } from '@angular/core/testing';

import { RequestmanagerService } from './requestmanager.service';

describe('RequestmanagerService', () => {
  let service: RequestmanagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestmanagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
