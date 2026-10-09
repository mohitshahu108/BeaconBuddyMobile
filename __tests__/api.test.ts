import { API_CONFIG } from '../config/api';
import { apiService } from '../services/api';

describe('apiService.getBeacons', () => {
  const fetchMock = jest.spyOn(globalThis, 'fetch');

  beforeEach(() => {
    apiService.clearToken();
    fetchMock.mockReset();
  });

  afterAll(() => {
    apiService.clearToken();
    fetchMock.mockRestore();
  });

  it('requests the public feed without requiring an auth token', async () => {
    const beacons = [{ id: 1, title: 'Cricket meetup' }];
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => beacons,
    } as Response);

    await expect(apiService.getBeacons()).resolves.toEqual(beacons);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/beacons`,
      expect.objectContaining({
        headers: { 'Content-Type': 'application/json' },
      }),
    );
  });

  it('uses the shared auth token when one is available', async () => {
    apiService.setToken('session-token');
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await expect(apiService.getBeacons()).resolves.toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/beacons`,
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: expect.stringContaining('session-token'),
        }),
      }),
    );
  });

  it('throws the API error message for a failed response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'Unavailable' } }),
    } as Response);

    await expect(apiService.getBeacons()).rejects.toThrow('Unavailable');
  });
});
