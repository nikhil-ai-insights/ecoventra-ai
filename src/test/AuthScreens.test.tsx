/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AuthScreens from '../components/AuthScreens';

const mockLogin = vi.fn();

// Mock useApp hook from AppContext
vi.mock('../components/AppContext', () => ({
  useApp: () => ({
    login: mockLogin,
  }),
}));

describe('AuthScreens Component', () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it('renders login header and form fields by default', () => {
    const onSuccess = vi.fn();
    render(<AuthScreens onSuccess={onSuccess} />);
    
    expect(screen.getByText(/Welcome Back to Ecoventra/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Password/i)).toBeInTheDocument();
  });

  it('allows toggling between Login and Registration views', () => {
    const onSuccess = vi.fn();
    render(<AuthScreens onSuccess={onSuccess} />);
    
    const toggleBtn = screen.getByRole('button', { name: /Don't have an account\? Sign up/i });
    fireEvent.click(toggleBtn);
    
    expect(screen.getByText(/Register Carbon Account/i)).toBeInTheDocument();
    
    const toggleBackBtn = screen.getByRole('button', { name: /Already have an account\? Login/i });
    fireEvent.click(toggleBackBtn);
    expect(screen.getByText(/Welcome Back to Ecoventra/i)).toBeInTheDocument();
  });

  it('submits form and triggers login context function', () => {
    const onSuccess = vi.fn();
    render(<AuthScreens onSuccess={onSuccess} />);
    
    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'homeworkout169@gmail.com' } });
    
    const submitBtn = screen.getByRole('button', { name: /Login to Profile/i });
    fireEvent.click(submitBtn);
    
    expect(mockLogin).toHaveBeenCalledWith('homeworkout169@gmail.com', 'user');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('switches simulated role to system admin', () => {
    const onSuccess = vi.fn();
    render(<AuthScreens onSuccess={onSuccess} />);
    
    const adminBtn = screen.getByRole('button', { name: /System Admin/i });
    fireEvent.click(adminBtn);
    
    const submitBtn = screen.getByRole('button', { name: /Login to Profile/i });
    fireEvent.click(submitBtn);
    
    expect(mockLogin).toHaveBeenCalledWith('homeworkout169@gmail.com', 'admin');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
