import { TestBed } from '@angular/core/testing';

import { AgentInboxService } from './agent-inbox.service';

describe('AgentInboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentInboxService = TestBed.get(AgentInboxService);
    expect(service).toBeTruthy();
  });
});
