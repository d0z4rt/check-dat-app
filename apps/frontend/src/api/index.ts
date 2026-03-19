import axios from 'axios'

import type { Application } from '../types/application'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const applicationsApi = {
  // Récupérer toutes les applications
  getAll: async (): Promise<Application[]> => {
    const response = await api.get('/applications')
    return response.data
  },

  // Récupérer une application par ID
  getOne: async (id: string): Promise<Application> => {
    const response = await api.get(`/applications/${id}`)
    return response.data
  },

  // Uploader une application
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/applications/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Mettre à jour une application
  update: async (
    id: string,
    data: { name?: string | null; comment?: string | null }
  ): Promise<Application> => {
    const response = await api.put(`/applications/${id}`, data)
    return response.data
  },

  // Supprimer une application
  delete: async (id: string) => {
    const response = await api.delete(`/applications/${id}`)
    return response.data
  },

  // Télécharger un fichier
  download: (id: string) => {
    window.open(`${API_BASE_URL}/applications/${id}/download`)
  }
}
