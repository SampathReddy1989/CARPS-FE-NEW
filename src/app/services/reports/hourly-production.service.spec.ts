import { TestBed } from '@angular/core/testing';

import { HourlyProductionService } from './hourly-production.service';

describe('HourlyProductionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HourlyProductionService = TestBed.get(HourlyProductionService);
    expect(service).toBeTruthy();
  });
});
