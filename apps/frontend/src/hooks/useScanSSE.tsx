import { revalidate } from '@solidjs/router'
import { onCleanup, onMount } from 'solid-js'
import toast from 'solid-toast'

import { API_BASE_URL } from '../api'
import { getApplications } from '../components/ApplicationList'
import { getApplication } from '../screens/Application'

type ScanData = {
  status: 'SUCCESS' | 'FAILURE'
  applicationId: string
}

const useScanSSE = () => {
  let eventSource: EventSource | undefined
  onMount(() => {
    // Connect to the NestJS SSE endpoint
    eventSource = new EventSource(`${API_BASE_URL}/notify/scan`)

    // Listen for messages
    eventSource.onmessage = (event) => {
      if (!eventSource) {
        return
      }
      const data: ScanData = JSON.parse(event.data)
      if (data.status === 'SUCCESS') {
        toast.success('App scan completed successfully!')

        // revalidate the cache for the application list and the specific application
        revalidate(getApplications.key)
        revalidate(getApplication.keyFor(data.applicationId))
      } else if (data.status === 'FAILURE') {
        toast.error('App scan failed.')
        //eventSource.close()
      }
    }

    eventSource.onerror = (error) => {
      // oxlint-disable-next-line no-console
      console.error('SSE Error:', error)
      if (!eventSource) {
        return
      }
      // EventSource tries to reconnect automatically, but you can handle UI states here
      eventSource.close()
    }

    // Cleanup the connection when the component is unmounted
  })

  onCleanup(() => {
    eventSource?.close()
  })
}

export default useScanSSE
