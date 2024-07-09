import { TestBed } from '@angular/core/testing';

import { CognitoServiceService } from './cognito-service.service';

describe('CognitoServiceService', () => {
  let service: CognitoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
