import { renderHook, waitFor } from '@testing-library/react';
import { useLogs } from './useLogs';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useLogStore
vi.mock('@/store/logStore', () => ({
  useLogStore: () => ({
    filters: {
      dateRange: 'Last 7 days',
      status: undefined,
      search: '',
    },
  }),
}));

describe('useLogs', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches logs successfully', async () => {
    const mockData = {
      data: [{ id: '1' }],
      total: 1,
      page: 1,
      pageSize: 20,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useLogs());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.logs).toEqual(mockData.data);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch logs');
  });
});
