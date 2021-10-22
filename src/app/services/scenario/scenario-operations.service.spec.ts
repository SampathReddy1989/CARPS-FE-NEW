import { TestBed } from '@angular/core/testing';

import { ScenarioOperationsService } from './scenario-operations.service';

describe('ScenarioOperationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScenarioOperationsService = TestBed.get(ScenarioOperationsService);
    expect(service).toBeTruthy();
  });
});
