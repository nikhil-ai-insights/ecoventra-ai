/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Layout from '../components/Layout';

const mockLogout = vi.fn();
const mockToggleTheme = vi.fn();

vi.mock('../components/AppContext', () => ({
  useApp: () => ({
    user: {
      displayName: 'Jane Doe',
      email: 'jane@example.com',
      ecoPoints: 1250,
      level: 2,
      role: 'user',
    },
    logout: mockLogout,
  }),
}));

vi.mock('../components/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: mockToggleTheme,
  }),
}));

describe('Layout Component', () => {
  beforeEach(() => {
    mockLogout.mockClear();
    mockToggleTheme.mockClear();
  });

  it('renders skip-to-content links and children content', () => {
    const onTabChange = vi.fn();
    render(
      <Layout currentTab="dashboard" onTabChange={onTabChange}>
        <div data-testid="child-element">My Dashboard View</div>
      </Layout>
    );

    expect(screen.getByText(/Skip to main content/i)).toBeInTheDocument();
    expect(screen.getByTestId('child-element')).toBeInTheDocument();
  });

  it('renders user details and eco points metrics', () => {
    const onTabChange = vi.fn();
    render(
      <Layout currentTab="dashboard" onTabChange={onTabChange}>
        <div>Main Content</div>
      </Layout>
    );

    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    expect(screen.getAllByText(/LVL 2/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/1250/i)[0]).toBeInTheDocument();
  });

  it('handles navigation tab changes on sidebar clicked', () => {
    const onTabChange = vi.fn();
    render(
      <Layout currentTab="dashboard" onTabChange={onTabChange}>
        <div>Main Content</div>
      </Layout>
    );

    const calcNavBtn = screen.getAllByText(/Carbon Calculator/i)[0]; // desktop sidebar list
    fireEvent.click(calcNavBtn);
    expect(onTabChange).toHaveBeenCalledWith('calculator');
  });

  it('triggers theme toggler correctly', () => {
    const onTabChange = vi.fn();
    render(
      <Layout currentTab="dashboard" onTabChange={onTabChange}>
        <div>Main Content</div>
      </Layout>
    );

    const themeToggleBtn = screen.getByLabelText(/Toggle Theme/i);
    fireEvent.click(themeToggleBtn);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('calls logout context callback and routes to landing', () => {
    const onTabChange = vi.fn();
    render(
      <Layout currentTab="dashboard" onTabChange={onTabChange}>
        <div>Main Content</div>
      </Layout>
    );

    const logoutBtn = screen.getAllByText(/Log Out/i)[0];
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(onTabChange).toHaveBeenCalledWith('landing');
  });
});
