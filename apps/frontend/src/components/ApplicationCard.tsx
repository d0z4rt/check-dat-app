import { A } from '@solidjs/router'
import { type Component, Show } from 'solid-js'

import type { Application } from '../types/application'

type Props = {
  application: Application
}

const ApplicationCard: Component<Props> = (props) => {
  const getStatusInfo = () => {
    const status = props.application.scanStatus

    switch (status) {
      case 'PENDING':
        return {
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-500/20',
          text: 'En attente',
          icon: '⏳'
        }
      case 'SCANNING':
        return {
          bgColor: 'bg-electric-blue/10',
          textColor: 'text-electric-blue',
          borderColor: 'border-electric-blue/20',
          text: 'Analyse en cours',
          icon: '🔍'
        }
      case 'SAFE':
        return {
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/20',
          text: 'Sûre',
          icon: '✅'
        }
      case 'MALICIOUS':
        return {
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          borderColor: 'border-red-500/20',
          text: 'Virus détecté',
          icon: '⚠️'
        }
      case 'ERROR':
        return {
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          text: 'Erreur',
          icon: '❌'
        }
      default:
        return {
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20',
          text: 'Inconnu',
          icon: '❓'
        }
    }
  }

  const displayName = () => props.application.name || props.application.filename

  return (
    <A
      href={`/application/${props.application.id}`}
      class="w-[30%] grow group bg-slate-700/80 rounded-xl p-6 transition-all duration-300 hover:shadow-xl/20"
    >
      <div class="flex items-start justify-between gap-6 h-full">
        <div class="flex flex-col flex-1 w-full min-w-0 h-full justify-between">
          <div>
            <h3 class="text-xl font-semibold text-sky-300 group-hover:text-electric-blue transition-colors truncate">
              {displayName()}
            </h3>

            <div class="flex flex-col mt-4 space-y-2 w-full  align-self-end">
              <p class="text-sm text-slate-300 flex items-end gap-2">
                <span class=" text-slate-400">Fichier:</span>
                <span class="font-mono text-xs truncate w-full">
                  {props.application.filename}
                </span>
              </p>
              <p class="text-sm text-slate-300 flex items-end gap-2">
                <span class=" text-slate-400">Taille:</span>
                <span>
                  {(props.application.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </p>
              <p class="text-sm text-slate-300 flex items-end gap-2">
                <span class="text-slate-400">Hash:</span>
                <span class="font-mono text-xs text-slate-300">
                  {props.application.hash.substring(0, 16)}...
                </span>
              </p>

              <Show when={props.application.comment}>
                {(comment) => (
                  <p class="text-sm text-slate-200 italic border-l-2 border-slate-600 pl-3 mt-1">
                    "{comment()}"
                  </p>
                )}
              </Show>
            </div>
          </div>
          <p class="text-xs text-sky-300 pt-2">
            Ajouté le{' '}
            {new Date(props.application.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>

        <div class="flex flex-col items-end space-y-3">
          <span
            class={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusInfo().bgColor} ${getStatusInfo().textColor} ${getStatusInfo().borderColor}`}
          >
            <span class="mr-1.5 opacity-75">{getStatusInfo().icon}</span>
            {getStatusInfo().text}
          </span>

          <Show when={props.application.scanResult?.stats}>
            {(stats) => (
              <div class="text-xs bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-700/50">
                <span class="text-green-400">
                  {stats().harmless} sûr{stats().harmless !== 1 ? 's' : ''}
                </span>
                <span class="text-slate-400 mx-1">·</span>
                <span class="text-red-400">
                  {stats().malicious} malveillant
                  {stats().malicious !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </Show>
        </div>
      </div>
    </A>
  )
}

export default ApplicationCard
