export type Application = {
  id: string
  filename: string
  hash: string
  size: number
  name?: string
  comment?: string
  scanStatus: 'PENDING' | 'SCANNING' | 'SAFE' | 'MALICIOUS' | 'ERROR'
  scanResult?: any
  createdAt: string
  updatedAt: string
}

export type UpdateApplicationDto = {
  name?: string
  comment?: string
}
