import { action, useAction, useSubmission } from '@solidjs/router'
import { type Component, createSignal, Show } from 'solid-js'
import toast from 'solid-toast'

import { applicationsApi } from '../api'

const uploadApplication = action(async (file: File) => {
  return await applicationsApi.upload(file)
}, 'upload-application')

const UploadForm: Component = () => {
  const [file, setFile] = createSignal<File | null>(null)
  const upload = useAction(uploadApplication)
  const submission = useSubmission(uploadApplication)

  const handleFileChange = (e: Event) => {
    const input = e.target as HTMLInputElement
    if (input.files && input.files[0]) {
      const selectedFile = input.files[0]

      // Vérifier l'extension
      if (!selectedFile.name.endsWith('.apk')) {
        toast.error('Seuls les fichiers APK sont autorisés')
        input.value = ''
        return
      }

      // Vérifier la taille (max 200MB)
      if (selectedFile.size > 200 * 1024 * 1024) {
        toast.error('Le fichier ne doit pas dépasser 200MB')
        input.value = ''
        return
      }

      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file()) return
    try {
      await upload(file()!)
      toast.success('Application téléversée avec succès')

      // Reset input
      setFile(null)
      const input = document.getElementById('file-upload') as HTMLInputElement
      if (input) input.value = ''
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erreur lors du téléversement'
      )
    }
  }

  return (
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold mb-4">Téléverser une application</h2>
      <div class="space-y-4">
        <div>
          <label
            for="file-upload"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Fichier APK
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".apk"
            onChange={handleFileChange}
            class="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
          />
        </div>
        <Show when={file()}>
          {(f) => (
            <div class="text-sm text-gray-600">
              Fichier sélectionné: {f()?.name} (
              {(f()!.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}
        </Show>
        <button
          onClick={handleUpload}
          disabled={!file() || submission.pending}
          class="px-4 py-2 bg-blue-600 text-white rounded-md
                 hover:bg-blue-700 disabled:bg-gray-300
                 disabled:cursor-not-allowed transition-colors"
        >
          {submission.pending ? 'Téléversement...' : 'Téléverser'}
        </button>
      </div>
    </div>
  )
}

export default UploadForm
