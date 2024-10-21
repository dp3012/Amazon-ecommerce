import {formatCurrency} from '../scripts/utils/money.js';

describe('test suite: formatCurrency', () => {  // func to make test-suite
  it('convert cents into dollars', () => { // func to make a test
    expect(formatCurrency(2095)).toEqual('20.95') //if-else checking part in better manner
  });

  it('works with 0', () => {
    expect(formatCurrency(0)).toEqual('0.00');
  });
  
  it('rounds up to nearest cent', () => {
    expect(formatCurrency(2000.5)).toEqual('20.01');
  });
});