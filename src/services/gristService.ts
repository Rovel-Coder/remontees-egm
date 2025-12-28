import type { CrcaModel, CrfmModel } from '../types'

class GristService {
  private isProd = import.meta.env.MODE === 'production'

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

    if (!this.isProd) {
      console.warn('📋 DEV: CRCA brouillon sauvé → localStorage')
      console.warn('JSON CRCA:', JSON.stringify(data, null, 2))
      return { success: true, message: '💾 Brouillon CRCA sauvé - Copier dans Grist' }
    }

    console.warn('🔒 PROD: CRCA prêt - Copier Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    console.warn('JSON CRCA PROD:', JSON.stringify(data, null, 2))
    return { success: true, message: '✅ PROD: Copier CRCA dans Grist (ID: 287D12LdHqN4hYBpsm52fo)' }
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRFM', data)

    if (!this.isProd) {
      console.warn('📋 DEV: CRFM brouillon sauvé → localStorage')
      console.warn('JSON CRFM:', JSON.stringify(data, null, 2))
      return { success: true, message: '💾 Brouillon CRFM sauvé - Copier dans Grist' }
    }

    console.warn('🔒 PROD: CRFM prêt - Copier Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    console.warn('JSON CRFM PROD:', JSON.stringify(data, null, 2))
    return { success: true, message: '✅ PROD: Copier CRFM dans Grist (ID: 287D12LdHqN4hYBpsm52fo)' }
  }
}

export const gristService = new GristService()
