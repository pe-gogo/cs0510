import request from 'sync-request';
import app from '../server'; // Assuming your server is exported as an Express app

import { describe } from 'jest';

describe('HTTP tests using sync-request', () => {
  test('Test /api/sum', () => {
    const response = request('GET', 'http://localhost:3000/api/sum?num1=5&num2=10');
    const responseBody = JSON.parse(response.getBody('utf-8'));

    expect(response.statusCode).toBe(200);
    expect(responseBody.result).toBe(15);
  });

  // Other test cases...
});
