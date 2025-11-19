import React from 'react';
import { render, screen } from '@testing-library/react';
import { LogList } from './LogList';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock useLogs hook
const mockUseLogs = vi.fn();
vi.mock('@/hooks/useLogs', () => ({
  useLogs: () => mockUseLogs(),
}));

// Mock LogItem component to simplify testing
vi.mock('./LogItem', () => ({
  LogItem: ({ log }: any) => <tr data-testid="log-item">{log.id}</tr>,
}));

describe('LogList', () => {
  beforeEach(() => {
    mockUseLogs.mockReset();
  });

  it('renders loading state', () => {
    mockUseLogs.mockReturnValue({
      logs: [],
      loading: true,
      error: null,
    });

    render(<LogList />);
    expect(screen.queryByText(/No logs found/i)).not.toBeInTheDocument();
    // Actually my implementation shows a loader.
    // Let's check for the loader or just check that it doesn't show the table.
    // The loader has no text, but I can check for the class or just snapshot?
    // Or I can check that "Start Time" is not there?
    // Wait, my implementation returns early if loading && logs.length === 0.
    // So "Start Time" should not be there.
    expect(screen.queryByText('Start Time ↓')).not.toBeInTheDocument();
  });

  it('renders error state', () => {
    mockUseLogs.mockReturnValue({
      logs: [],
      loading: false,
      error: 'Failed to fetch',
    });

    render(<LogList />);
    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
  });

  it('renders logs', () => {
    const logs = [
      { id: '1', startTime: '2023-01-01', status: 'SUCCESS', runTime: 1, tokens: 100 },
      { id: '2', startTime: '2023-01-02', status: 'FAILURE', runTime: 2, tokens: 200 },
    ];

    mockUseLogs.mockReturnValue({
      logs,
      loading: false,
      error: null,
    });

    render(<LogList />);
    expect(screen.getAllByTestId('log-item')).toHaveLength(2);
  });

  it('renders empty state', () => {
    mockUseLogs.mockReturnValue({
      logs: [],
      loading: false,
      error: null,
    });

    render(<LogList />);
    expect(screen.getByText('No logs found')).toBeInTheDocument();
  });
});
