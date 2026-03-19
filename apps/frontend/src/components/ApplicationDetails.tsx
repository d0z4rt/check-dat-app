import { type Component, Show } from 'solid-js'

import type { Application } from '../types/application'

type Props = {
  application: Application
  onDownload: () => void
  onEdit: (isEditing: true) => void
}

const ApplicationDetails: Component<Props> = (props) => {
  return (
    <div>
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold text-gray-900">
          {props.application.name || props.application.filename}
        </h1>
        <div class="flex space-x-2">
          <button
            onClick={() => props.onDownload()}
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Télécharger
          </button>
          <button
            onClick={() => props.onEdit(true)}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Modifier
          </button>
        </div>
      </div>

      <Show when={props.application.comment}>
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-gray-700 italic">"{props.application.comment}"</p>
        </div>
      </Show>

      <dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-sm font-medium text-gray-500">Fichier</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {props.application.filename}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Hash</dt>
          <dd class="mt-1 text-sm text-gray-900 font-mono break-all">
            {props.application.hash}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Taille</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {((props.application.size || 0) / 1024 / 1024).toFixed(2)} MB
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-gray-500">Ajouté le</dt>
          <dd class="mt-1 text-sm text-gray-900">
            {new Date(props.application.createdAt).toLocaleDateString('fr-FR', {
              dateStyle: 'long'
            })}
          </dd>
        </div>
      </dl>

      <Show when={props.application.scanResult}>
        {(result) => (
          <div class="mt-6">
            <h2 class="text-lg font-semibold mb-4">Résultats du scan</h2>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {result().stats?.undetected || 0}
                  </div>
                  <div class="text-sm text-gray-500">Sûrs</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-600">
                    {result().stats?.malicious || 0}
                  </div>
                  <div class="text-sm text-gray-500">Malveillants</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-600">
                    {result().stats?.suspicious || 0}
                  </div>
                  <div class="text-sm text-gray-500">Suspects</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-600">
                    {result().stats?.harmless || 0}
                  </div>
                  <div class="text-sm text-gray-500">Sans danger</div>
                </div>
              </div>

              <p class="mt-4 text-sm text-gray-500 text-center">
                Dernière analyse:{' '}
                {props.application.scanDate
                  ? new Date(props.application.scanDate).toLocaleString('fr-FR')
                  : 'Pas encore analysé'}
              </p>
            </div>
          </div>
        )}
      </Show>
    </div>
  )
}

export default ApplicationDetails
