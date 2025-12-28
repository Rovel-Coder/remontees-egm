import type { CrcaModel, CrfmModel } from '../types'

class GristService {
  private saveDraft (type: 'CRCA' | 'CRFM', data: any): void {
    localStorage.setItem(`${type.toLowerCase()}_brouillon`, JSON.stringify(data, null, 2))
  }

  async submitCrca (data: Partial<CrcaModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRCA', data)

    try {
      const response = await fetch('/api/grist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CRCA', payload: data })
      })

      const result = await response.json()
      return result
    }
    catch (error: any) {
      console.warn('API error:', error)
      return { success: true, message: '💾 Brouillon sauvé localement' }
    }
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRFM', data)

    try {
      const response = await fetch('/api/grist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'CRFM', payload: data })
      })

      const result = await response.json()
      return result
    }
    catch (error: any) {
      console.warn('API error:', error)
      return { success: true, message: '💾 Brouillon sauvé localement' }
    }
  }

  loadDraft (type: 'CRCA' | 'CRFM'): any {
    const key = `${type.toLowerCase()}_brouillon`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  clearDraft (type: 'CRCA' | 'CRFM'): void {
    localStorage.removeItem(`${type.toLowerCase()}_brouillon`)
  }
}

export const gristService = new GristService()
