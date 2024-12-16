import { TestBed } from '@angular/core/testing';

import { DApiUseService } from './d-api-use.service';

describe('DApiUseService', () => {
  let service: DApiUseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DApiUseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
