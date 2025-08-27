import { AuthStorage } from './authStorage'

// Mock localStorage and sessionStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
  writable: true,
})

describe('AuthStorage', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    
    // Clear storage
    AuthStorage.clearAuthData()
  })

  describe('saveAuthData', () => {
    it('should save data to localStorage when rememberMe is true', () => {
      const testData = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userData: { id: '1', email: 'test@example.com' },
        tokenExpiry: Date.now() + 3600000,
        rememberMe: true,
      }

      AuthStorage.saveAuthData(testData)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('accessToken', testData.accessToken)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refreshToken', testData.refreshToken)
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(testData.userData))
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('tokenExpiry', testData.tokenExpiry.toString())
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('rememberMe', 'true')
    })

    it('should save data to sessionStorage when rememberMe is false', () => {
      const testData = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userData: { id: '1', email: 'test@example.com' },
        tokenExpiry: Date.now() + 3600000,
        rememberMe: false,
      }

      AuthStorage.saveAuthData(testData)

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('accessToken', testData.accessToken)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('refreshToken', testData.refreshToken)
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(testData.userData))
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith('tokenExpiry', testData.tokenExpiry.toString())
    })
  })

  describe('getAuthData', () => {
    it('should return null when no data is stored', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      mockSessionStorage.getItem.mockReturnValue(null)

      const result = AuthStorage.getAuthData()
      expect(result).toBeNull()
    })

    it('should return data from localStorage when available', () => {
      const testData = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userData: { id: '1', email: 'test@example.com' },
        tokenExpiry: Date.now() + 3600000,
        rememberMe: true,
      }

      mockLocalStorage.getItem
        .mockReturnValueOnce(testData.accessToken)
        .mockReturnValueOnce(testData.refreshToken)
        .mockReturnValueOnce(JSON.stringify(testData.userData))
        .mockReturnValueOnce(testData.tokenExpiry.toString())

      const result = AuthStorage.getAuthData()
      
      expect(result).toEqual({
        ...testData,
        tokenExpiry: testData.tokenExpiry,
      })
    })

    it('should return data from sessionStorage when localStorage is empty', () => {
      const testData = {
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        userData: { id: '1', email: 'test@example.com' },
        tokenExpiry: Date.now() + 3600000,
        rememberMe: false,
      }

      mockLocalStorage.getItem.mockReturnValue(null)
      mockSessionStorage.getItem
        .mockReturnValueOnce(testData.accessToken)
        .mockReturnValueOnce(testData.refreshToken)
        .mockReturnValueOnce(JSON.stringify(testData.userData))
        .mockReturnValueOnce(testData.tokenExpiry.toString())

      const result = AuthStorage.getAuthData()
      
      expect(result).toEqual({
        ...testData,
        tokenExpiry: testData.tokenExpiry,
      })
    })
  })

  describe('isTokenExpired', () => {
    it('should return true when no token data exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      mockSessionStorage.getItem.mockReturnValue(null)

      expect(AuthStorage.isTokenExpired()).toBe(true)
    })

    it('should return true when token is expired', () => {
      const expiredTime = Date.now() - 1000 // 1 second ago
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('token')
        .mockReturnValueOnce('refresh-token')
        .mockReturnValueOnce('{"id": "1"}')
        .mockReturnValueOnce(expiredTime.toString())

      expect(AuthStorage.isTokenExpired()).toBe(true)
    })

    it('should return false when token is still valid', () => {
      const validTime = Date.now() + 3600000 // 1 hour from now
      
      mockLocalStorage.getItem
        .mockReturnValueOnce('token')
        .mockReturnValueOnce('refresh-token')
        .mockReturnValueOnce('{"id": "1"}')
        .mockReturnValueOnce(validTime.toString())

      expect(AuthStorage.isTokenExpired()).toBe(false)
    })
  })

  describe('clearAuthData', () => {
    it('should clear all storage data', () => {
      AuthStorage.clearAuthData()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('userData')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('tokenExpiry')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('rememberMe')

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('refreshToken')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('userData')
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('tokenExpiry')
    })
  })
})
