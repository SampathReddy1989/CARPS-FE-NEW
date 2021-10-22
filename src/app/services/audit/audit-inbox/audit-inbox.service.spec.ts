import { TestBed } from '@angular/core/testing';

import { AuditInboxService } from './audit-inbox.service';

describe('AuditInboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuditInboxService = TestBed.get(AuditInboxService);
    expect(service).toBeTruthy();
  });
});
