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
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
          Nom
        </label>
        <input
          id="name"
          type="text"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nom de l'application"
        />
      </div>
      <div>
        <label
          for="comment"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Commentaire
        </label>
        <textarea
          id="comment"
          value={comment()}
          onInput={(e) => setComment(e.currentTarget.value)}
          rows={4}
          class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ajouter un commentaire..."
        />
      </div>
      <div class="flex space-x-2">
        <button
          onClick={() => handleSave()}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Sauvegarder
        </button>
        <button
          onClick={() => props.onCancel()}
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}

export default ApplicationEditor
