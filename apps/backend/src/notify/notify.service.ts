import { Injectable } from '@nestjs/common'
import { Subject } from 'rxjs'

export interface ScanEvent {
  applicationId: string
  status: 'PENDING' | 'SUCCESS' | 'FAILURE'
  result?: string
}

@Injectable()
export class NotifyService {
  // Subject used to emit scan events
  private scanEventsSubject = new Subject<ScanEvent>()

  // Observable of scan events for SSE
  public scanEvents$ = this.scanEventsSubject.asObservable()

  emitScanCompleted(applicationId: string, result: any) {
    this.scanEventsSubject.next({
      applicationId,
      status: 'SUCCESS',
      result
    })
  }

  emitScanFailed(applicationId: string, error: any) {
    this.scanEventsSubject.next({
      applicationId,
      status: 'FAILURE',
      result: error
    })
  }
}
