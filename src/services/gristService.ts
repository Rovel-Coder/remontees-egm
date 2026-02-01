// src/services/gristServices.ts

import process from 'node:process'
import type { IncomingMessage, ServerResponse } from 'node:http'

type RecordData = Record<string, unknown>
type GristFields = Record<string, string | number | boolean | null>

const HTTP_METHOD_NOT_ALLOWED = 405
const HTTP_BAD_REQUEST = 400
const HTTP_INTERNAL_SERVER_ERROR = 500
const HTTP_OK = 200

export const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: HTTP_METHOD_NOT_ALLOWED,
  BAD_REQUEST: HTTP_BAD_REQUEST,
  INTERNAL_SERVER_ERROR: HTTP_INTERNAL_SERVER_ERROR,
  OK: HTTP_OK
} as const

const MAX_ERROR_DETAILS_LENGTH = 300
const MAX_LOG_LENGTH = 500

const CONFIG = {
  GRIST_SERVER: process.env.GRIST_SERVER || 'https://grist.numerique.gouv.fr',
  GRIST_DOC_ID: process.env.GRIST_DOC_ID || '287D12LdHqN4hYBpsm52fo',
  GRIST_API_KEY: process.env.GRIST_API_KEY,
  CRFM_TABLE: process.env.GRIST_TABLE_CRFM || 'CRFM',
  CRCA_TABLE: process.env.GRIST_TABLE_CRCA || 'CRCA'
}

const isDev = process.env.NODE_ENV === 'development'

const logWarn = (...args: unknown[]) => {
  if (isDev) process.stdout.write(`[GRIST] ${JSON.stringify(args).slice(0, MAX_LOG_LENGTH)}\n`)
}
const logError = (...args: unknown[]) => {
  if (isDev) process.stderr.write(`[GRIST ERROR] ${JSON.stringify(args).slice(0, MAX_LOG_LENGTH)}\n`)
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

export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse
) {
  logWarn('START')

  if (req.method !== 'POST') {
    res.writeHead(HTTP_STATUS.METHOD_NOT_ALLOWED, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Méthode POST requise' }))
    return
  }

  let parsedBody: any
  if (typeof req.body === 'string') {
    parsedBody = JSON.parse(req.body)
  } else {
    parsedBody = req.body
  }

  let record: RecordData
  if (parsedBody && parsedBody.records && parsedBody.records[0] && parsedBody.records[0].fields) {
    record = parsedBody.records[0].fields
  } else if (parsedBody) {
    record = parsedBody
  } else {
    res.writeHead(HTTP_STATUS.BAD_REQUEST, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Aucun record trouvé' }))
    return
  }

  logWarn('Record extrait', record)

  if (!CONFIG.GRIST_API_KEY) {
    res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'GRIST_API_KEY manquante' }))
    return
  }

  const tableName = parsedBody.table || CONFIG.CRFM_TABLE
  logWarn('Table cible', tableName)

  let gristFields: GristFields
  if (tableName === CONFIG.CRFM_TABLE) {
    gristFields = mapCrfmToGrist(record)
  } else if (tableName === CONFIG.CRCA_TABLE) {
    gristFields = mapCrcaToGrist(record)
  } else {
    res.writeHead(HTTP_STATUS.BAD_REQUEST, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: `Table ${tableName} non supportée` }))
    return
  }

  const gristData = { records: [{ fields: gristFields }] }
  logWarn('Envoi GRIST', tableName, gristFields)

  const url = `${CONFIG.GRIST_SERVER}/api/docs/${CONFIG.GRIST_DOC_ID}/tables/${tableName}/records`
  logWarn('URL', url)

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
      logError('GRIST ERROR', response.status, text.slice(0, MAX_ERROR_DETAILS_LENGTH))
      res.writeHead(response.status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: `Grist ${response.status}` }))
      return
    }

    const result = await response.json()
    res.writeHead(HTTP_STATUS.OK, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: true, inserted: result.ids }))
  } catch (error: unknown) {
    logError('FETCH ERROR', error)
    res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({
      error: (error as Error).message || 'Erreur réseau',
      timestamp: new Date().toISOString()
    }))
  }
}
