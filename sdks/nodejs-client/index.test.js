import { AeraClient, BASE_URL, routes } from ".";

import axios from 'axios'

jest.mock('axios')

describe('Client', () => {
  let aeraClient
  beforeEach(() => {
    aeraClient = new AeraClient('test')
  })

  test('should create a client', () => {
    expect(aeraClient).toBeDefined();
  })
  // test updateApiKey
  test('should update the api key', () => {
    aeraClient.updateApiKey('test2');
    expect(aeraClient.apiKey).toBe('test2');
  })
});

describe('Send Requests', () => {
  let aeraClient

  beforeEach(() => {
    aeraClient = new AeraClient('test')
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should make a successful request to the application parameter', async () => {
    const method = 'GET'
    const endpoint = routes.application.url
    const expectedResponse = { data: 'response' }
    axios.mockResolvedValue(expectedResponse)

    await aeraClient.sendRequest(method, endpoint)

    expect(axios).toHaveBeenCalledWith({
      method,
      url: `${BASE_URL}${endpoint}`,
      params: null,
      headers: {
        Authorization: `Bearer ${aeraClient.apiKey}`,
        'Content-Type': 'application/json',
      },
      responseType: 'json',
    })

  })

  it('should handle errors from the API', async () => {
    const method = 'GET'
    const endpoint = '/test-endpoint'
    const errorMessage = 'Request failed with status code 404'
    axios.mockRejectedValue(new Error(errorMessage))

    await expect(aeraClient.sendRequest(method, endpoint)).rejects.toThrow(
      errorMessage
    )
  })
})