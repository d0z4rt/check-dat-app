import { type Component, createSignal } from 'solid-js'

type Props = {
  name?: string
  comment?: string
  onSave: (e: { name?: string; comment?: string }) => void
  onCancel: () => void
}

const ApplicationEditor: Component<Props> = (props) => {
  const [name, setName] = createSignal(props.name)
  const [comment, setComment] = createSignal(props.comment)

  const handleSave = () => {
    props.onSave({ name: name(), comment: comment() })
  }

  return (
    <div class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-sky-300 mb-1">
          Nom
        </label>
        <input
          id="name"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          class="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-slate-500"
          placeholder="Nom de l'application"
        />
      </div>
      <div>
        <label
          for="comment"
          class="block text-sm font-medium text-sky-300 mb-1"
        >
          Commentaire
        </label>
        <textarea
          id="comment"
          value={comment()}
          onInput={(e) => setComment(e.currentTarget.value)}
          rows={4}
          class="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent placeholder-slate-500"
          placeholder="Ajouter un commentaire..."
        />
      </div>
      <div class="flex space-x-2">
        <button
          onClick={() => handleSave()}
          class="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
        >
          Sauvegarder
        </button>
        <button
          onClick={() => props.onCancel()}
          class="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

export default ApplicationEditor
