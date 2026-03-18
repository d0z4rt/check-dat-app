import { createAsync, query, revalidate } from '@solidjs/router'
import {
  type Component,
  For,
  onCleanup,
  onMount,
  Show,
  Suspense
} from 'solid-js'

import { applicationsApi } from '../api'
import ApplicationCard from './ApplicationCard'

const getApplications = query(async () => {
  try {
    return await applicationsApi.getAll()
  } catch (error) {
    // oxlint-disable-next-line no-console
    console.error('Erreur lors du chargement des applications:', error)
  }
}, 'getApplications')

const ApplicationList: Component = () => {
  const applications = createAsync(() => getApplications())

  const refreshApplications = () => {
    revalidate(getApplications.key)
  }

  onMount(() => {
    // Rafraîchir toutes les 5 secondes pour les scans en cours
    const interval = setInterval(refreshApplications, 5000)

    onCleanup(() => clearInterval(interval))
  })

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette application ?')) {
      try {
        await applicationsApi.delete(id)
        refreshApplications()
      } catch (error) {
        // oxlint-disable-next-line no-console
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  return (
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Bibliothèque d'applications</h2>
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
        <div class="space-y-4">
          <For each={applications()}>
            {(app) => (
              <ApplicationCard
                application={app}
                onDelete={() => handleDelete(app.id)}
              />
            )}
          </For>
        </div>
      </Suspense>
    </div>
  )
}

export default ApplicationList
