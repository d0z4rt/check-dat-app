import { Controller, Sse, MessageEvent } from '@nestjs/common'
import { interval, Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { NotifyService } from './notify.service'

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Sse('scan')
  streamScanEvents(): Observable<MessageEvent> {
    return this.notifyService.scanEvents$.pipe(
      map((event) => ({
        data: event
      }))
    )
  }
}
