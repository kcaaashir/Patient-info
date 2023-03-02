import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SignOut from '../Components/sign-out';

describe('SignOut component', () => {
  it('should remove token from localStorage and redirect to home page', () => {
    localStorage.setItem('token', 'abc123');
    const { getByTestId } = render(<SignOut />);
    expect(localStorage.getItem('token')).toBeNull();
    expect(window.location.href).toEqual('http://localhost/');
  });
});