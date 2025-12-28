import type { CrcaModel, CrfmModel } from '../types'

class GristService {
  private isProd = import.meta.env.MODE === 'production'

  // DEV: localStorage UNIQUEMENT
  // PROD: proxy serveur (futur /api/grist)
  private saveDraft (type: 'CRCA' | 'CRFM', data: any): void {
    localStorage.setItem(`${type.toLowerCase()}_brouillon`, JSON.stringify(data, null, 2))
  }

  async submitCrca (data: Partial<CrcaModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRCA', data)

    if (!this.isProd) {
      console.warn('📋 DEV: CRCA brouillon localStorage')
      return { success: true, message: '💾 Brouillon local - Copier Grist manuellement' }
    }

    // PROD: Message "À copier dans Grist" (sécurisé)
    console.warn('🔒 PROD: Données prêtes - Copier dans Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    return { success: true, message: '✅ PROD: Copier brouillon dans Grist manuellement' }
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRFM', data)

    if (!this.isProd) {
      console.warn('📋 DEV: CRFM brouillon localStorage')
      return { success: true, message: '💾 Brouillon local - Copier Grist manuellement' }
    }

    console.warn('🔒 PROD: Données prêtes - Copier dans Grist (ID: 287D12LdHqN4hYBpsm52fo)')
    return { success: true, message: '✅ PROD: Copier brouillon dans Grist manuellement' }
  }
}

export const gristService = new GristService()
