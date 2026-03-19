import { A } from '@solidjs/router'
import { type Component, Show } from 'solid-js'

import type { Application } from '../types/application'

type Props = {
  application: Application
  onDelete: () => void
}

const ApplicationCard: Component<Props> = (props) => {
  const getStatusInfo = () => {
    const status = props.application.scanStatus

    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          text: 'En attente',
          icon: '⏳'
        }
      case 'SCANNING':
        return {
          color: 'bg-blue-100 text-blue-800',
          text: 'Analyse en cours',
          icon: '🔍'
        }
      case 'SAFE':
        return {
          color: 'bg-green-100 text-green-800',
          text: 'Sûre',
          icon: '✅'
        }
      case 'MALICIOUS':
        return {
          color: 'bg-red-100 text-red-800',
          text: 'Virus détecté',
          icon: '⚠️'
        }
      case 'ERROR':
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Erreur',
          icon: '❌'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          text: 'Inconnu',
          icon: '❓'
        }
    }
  }

  const displayName = () => props.application.name || props.application.filename

  return (
    <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <A href={`/application/${props.application.id}`} class="block">
            <h3 class="text-lg font-medium text-gray-900 hover:text-blue-600">
              {displayName()}
            </h3>
          </A>

          <div class="mt-2 space-y-1">
            <p class="text-sm text-gray-500">
              Fichier: {props.application.filename}
            </p>
            <p class="text-sm text-gray-500">
              Taille: {(props.application.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p class="text-sm text-gray-500">
              Hash: {props.application.hash.substring(0, 16)}...
            </p>
            <Show when={props.application.comment}>
              {(comment) => (
                <p class="text-sm text-gray-600 mt-2">"{comment()}"</p>
              )}
            </Show>

            <p class="text-xs text-gray-400">
              Ajouté{' '}
              {new Date(props.application.createdAt).toLocaleDateString(
                'fr-FR'
              )}
            </p>
          </div>
        </div>

        <div class="ml-4 flex flex-col items-end space-y-2">
          <span
            class={`px-3 py-1 rounded-full text-sm font-medium ${getStatusInfo().color}`}
          >
            <span class="mr-1">{getStatusInfo().icon}</span>
            {getStatusInfo().text}
          </span>

          <Show when={props.application.scanResult?.stats}>
            {(stats) => (
              <div class="text-xs text-gray-500">
                <span class="text-green-600">{stats().harmless} sûrs</span>
                {' · '}
                <span class="text-red-600">
                  {stats().malicious} malveillants
                </span>
              </div>
            )}
          </Show>

          <button
            onClick={() => props.onDelete()}
            class="text-sm text-red-600 hover:text-red-800"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplicationCard
