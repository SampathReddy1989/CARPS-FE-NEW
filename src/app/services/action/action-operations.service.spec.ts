import { TestBed } from '@angular/core/testing';

import { ActionOperationsService } from './action-operations.service';

describe('ActionOperationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionOperationsService = TestBed.get(ActionOperationsService);
    expect(service).toBeTruthy();
  });
});
