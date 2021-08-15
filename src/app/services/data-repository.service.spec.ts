import { TestBed } from '@angular/core/testing';

import { DataRepositoryService } from './data-repository.service';

describe('DataRepositoryService', () => {
  let service: DataRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
