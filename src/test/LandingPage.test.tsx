/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LandingPage from '../components/LandingPage';

// Simple mock for Lucide icons inside tests
vi.mock('lucide-react', async () => {
  const actual = await vi.importActual('lucide-react');
  return {
    ...actual,
    Sparkles: () => <span data-testid="sparkles-icon">Sparkles</span>,
    Globe: () => <span data-testid="globe-icon">Globe</span>,
  };
});

describe('LandingPage Component', () => {
  it('renders landing page hero texts and tagline', () => {
    const onLoginClick = vi.fn();
    const onTryDemo = vi.fn();
    render(<LandingPage onLoginClick={onLoginClick} onTryDemo={onTryDemo} />);
    
    expect(screen.getByText(/Know Your Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/AI climate-tech is here/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Started Free/i)).toBeInTheDocument();
  });

  it('triggers onLoginClick when Get Started is activated', () => {
    const onLoginClick = vi.fn();
    const onTryDemo = vi.fn();
    render(<LandingPage onLoginClick={onLoginClick} onTryDemo={onTryDemo} />);
    
    const getStartedBtn = screen.getByRole('button', { name: /Get Started Free/i });
    fireEvent.click(getStartedBtn);
    expect(onLoginClick).toHaveBeenCalledTimes(1);
  });

  it('triggers onTryDemo when Try Demo Account is clicked', () => {
    const onLoginClick = vi.fn();
    const onTryDemo = vi.fn();
    render(<LandingPage onLoginClick={onLoginClick} onTryDemo={onTryDemo} />);
    
    const demoBtn = screen.getByRole('button', { name: /Try Demo Account/i });
    fireEvent.click(demoBtn);
    expect(onTryDemo).toHaveBeenCalledTimes(1);
  });
});
