import { TestBed } from '@angular/core/testing';

import { BackendApiService } from './backend-api.service';

describe('MockBackendService', () => {
  let service: BackendApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
