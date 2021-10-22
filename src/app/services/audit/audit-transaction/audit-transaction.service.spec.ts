import { TestBed } from '@angular/core/testing';

import { AuditTransactionService } from './audit-transaction.service';

describe('AuditTransactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditTransactionService = TestBed.get(AuditTransactionService);
    expect(service).toBeTruthy();
  });
});
