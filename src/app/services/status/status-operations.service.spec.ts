import { TestBed } from '@angular/core/testing';

import { StatusOperationsService } from './status-operations.service';

describe('StatusOperationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatusOperationsService = TestBed.get(StatusOperationsService);
    expect(service).toBeTruthy();
  });
});
