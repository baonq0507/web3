export interface StoredAuthData {
  accessToken: string
  refreshToken: string
  userData: any
  tokenExpiry: number
  rememberMe: boolean
}

export class AuthStorage {
  private static readonly STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER_DATA: 'userData',
    TOKEN_EXPIRY: 'tokenExpiry',
    REMEMBER_ME: 'rememberMe',
  }

  /**
   * Lưu thông tin authentication vào storage
   */
  static saveAuthData(data: StoredAuthData): void {
    const storage = data.rememberMe ? localStorage : sessionStorage
    
    storage.setItem(this.STORAGE_KEYS.ACCESS_TOKEN, data.accessToken)
    storage.setItem(this.STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken)
    storage.setItem(this.STORAGE_KEYS.USER_DATA, JSON.stringify(data.userData))
    storage.setItem(this.STORAGE_KEYS.TOKEN_EXPIRY, data.tokenExpiry.toString())
    
    if (data.rememberMe) {
      storage.setItem(this.STORAGE_KEYS.REMEMBER_ME, 'true')
    }
  }

  /**
   * Lấy thông tin authentication từ storage
   */
  static getAuthData(): StoredAuthData | null {
    // Kiểm tra localStorage trước (remember me)
    let storage = localStorage
    let rememberMe = true
    
    // Nếu không có trong localStorage, kiểm tra sessionStorage
    if (!storage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN)) {
      storage = sessionStorage
      rememberMe = false
    }

    const accessToken = storage.getItem(this.STORAGE_KEYS.ACCESS_TOKEN)
    const refreshToken = storage.getItem(this.STORAGE_KEYS.REFRESH_TOKEN)
    const userData = storage.getItem(this.STORAGE_KEYS.USER_DATA)
    const tokenExpiry = storage.getItem(this.STORAGE_KEYS.TOKEN_EXPIRY)

    if (!accessToken || !refreshToken || !userData || !tokenExpiry) {
      return null
    }

    return {
      accessToken,
      refreshToken,
      userData: JSON.parse(userData),
      tokenExpiry: parseInt(tokenExpiry),
      rememberMe,
    }
  }

  /**
   * Cập nhật token mới
   */
  static updateTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const data = this.getAuthData()
    if (data) {
      data.accessToken = accessToken
      data.refreshToken = refreshToken
      data.tokenExpiry = Date.now() + (expiresIn * 1000)
      this.saveAuthData(data)
    }
  }

  /**
   * Kiểm tra token có hết hạn chưa
   */
  static isTokenExpired(): boolean {
    const data = this.getAuthData()
    if (!data) return true
    
    return Date.now() >= data.tokenExpiry
  }

  /**
   * Kiểm tra token có sắp hết hạn không (trong vòng 5 phút)
   */
  static isTokenExpiringSoon(minutes: number = 5): boolean {
    const data = this.getAuthData()
    if (!data) return true
    
    const fiveMinutesFromNow = Date.now() + (minutes * 60 * 1000)
    return fiveMinutesFromNow >= data.tokenExpiry
  }

  /**
   * Xóa tất cả thông tin authentication
   */
  static clearAuthData(): void {
    // Xóa localStorage
    localStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(this.STORAGE_KEYS.USER_DATA)
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN_EXPIRY)
    localStorage.removeItem(this.STORAGE_KEYS.REMEMBER_ME)
    
    // Xóa sessionStorage
    sessionStorage.removeItem(this.STORAGE_KEYS.ACCESS_TOKEN)
    sessionStorage.removeItem(this.STORAGE_KEYS.REFRESH_TOKEN)
    sessionStorage.removeItem(this.STORAGE_KEYS.USER_DATA)
    sessionStorage.removeItem(this.STORAGE_KEYS.TOKEN_EXPIRY)
  }

  /**
   * Lấy access token
   */
  static getAccessToken(): string | null {
    const data = this.getAuthData()
    return data?.accessToken || null
  }

  /**
   * Lấy refresh token
   */
  static getRefreshToken(): string | null {
    const data = this.getAuthData()
    return data?.refreshToken || null
  }

  /**
   * Lấy thông tin user
   */
  static getUserData(): any | null {
    const data = this.getAuthData()
    return data?.userData || null
  }

  /**
   * Kiểm tra có thông tin authentication không
   */
  static hasAuthData(): boolean {
    return this.getAuthData() !== null
  }
}
