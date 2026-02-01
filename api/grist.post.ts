// api/grist.post.ts


import process from 'node:process'
import type { IncomingMessage, ServerResponse } from 'node:http'

type RecordData = Record<string, unknown>
type GristFields = Record<string, string | number | null>

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
  return { Date: date, Secteur: secteur }
}

function mapCrcaToGrist(record: RecordData): GristFields {
  if (Array.isArray(record.indicatifs)) {
    return { Indic_Patrouille: (record.indicatifs as string[]).join(', ') }
  }

  if (record.indicPatrouille) {
    return { Indic_Patrouille: String(record.indicPatrouille) }
  }

  const indicatifs = record.indicatifs ? String(record.indicatifs) : ''
  return { Indic_Patrouille: indicatifs }
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
