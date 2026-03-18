import {
  useParams,
  useNavigate,
  type RouteSectionProps,
  createAsync,
  query,
  action,
  useAction
} from '@solidjs/router'
import { type Component, createSignal, Show, Suspense } from 'solid-js'
import toast from 'solid-toast'

import { applicationsApi } from '../api'
import ApplicationDetails from '../components/ApplicationDetails'
import ApplicationEditor from '../components/ApplicationEditor'

const getApplication = query(async (id: string) => {
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

const Application: Component<RouteSectionProps> = (props) => {
  const application = createAsync(() => getApplication(props.params.id!))
  const params = useParams()
  const navigate = useNavigate()
  const [editing, setEditing] = createSignal(false)

  const update = useAction(updateApplication)

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

  return (
    <Suspense
      fallback={
        <div class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
          <p class="mt-2 text-gray-600">Chargement...</p>
        </div>
      }
    >
      <div class="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          class="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Retour à la liste
        </button>

        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="p-6">
            <Show when={application()}>
              {(app) => (
                <ApplicationDetails
                  application={app()}
                  onDownload={() => handleDownload()}
                  onEdit={(e) => setEditing(e)}
                />
              )}
            </Show>
            <Show when={editing()}>
              <ApplicationEditor
                name={application()?.name}
                comment={application()?.comment}
                onSave={(e) => handleSave(e)}
                onCancel={() => setEditing(false)}
              />
            </Show>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export default Application
