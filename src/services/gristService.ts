import type { CrcaModel, CrfmModel } from '../types'

class GristService {
  private readonly GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
  private readonly GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

  // ⚠️ REMPLACEZ PAR VOTRE API KEY GRIST
  private readonly API_KEY = 'VOTRE_API_KEY_CLIENT_ICI'

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

    const gristData: Record<string, string> = {
      Secteur: data.secteur || '',
      Indic_Patrouille: Array.isArray(data.indicatifs) ? data.indicatifs.join(', ') : '',
      Intervention: data.intervention || '',
      Nature_Intervention: data.natureIntervention || '',
      Heure_debut_Intervention: data.heureDebut || '',
      Heure_Fin_Intervention: data.heureFin || '',
      PAM: data.pam || '',
      Lieu: data.lieu || '',
      Resume_Intervention: data.resume || '',
      Personnel: data.personnel || '',
      Armement: data.armement || '',
      Materiel: data.materiel || ''
    }

    const body = { records: [{ fields: gristData }] }

    try {
      const response = await fetch(
        `${this.GRIST_BASE_URL}/api/docs/${this.GRIST_DOC_ID}/tables/CRCA/records`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      if (response.ok) {
        console.warn('✅ CRCA créé:', await response.json())
        this.clearDraft('CRCA')
        return { success: true, message: '✅ Enregistrement CRCA créé dans Grist' }
      }
      else {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
    }
    catch (error) {
      console.error('❌ Erreur GRIST CRCA:', error)
      return { success: false, message: `❌ Erreur: ${error}` }
    }
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<{ success: boolean, message: string }> {
    this.saveDraft('CRFM', data)

    const gristData: Record<string, string> = {
      Date: data.date || '',
      Secteur: data.secteur || '',
      Mission: data.mission || '',
      Horaires: data.horaire || '',
      Effectifs: data.effectifs?.toString() || '',
      VL_Engages: data.vlEngages?.toString() || '',
      Nbr_OAD: data.nbOad?.toString() || '',
      Nbr_CTRL_VL: data.controlesVl?.toString() || '',
      Nbr_CTRL_Personne: data.controlesPersonne?.toString() || '',
      Nbr_Intervention_CORG_CIC: data.nbInterCorgCic?.toString() || '',
      Nbr_Intervention_Initiative: data.nbInterInitiative?.toString() || '',
      FRM: data.rensFrm?.toString() || '',
      FRS: data.rensFrs?.toString() || '',
      Cannabis: data.stupCannabis?.toString() || '',
      Plant_Cannabis: data.stupPlant?.toString() || '',
      Autres: data.stupAutres || '',
      Precision_STUP: data.stupAutres || '',
      TA: data.infraTa?.toString() || '',
      Delits: data.infraDelits?.toString() || '',
      Interpellation_ZGN: data.interpZgn?.toString() || '',
      Interpellation_ZPN: data.interpZpn?.toString() || '',
      Caillassage_Touchant: data.caillassageTouchant?.toString() || '',
      Caillassage_Non_Touchant: data.caillassageNonTouchant?.toString() || '',
      $Refus_Obtemperer_Avec_Interpellation: data.refusAvecInterp?.toString() || '',
      Refus_Obtemperer_Sans_Interpellation: data.refusSansInterp?.toString() || '',
      Obstacle_Entrave_a_la_circulation_: data.obstacle?.toString() || '',
      Feu_Habitation_Commerce: data.feuHabitation?.toString() || '',
      Feu_Voitures: data.feuVoitures?.toString() || '',
      Feu_Autres: data.feuAutres?.toString() || '',
      PAPAAF_Touchants: data.papafTouchant?.toString() || '',
      PAPAAF_Non_Touchants: data.papafNonTouchant?.toString() || '',
      MP7: data.grenMp7?.toString() || '',
      CM6: data.grenCm6?.toString() || '',
      GENL_DMP: data.grenGenlDmp?.toString() || '',
      GM2L: data.grenGm2l?.toString() || '',
      GL304: data.grenGl304?.toString() || '',
      LBD_40: data.munLbd40?.toString() || '',
      c9_mm: data.mun9mm?.toString() || '',
      c5_56_mm: data.mun556?.toString() || '',
      c7_62_mm: data.mun762?.toString() || '',
      Commentaire: data.commentairePam || ''
    }

    const body = { records: [{ fields: gristData }] }

    try {
      const response = await fetch(
        `${this.GRIST_BASE_URL}/api/docs/${this.GRIST_DOC_ID}/tables/CRFM/records`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        }
      )

      if (response.ok) {
        console.warn('✅ CRFM créé:', await response.json())
        this.clearDraft('CRFM')
        return { success: true, message: '✅ Enregistrement CRFM créé dans Grist' }
      }
      else {
        const errorText = await response.text()
        throw new Error(`Erreur ${response.status}: ${errorText}`)
      }
    }
    catch (error) {
      console.error('❌ Erreur GRIST CRFM:', error)
      return { success: false, message: `❌ Erreur: ${error}` }
    }
  }
}

export const gristService = new GristService()
