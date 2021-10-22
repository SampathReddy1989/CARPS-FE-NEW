import { TestBed } from '@angular/core/testing';

import { AgentReallocationService } from './agent-reallocation.service';

describe('AgentReallocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AgentReallocationService = TestBed.get(AgentReallocationService);
    expect(service).toBeTruthy();
  });
});
