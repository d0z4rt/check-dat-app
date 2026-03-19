import { type Component, Show } from 'solid-js'

import type { Application } from '../types/application'

type Props = {
  application: Application
  onDownload: () => void
  onEdit: (isEditing: true) => void
  onDelete: () => void
}

const ApplicationDetails: Component<Props> = (props) => {
  return (
    <div>
      <div class="flex justify-between items-start">
        <h1 class="text-2xl font-bold text-white">
          {props.application.name || props.application.filename}
        </h1>
        <div class="flex space-x-2">
          <button
            onClick={() => props.onDownload()}
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Télécharger
          </button>
          <button
            onClick={() => props.onEdit(true)}
            class="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
          >
            Modifier
          </button>
          <button
            onClick={() => props.onDelete()}
            class="px-4 py-2 border border-rose-500 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>

      <Show when={props.application.comment}>
        <div class="mt-4 p-4 bg-slate-900/50 border border-slate-700/50 rounded-lg">
          <p class="text-slate-300 italic">"{props.application.comment}"</p>
        </div>
      </Show>

      <dl class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <dt class="text-sm font-medium text-slate-400">Fichier</dt>
          <dd class="mt-1 text-sm text-white">{props.application.filename}</dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-400">Hash</dt>
          <dd class="mt-1 text-sm text-slate-300 font-mono break-all">
            {props.application.hash}
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-400">Taille</dt>
          <dd class="mt-1 text-sm text-white">
            {((props.application.size || 0) / 1024 / 1024).toFixed(2)} MB
          </dd>
        </div>
        <div>
          <dt class="text-sm font-medium text-slate-400">Ajouté le</dt>
          <dd class="mt-1 text-sm text-white">
            {new Date(props.application.createdAt).toLocaleDateString('fr-FR', {
              dateStyle: 'long'
            })}
          </dd>
        </div>
      </dl>

      <Show when={props.application.scanResult}>
        {(result) => (
          <div class="mt-6">
            <h2 class="text-lg font-semibold mb-4 text-white">
              Résultats du scan
            </h2>

            <div class="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4">
              <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-400">
                    {result().stats?.undetected || 0}
                  </div>
                  <div class="text-sm text-slate-400">Sûrs</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-red-400">
                    {result().stats?.malicious || 0}
                  </div>
                  <div class="text-sm text-slate-400">Malveillants</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-yellow-400">
                    {result().stats?.suspicious || 0}
                  </div>
                  <div class="text-sm text-slate-400">Suspects</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-slate-300">
                    {result().stats?.harmless || 0}
                  </div>
                  <div class="text-sm text-slate-400">Sans danger</div>
                </div>
              </div>

              <p class="mt-4 text-sm text-slate-400 text-center">
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
