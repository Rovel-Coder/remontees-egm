// src/services/gristService.ts - BROUILLONS + ENVOI GRIST - ESLint OK
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

  /**
   * Envoi CRCA vers Grist
   */
  async submitCrca (data: any): Promise<{ success: boolean, message: string }> {
    try {
      const response = await fetch('/api/grist.post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'CRCA',
          records: [{
            secteur: data.secteur || '',
            indicatifs: Array.isArray(data.indicatifs) ? data.indicatifs : [],
            intervention: data.intervention || '',
            natureIntervention: data.natureIntervention || '',
            heureDebut: data.heureDebut || '',
            heureFin: data.heureFin || '',
            pam: data.pam || '',
            lieu: data.lieu || '',
            resume: data.resume || '',
            personnel: data.personnel || '',
            armement: data.armement || '',
            materiel: data.materiel || ''
          }]
        })
      })

      const result = await response.json()
      if (response.ok && result.success) {
        this.clearDraft('CRCA') // Supprime brouillon après succès
        return { success: true, message: result.message || '✅ CRCA envoyé !' }
      }
      throw new Error(result.error || 'Grist CRCA KO')
    }
    catch (error) {
      console.error('Erreur Grist CRCA:', error)
      this.saveDraft('CRCA', data) // Sauvegarde brouillon en cas d'erreur
      throw error
    }
  }

  /**
   * Envoi CRFM vers Grist
   */
  async submitCrfm (data: any): Promise<{ success: boolean, message: string }> {
    try {
      const response = await fetch('/api/grist.post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table: 'CRFM',
          records: [{
            date: data.date || '',
            secteur: data.secteur || '',
            mission: data.mission || '',
            horaire: data.horaire || '',
            effectifs: data.effectifs || null,
            vlEngages: data.vlEngages || null,
            nbOad: data.nbOad || null,
            controlesVl: data.controlesVl || null,
            controlesPersonne: data.controlesPersonne || null,
            nbInterCorgCic: data.nbInterCorgCic || null,
            nbInterInitiative: data.nbInterInitiative || null,
            rensFrm: data.rensFrm || null,
            rensFrs: data.rensFrs || null,
            stupCannabis: data.stupCannabis || null,
            stupPlant: data.stupPlant || null,
            stupAutres: data.stupAutres || '',
            infraTa: data.infraTa || null,
            infraDelits: data.infraDelits || null,
            interpZgn: data.interpZgn || null,
            interpZpn: data.interpZpn || null,
            caillassageTouchant: data.caillassageTouchant || null,
            caillassageNonTouchant: data.caillassageNonTouchant || null,
            refusAvecInterp: data.refusAvecInterp || null,
            refusSansInterp: data.refusSansInterp || null,
            obstacle: data.obstacle || null,
            feuHabitation: data.feuHabitation || null,
            feuVoitures: data.feuVoitures || null,
            feuAutres: data.feuAutres || null,
            papafTouchant: data.papafTouchant || null,
            papafNonTouchant: data.papafNonTouchant || null,
            grenMp7: data.grenMp7 || null,
            grenCm6: data.grenCm6 || null,
            grenGenlDmp: data.grenGenlDmp || null,
            grenGm2l: data.grenGm2l || null,
            grenGl304: data.grenGl304 || null,
            munLbd40: data.munLbd40 || null,
            mun9mm: data.mun9mm || null,
            mun556: data.mun556 || null,
            mun762: data.mun762 || null,
            commentairePam: data.commentairePam || ''
          }]
        })
      })

      const result = await response.json()
      if (response.ok && result.success) {
        this.clearDraft('CRFM') // Supprime brouillon après succès
        return { success: true, message: result.message || '✅ CRFM envoyé !' }
      }
      throw new Error(result.error || 'Grist CRFM KO')
    }
    catch (error) {
      console.error('Erreur Grist CRFM:', error)
      this.saveDraft('CRFM', data) // Sauvegarde brouillon en cas d'erreur
      throw error
    }
  }
}

export const gristService = new GristService()
