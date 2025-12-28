import type { CrcaModel, CrfmModel } from '../types'

class GristService {
  private saveDraft (type: 'CRCA' | 'CRFM', data: any): void {
    localStorage.setItem(`${type.toLowerCase()}_brouillon`, JSON.stringify(data, null, 2))
  }

  loadDraft (type: 'CRCA' | 'CRFM'): any {
    const key = `${type.toLowerCase()}_brouillon`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  clearDraft (type: 'CRCA' | 'CRFM'): void {
    localStorage.removeItem(`${type.toLowerCase()}_brouillon`)
  }

  async submitCrca (data: Partial<CrcaModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRCA', data)

    console.warn('🚀 GRIST READY - Copier JSON ci-dessous dans Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    console.warn('JSON CRCA:', JSON.stringify(data, null, 2))

    return {
      success: true,
      message: '✅ JSON copié console F12 ! Collez dans Grist Tables CRCA/CRFM'
    }
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRFM', data)

    console.warn('🚀 GRIST READY - Copier JSON ci-dessous dans Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    console.warn('JSON CRFM:', JSON.stringify(data, null, 2))

    return {
      success: true,
      message: '✅ JSON copié console F12 ! Collez dans Grist Tables CRCA/CRFM'
    }
  }
}

export const gristService = new GristService()
