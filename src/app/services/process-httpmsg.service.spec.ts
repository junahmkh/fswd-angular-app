import { TestBed } from '@angular/core/testing';

import { ProcessHTTPMsgService } from './process-httpmsg.service';

describe('HTTPMsgService', () => {
  let service: ProcessHTTPMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessHTTPMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
