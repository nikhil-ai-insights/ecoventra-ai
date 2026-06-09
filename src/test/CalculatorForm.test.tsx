/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CalculatorForm from '../components/CalculatorForm';

const mockAddCalculation = vi.fn();

vi.mock('../components/AppContext', () => ({
  useApp: () => ({
    addCalculation: mockAddCalculation,
  }),
}));

describe('CalculatorForm Component', () => {
  beforeEach(() => {
    mockAddCalculation.mockClear();
  });

  it('renders step 1 inputs for logistics and transport', () => {
    const onSuccess = vi.fn();
    render(<CalculatorForm onSuccess={onSuccess} />);

    expect(screen.getByText(/Transportation Log/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Car Driving/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cycling/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Public Transit/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aviation/i)).toBeInTheDocument();
  });

  it('navigates through multi-step screens securely', async () => {
    const onSuccess = vi.fn();
    render(<CalculatorForm onSuccess={onSuccess} />);

    // Step 1 check
    expect(screen.queryByLabelText(/Electricity Consumption/i)).not.toBeInTheDocument();
    
    // Move to step 2
    const nextBtn = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText(/Household Energy Scope/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Electricity Consumption/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Air-conditioning active/i)).toBeInTheDocument();

    // Back button works
    const backBtn = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backBtn);
    expect(screen.getByText(/Transportation Log/i)).toBeInTheDocument();
  });

  it('performs total calculation logic on submit form', async () => {
    const onSuccess = vi.fn();
    render(<CalculatorForm onSuccess={onSuccess} />);

    // Fill Step 1
    fireEvent.change(screen.getByLabelText(/Car Driving/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Cycling/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Fill Step 2
    fireEvent.change(screen.getByLabelText(/Electricity Consumption/i), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Diet
    expect(screen.getByText(/Planetary Diet Choice/i)).toBeInTheDocument();
    const veganBtn = screen.getByRole('button', { name: /Pure Vegan/i });
    fireEvent.click(veganBtn);
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 4: Shopping
    expect(screen.getByText(/Consumption Audit/i)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Online deliveries/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Clothing acquisitions/i), { target: { value: '1' } });

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Save & Calculate/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockAddCalculation).toHaveBeenCalledTimes(1);
    });
    
    const callArgs = mockAddCalculation.mock.calls[0][0];
    expect(callArgs.totalEmissions).toBeGreaterThan(0);
    expect(callArgs.carbonScore).toBeGreaterThanOrEqual(10);
    expect(callArgs.carbonScore).toBeLessThanOrEqual(100);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});
