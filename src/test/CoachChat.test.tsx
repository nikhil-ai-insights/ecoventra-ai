/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import CoachChat from '../components/CoachChat';

vi.mock('../components/AppContext', () => ({
  useApp: () => ({
    user: { displayName: 'Jane Doe' },
    calculations: [
      {
        carbonScore: 82,
        totalEmissions: 340,
        inputs: { dietType: 'vegan' }
      }
    ]
  })
}));

describe('CoachChat Component', () => {
  beforeEach(() => {
    // Mock general window scroll methods so they do not error in DOM environments
    Element.prototype.scrollIntoView = vi.fn();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial welcoming message and suggested prompts', () => {
    render(<CoachChat />);
    
    expect(screen.getByText(/personal/i)).toBeInTheDocument();
    expect(screen.getByText(/Ecoventra Coach/i)).toBeInTheDocument();
    expect(screen.getByText(/Suggested prompts/i)).toBeInTheDocument();
    expect(screen.getByText(/Show me 5 rapid actions/i)).toBeInTheDocument();
  });

  it('sends suggestions directly when chip button is clicked', async () => {
    const fetchMock = vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "To optimize transport driving 15 km, use electric trains or carpool!" })
    } as Response);

    render(<CoachChat />);

    const suggestionBtn = screen.getByText(/I drive 15 km daily to work. How do I optimize\?/i);
    fireEvent.click(suggestionBtn);

    // Verify user message loaded
    expect(screen.getByText(/I drive 15 km daily to work. How do I optimize\?/i)).toBeInTheDocument();

    // Verify fetch triggering
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Check AI reply displays
    await waitFor(() => {
      expect(screen.getByText(/To optimize transport driving 15 km/i)).toBeInTheDocument();
    });
  });

  it('handles standard input message and mock API response successfully', async () => {
    const fetchMock = vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ text: "Standard carbon offsets neutralise emissions by financing reforestation." })
    } as Response);

    render(<CoachChat />);

    const inputField = screen.getByLabelText(/Ask your sustainability coach/i);
    fireEvent.change(inputField, { target: { value: 'How do offsets work?' } });
    
    const sendBtn = screen.getByLabelText(/Send message to AI Coach/i);
    fireEvent.click(sendBtn);

    expect(screen.getByText(/How do offsets work\?/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText(/Standard carbon offsets neutralise/i)).toBeInTheDocument();
    });
  });

  it('handles server network failure gracefully by showing offline instructions', async () => {
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network Error"));

    render(<CoachChat />);

    const inputField = screen.getByLabelText(/Ask your sustainability coach/i);
    fireEvent.change(inputField, { target: { value: 'Error trigger?' } });
    
    const sendBtn = screen.getByLabelText(/Send message to AI Coach/i);
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/My server is currently offline or the request expired/i)).toBeInTheDocument();
    });
  });
});
