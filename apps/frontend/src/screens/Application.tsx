import {
  useParams,
  useNavigate,
  type RouteSectionProps,
  createAsync,
  query,
  action,
  useAction,
  redirect
} from '@solidjs/router'
import { type Component, createSignal, Show, Suspense } from 'solid-js'
import toast from 'solid-toast'

import { applicationsApi } from '../api'
import ApplicationDetails from '../components/ApplicationDetails'
import ApplicationEditor from '../components/ApplicationEditor'

export const getApplication = query(async (id: string) => {
  try {
    return await applicationsApi.getOne(id)
  } catch {
    toast.error('Application non trouvée')
  }
}, 'get-application')

const updateApplication = action(
  async (
    id: string,
    data: { name?: string | null; comment?: string | null }
  ) => {
    return await applicationsApi.update(id, data)
  },
  'update-application'
)

const deleteApplication = action(async (id: string) => {
  await applicationsApi.delete(id)
  throw redirect('/')
}, 'delete-application')

const Application: Component<RouteSectionProps> = (props) => {
  const application = createAsync(() => getApplication(props.params.id!))
  const params = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = createSignal(false)

  const update = useAction(updateApplication)
  const deleteApp = useAction(deleteApplication)

  const handleSave = async (e: { name?: string; comment?: string }) => {
    try {
      if (!params.id) {
        return
      }
      await update(params.id, {
        name: e.name || null,
        comment: e.comment || null
      })
      setEditing(false)
      toast.success('Modifications enregistrées')
    } catch {
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  const handleDownload = () => {
    if (!params.id) {
      return
    }
    applicationsApi.download(params.id)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette application ?')) {
      try {
        await deleteApp(id)
      } catch (error) {
        // oxlint-disable-next-line no-console
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  return (
    <Suspense
      fallback={
        <div class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-3 border-sky-400 border-t-transparent" />
          <p class="mt-4 text-slate-300 font-medium">
            Chargement de l'application...
          </p>
        </div>
      }
    >
      <div class="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          class="group mb-8 text-sky-400 hover:text-sky-300 flex items-center gap-2 transition-colors font-medium"
        >
          <span class="transform transition-transform group-hover:-translate-x-1">
            ←
          </span>
          Retour à la liste
        </button>

        <div class="bg-slate-700/50 backdrop-blur-lg rounded-lg border border-slate-600/50 overflow-hidden shadow-2xl">
          <div class="p-6">
            <Show when={application()}>
              {(app) => (
                <ApplicationDetails
                  application={app()}
                  onDownload={() => handleDownload()}
                  onEdit={(e) => setEditing(e)}
                  onDelete={() => handleDelete(params.id!)}
                />
              )}
            </Show>
            <Show when={editing()}>
              <div class="mt-8 pt-8 border-t border-slate-600">
                <h3 class="text-xl font-semibold text-white mb-6">
                  Modifier l'application
                </h3>
                <ApplicationEditor
                  name={application()?.name}
                  comment={application()?.comment}
                  onSave={(e) => handleSave(e)}
                  onCancel={() => setEditing(false)}
                />
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Application
