import { createAsync, query } from '@solidjs/router'
import { type Component, For, Show, Suspense } from 'solid-js'

import { applicationsApi } from '../api'
import ApplicationCard from './ApplicationCard'

export const getApplications = query(async () => {
  try {
    return await applicationsApi.getAll()
  } catch (error) {
    // oxlint-disable-next-line no-console
    console.error('Erreur lors du chargement des applications:', error)
  }
}, 'getApplications')

const ApplicationList: Component = () => {
  const applications = createAsync(() => getApplications())

  return (
    <div class="bg-slate-700/50 backdrop-blur-lg rounded-lg border border-slate-600/50 shadow-2xl p-6">
      <h2 class="text-lg font-semibold mb-4 text-white">
        Bibliothèque d'applications
      </h2>
      <Suspense
        fallback={
          <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            <p class="mt-2 text-gray-600">Chargement...</p>
          </div>
        }
      >
        <Show when={applications()?.length === 0}>
          <div class="text-center py-8 text-gray-500">
            Aucune application téléversée
          </div>
        </Show>
        <div class="flex flex-wrap gap-2">
          <For each={applications()}>
            {(app) => <ApplicationCard application={app} />}
          </For>
        </div>
      </Suspense>
    </div>
  )
}

export default ApplicationList
