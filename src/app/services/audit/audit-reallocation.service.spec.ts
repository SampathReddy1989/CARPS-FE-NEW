import { TestBed } from '@angular/core/testing';

import { AuditReallocationService } from './audit-reallocation.service';

describe('AuditReallocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditReallocationService = TestBed.get(AuditReallocationService);
    expect(service).toBeTruthy();
  });
});
