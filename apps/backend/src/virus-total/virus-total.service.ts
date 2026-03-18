import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class VirusTotalService {
  private readonly logger = new Logger(VirusTotalService.name)
  private readonly apiKey: string
  private readonly baseUrl = 'https://www.virustotal.com/api/v3'

  constructor(
    private httpService: HttpService,
    private configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('VIRUSTOTAL_API_KEY') as string
  }

  async scanFile(hash: string): Promise<any> {
    try {
      // Check if the hash already exists
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/files/${hash}`, {
          headers: {
            'x-apikey': this.apiKey
          }
        })
      )

      const data = response.data.data
      const stats = data.attributes.last_analysis_stats

      // Check if the file is malicious
      const isMalicious = stats.malicious > 0 || stats.suspicious > 0

      return {
        status: isMalicious ? 'MALICIOUS' : 'SAFE',
        stats,
        scanDate: data.attributes.last_analysis_date,
        results: data.attributes.last_analysis_results
      }
    } catch (error) {
      if (error.response?.status === 404) {
        // File is not known
        return {
          status: 'UNKNOWN',
          message: 'Fichier non trouvé dans VirusTotal'
        }
      }

      this.logger.error(`Erreur VirusTotal: ${error.message}`)
      throw new Error(`Erreur lors de la vérification: ${error.message}`)
    }
  }
}
