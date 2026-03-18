import { IsOptional, IsString } from 'class-validator'

/**
 * This dto is internal no need for validation
 */
export type CreateApplicationDto = {
  filename: string
  filePath: string
  hash: string
  size: number
}

/**
 * Exposed dto for updating an app details\
 * ! needs validation !
 */
export class UpdateApplicationDto {
  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  comment?: string
}

export type ScanStatus = 'PENDING' | 'SCANNING' | 'SAFE' | 'MALICIOUS' | 'ERROR'

export type Application = {
  id: string
  filename: string
  filePath: string
  hash: string
  size: number
  name?: string
  comment?: string
  scanStatus: ScanStatus
  scanResult?: any
  createdAt: Date
  updatedAt: Date
}
