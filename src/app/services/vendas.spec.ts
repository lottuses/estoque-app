import { TestBed } from '@angular/core/testing';

import { Vendas } from './vendas.service';

describe('Vendas', () => {
  let service: Vendas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Vendas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
