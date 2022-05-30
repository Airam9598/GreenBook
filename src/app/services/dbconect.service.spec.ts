import { TestBed } from '@angular/core/testing';

import { DBconectService } from './dbconect.service';

describe('DBconectService', () => {
  let service: DBconectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DBconectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
