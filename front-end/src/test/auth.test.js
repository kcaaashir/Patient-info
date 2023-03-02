import { getHeaders } from '../config/auth';

describe('getHeaders', () => {
  it('returns headers with Authorization and Content-Type JSON when json parameter is true', () => {
    const expectedHeaders = {
      headers: {
        'Authorization': expect.stringContaining('Bearer'),
        'Content-Type': 'application/json',
      }
    };
    const headers = getHeaders(true);
    expect(headers).toEqual(expectedHeaders);
  });

  it('returns headers with Authorization and Content-Type multipart/form-data when json parameter is false', () => {
    const expectedHeaders = {
      headers: {
        'Authorization': expect.stringContaining('Bearer'),
        'Content-Type': 'multipart/form-data',
      }
    };
    const headers = getHeaders(false);
    expect(headers).toEqual(expectedHeaders);
  });
});