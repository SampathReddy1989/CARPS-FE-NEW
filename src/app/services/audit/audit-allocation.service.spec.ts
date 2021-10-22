import { TestBed } from '@angular/core/testing';

import { AuditAllocationService } from './audit-allocation.service';

describe('AuditAllocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditAllocationService = TestBed.get(AuditAllocationService);
    expect(service).toBeTruthy();
  });
});
