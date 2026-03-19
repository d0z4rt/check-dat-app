export type Application = {
  id: string
  filename: string
  hash: string
  size: number
  name?: string
  comment?: string
  scanStatus: 'PENDING' | 'SCANNING' | 'SAFE' | 'MALICIOUS' | 'ERROR'
  scanResult?: ScanResult
  scanDate?: string
  createdAt: string
  updatedAt: string
}

export type UpdateApplicationDto = {
  name?: string
  comment?: string
}

export type ScanResult = {
  status: 'MALICIOUS' | 'SAFE' | 'UNKNOWN'
  stats?: {
    harmless: number
    malicious: number
    suspicious: number
    undetected: number
    timeout: number
    'confirmed-timeout': number
    failure: number
    'type-unsupported': number
  }
  scanDate: number
  results?: Record<string, any>
  message?: string
}
