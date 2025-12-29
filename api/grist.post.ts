// api/grist.post.ts - CRFM + CRCA - NOMS EXACTS GRIST
import process from 'node:process'

export default async function handler (req: any, res: any) {
  try {
    console.warn('🔍 API GRIST - START')

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode POST requise' })
    }

    const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const record = parsedBody.records?.[0] || parsedBody
    if (!record) {
      return res.status(400).json({ error: 'Aucun record trouvé' })
    }

    console.warn('✅ Record extrait:', record)

    const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    if (!GRIST_API_KEY) {
      return res.status(500).json({ error: 'GRIST_API_KEY manquante' })
    }

    const tableName = parsedBody.table || 'CRFM'
    console.warn('📊 Table cible:', tableName)

    let gristFields

    // 🎯 CRFM - COMPLÈT (exemple précédent)
    if (tableName === 'CRFM') {
      gristFields = {
        Date: record.date || '',
        Secteur: record.secteur || '',
        Mission: record.mission || '',
        Horaires: record.horaire || '',
        VL_Engages: Number(record.vlEngages) || 0,
        Effectifs: Number(record.effectifs) || 0,
        Nbr_OAD: Number(record.nbOad) || 0,
        Nbr_CTRL_VL: Number(record.controlesVl) || 0,
        Nbr_CTRL_Personne: Number(record.controlesPersonne) || 0,
        Nbr_Intervention_CORG_CIC: Number(record.nbInterCorgCic) || 0,
        Nbr_Intervention_Initiative: Number(record.nbInterInitiative) || 0,
        FRM: Number(record.rensFrm) || 0,
        FRS: Number(record.rensFrs) || 0,
        Cannabis: Number(record.stupCannabis) || 0,
        Plant_Cannabis: Number(record.stupPlant) || 0,
        Autres: Number(record.stupAutres) || 0,
        Precision_STUP: record.stupAutres || '',
        TA: Number(record.TA || record.infraTa) || 0,
        Delits: Number(record.Delits || record.infraDelits) || 0,
        Interpellation_ZGN: Number(record.Interpellation_ZGN || record.interpZgn) || 0,
        Interpellation_ZPN: Number(record.Interpellation_ZPN || record.interpZpn) || 0,
        Caillassage_Touchant: Number(record.caillassageTouchant) || 0,
        Caillassage_Non_Touchant: Number(record.caillassageNonTouchant) || 0,
        Refus_Obtemperer_Avec_Interpellation: Number(record.refusAvecInterp) || 0,
        Refus_Obtemperer_Sans_Interpellation: Number(record.refusSansInterp) || 0,
        Obstacle_Entrave_a_la_circulation_: Number(record.obstacle) || 0,
        Feu_Habitation_Commerce: Number(record.feuHabitation) || 0,
        Feu_Voitures: Number(record.feuVoitures) || 0,
        Feu_Autres: Number(record.feuAutres) || 0,
        PAPAAF_Touchants: Number(record.papafTouchant) || 0,
        PAPAAF_Non_Touchants: Number(record.papafNonTouchant) || 0,
        MP7: Number(record.grenMp7) || 0,
        CM6: Number(record.grenCm6) || 0,
        GENL_DMP: Number(record.grenGenlDmp) || 0,
        GM2L: Number(record.grenGm2l) || 0,
        GL304: Number(record.grenGl304) || 0,
        LBD_40: Number(record.munLbd40) || 0,
        c9_mm: Number(record.mun9mm) || 0,
        c5_56_mm: Number(record.mun556) || 0,
        c7_62_mm: Number(record.mun762) || 0,
        Commentaire: record.commentairePam || ''
      }
    }
    // 🎯 CRCA - NOMS EXACTS (votre curl exemple)
    else if (tableName === 'CRCA') {
      gristFields = {
        Indic_Patrouille: record.indicPatrouille || '',
        Intervention: record.intervention || '',
        Secteur: record.secteur || '',
        Nature_Intervention: record.natureIntervention || '',
        Heure_debut_Intervention: record.heureDebut || '',
        Heure_Fin_Intervention: record.heureFin || '',
        Lieu: record.lieu || '',
        Resume_Intervention: record.resumeIntervention || '',
        PAM: record.pam || '',
        // Traite exclu comme demandé
        Personnel: record.personnel || '',
        Armement: record.armement || '',
        Materiel: record.materiel || ''
      }
    }
    else {
      return res.status(400).json({ error: 'Table: CRCA ou CRFM requis' })
    }

    const gristData = { records: [{ fields: gristFields }] }
    console.warn('📤 Envoi GRIST:', tableName, gristFields)

    const response = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/tables/${tableName}/records/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GRIST_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gristData)
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ GRIST ERROR:', response.status, text.substring(0, 300))
      return res.status(response.status).json({
        error: `Grist ${response.status}`,
        details: text.substring(0, 500),
        table: tableName,
        sent: gristData
      })
    }

    const result = await response.json()
    console.warn('✅ SUCCÈS GRIST:', result)

    return res.status(200).json({
      success: true,
      message: `${tableName} enregistré !`,
      table: tableName,
      inserted: result.ids
    })
  }
  catch (error) {
    console.error('❌ CRASH:', error)
    return res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    })
  }
}
