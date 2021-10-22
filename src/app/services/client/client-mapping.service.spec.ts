import { TestBed } from '@angular/core/testing';

import { ClientMappingService } from './client-mapping.service';

describe('ClientMappingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientMappingService = TestBed.get(ClientMappingService);
    expect(service).toBeTruthy();
  });
});
