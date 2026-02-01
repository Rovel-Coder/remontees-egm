// api/grist.post.ts

import type { VercelRequest, VercelResponse } from '@vercel/node'

type RecordData = Record<string, unknown>
type GristFields = Record<string, string | number | boolean | null>

const CONFIG = {
  GRIST_SERVER: process.env.GRIST_SERVER || 'https://grist.numerique.gouv.fr',
  GRIST_DOC_ID: process.env.GRIST_DOC_ID || '287D12LdHqN4hYBpsm52fo',
  GRIST_API_KEY: process.env.GRIST_API_KEY,
  CRFM_TABLE: process.env.GRIST_TABLE_CRFM || 'CRFM',
  CRCA_TABLE: process.env.GRIST_TABLE_CRCA || 'CRCA'
}

function mapCrfmToGrist(record: RecordData): GristFields {
  const date = record.date ? String(record.date) : ''
  const secteur = record.secteur ? String(record.secteur) : ''
  const horaire = record.horaire ? String(record.horaire) : ''
  const mission = record.mission ? String(record.mission) : ''
  const escadron = record.escadron ? Number(record.escadron) : null

  return {
    Date: date,
    Secteur: secteur,
    Horaires: horaire,
    Mission: mission,
    EGM: escadron,
    VL_Engages: record.vlEngages ? Number(record.vlEngages) : null,
    Effectifs: record.effectifs ? Number(record.effectifs) : null,
    Nbr_OAD: record.nbOad ? Number(record.nbOad) : null,
    Nbr_CTRL_VL: record.controlesVl ? Number(record.controlesVl) : null,
    Nbr_CTRL_Personne: record.controlesPersonne ? Number(record.controlesPersonne) : null,
    Nbr_Intervention_CORG_CIC: record.nbInterCorgCic ? Number(record.nbInterCorgCic) : null,
    Nbr_Intervention_Initiative: record.nbInterInitiative ? Number(record.nbInterInitiative) : null,
    FRM: record.rensFrm ? Number(record.rensFrm) : null,
    FRS: record.rensFrs ? Number(record.rensFrs) : null,
    Cannabis: record.stupCannabis ? Number(record.stupCannabis) : null,
    Plant_Cannabis: record.stupPlant ? Number(record.stupPlant) : null,
    Autres: record.stupAutres ? Number(record.stupAutres) : null,
    Precision_STUP: record.stupAutresPrecision ? String(record.stupAutresPrecision) : '',
    TA: record.infraTa ? Number(record.infraTa) : null,
    Delits: record.infraDelits ? Number(record.infraDelits) : null,
    Interpellation_ZGN: record.interpZgn ? Number(record.interpZgn) : null,
    Interpellation_ZPN: record.interpZpn ? Number(record.interpZpn) : null,
    Caillassage_Touchant: record.caillassageTouchant ? Number(record.caillassageTouchant) : null,
    Caillassage_Non_Touchant: record.caillassageNonTouchant ? Number(record.caillassageNonTouchant) : null,
    Refus_Obtemperer_Avec_Interpellation: record.refusAvecInterp ? Number(record.refusAvecInterp) : null,
    Refus_Obtemperer_Sans_Interpellation: record.refusSansInterp ? Number(record.refusSansInterp) : null,
    Obstacle_Entrave_a_la_circulation_: record.obstacle ? Number(record.obstacle) : null,
    Feu_Habitation_Commerce: record.feuHabitation ? Number(record.feuHabitation) : null,
    Feu_Voitures: record.feuVoitures ? Number(record.feuVoitures) : null,
    Feu_Autres: record.feuAutres ? Number(record.feuAutres) : null,
    PAPAAF_Touchants: record.papafTouchant ? Number(record.papafTouchant) : null,
    PAPAAF_Non_Touchants: record.papafNonTouchant ? Number(record.papafNonTouchant) : null,
    MP7: record.grenMp7 ? Number(record.grenMp7) : null,
    CM6: record.grenCm6 ? Number(record.grenCm6) : null,
    GENL_DMP: record.grenGenlDmp ? Number(record.grenGenlDmp) : null,
    GM2L: record.grenGm2l ? Number(record.grenGm2l) : null,
    GL304: record.grenGl304 ? Number(record.grenGl304) : null,
    LBD_40: record.munLbd40 ? Number(record.munLbd40) : null,
    c9_mm: record.mun9mm ? Number(record.mun9mm) : null,
    c5_56_mm: record.mun556 ? Number(record.mun556) : null,
    c7_62_mm: record.mun762 ? Number(record.mun762) : null,
    Commentaire: record.commentairePam ? String(record.commentairePam) : '',
    Traite: false
  }
}

function mapCrcaToGrist(record: RecordData): GristFields {
  const egmId = record.egm ? Number(record.egm) : null

  let indicatifsStr = ''
  if (Array.isArray(record.indicatifs)) {
    indicatifsStr = (record.indicatifs as string[]).join(', ')
  } else if (record.indicPatrouille) {
    indicatifsStr = String(record.indicPatrouille)
  } else if (record.indicatifs) {
    indicatifsStr = String(record.indicatifs)
  }

  return {
    EGM: egmId,
    Indic_Patrouille: indicatifsStr,
    Intervention: record.intervention ? String(record.intervention) : '',
    Secteur: record.secteur ? String(record.secteur) : '',
    Nature_Intervention: record.natureIntervention ? String(record.natureIntervention) : '',
    Heure_debut_Intervention: record.heureDebut ? String(record.heureDebut) : '',
    Heure_Fin_Intervention: record.heureFin ? String(record.heureFin) : '',
    Lieu: record.lieu ? String(record.lieu) : '',
    Resume_Intervention: record.resume ? String(record.resume) : '',
    PAM: record.pam ? String(record.pam) : '',
    Personnel: record.personnel ? String(record.personnel) : '',
    Armement: record.armement ? String(record.armement) : '',
    Materiel: record.materiel ? String(record.materiel) : '',
    Traite: false
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode POST requise' })
    return
  }

  const record: RecordData = req.body

  if (!CONFIG.GRIST_API_KEY) {
    res.status(500).json({ error: 'GRIST_API_KEY manquante' })
    return
  }

  const tableName = record.table || CONFIG.CRFM_TABLE
  console.log('Table cible:', tableName, 'Record:', record)

  let gristFields: GristFields
  if (tableName === CONFIG.CRFM_TABLE) {
    gristFields = mapCrfmToGrist(record)
  } else if (tableName === CONFIG.CRCA_TABLE) {
    gristFields = mapCrcaToGrist(record)
  } else {
    res.status(400).json({ error: `Table ${tableName} non supportée` })
    return
  }

  const gristData = { records: [{ fields: gristFields }] }
  console.log('Envoi vers Grist:', gristFields)

  const url = `${CONFIG.GRIST_SERVER}/api/docs/${CONFIG.GRIST_DOC_ID}/tables/${tableName}/records`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.GRIST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gristData)
    })

    if (!response.ok) {
      const text = await response.text()
      console.error('GRIST ERROR', response.status, text)
      res.status(response.status).json({ error: `Grist ${response.status}` })
      return
    }

    const result = await response.json()
    res.status(200).json({ success: true, inserted: result.records })
  } catch (error: unknown) {
    console.error('FETCH ERROR', error)
    res.status(500).json({
      error: (error as Error).message || 'Erreur réseau',
      timestamp: new Date().toISOString()
    })
  }
}
