// api/grist.post.ts - CRCA + CRFM - ESLint OK - TypeScript Fixed
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

type GristField = string
type RecordFields = Record<GristField, string>

const TABLE_FIELDS: Record<string, { grist: GristField[], frontend: string[] }> = {
  CRCA: {
    grist: [
      'Indic_Patrouille',
      'Intervention',
      'Secteur',
      'Nature_Intervention',
      'Heure_debut_Intervention',
      'Heure_Fin_Intervention',
      'Lieu',
      'Resume_Intervention',
      'PAM',
      'Personnel',
      'Armement',
      'Materiel'
    ],
    frontend: [
      'indicatifs',
      'intervention',
      'secteur',
      'natureIntervention',
      'heureDebut',
      'heureFin',
      'lieu',
      'resume',
      'pam',
      'personnel',
      'armement',
      'materiel'
    ]
  },
  CRFM: {
    grist: [
      'Date',
      'Secteur',
      'Mission',
      'Horaires',
      'VL_Engages',
      'Effectifs',
      'Nbr_OAD',
      'Nbr_CTRL_VL',
      'Nbr_CTRL_Personne',
      'Nbr_Intervention_CORG_CIC',
      'Nbr_Intervention_Initiative',
      'FRM',
      'FRS',
      'Cannabis',
      'Plant_Cannabis',
      'Autres',
      'Precision_STUP',
      'TA',
      'Delits',
      'Interpellation_ZGN',
      'Interpellation_ZPN',
      'Caillassage_Touchant',
      'Caillassage_Non_Touchant',
      'Refus_Obtemperer_Avec_Interpellation',
      'Refus_Obtemperer_Sans_Interpellation',
      'Obstacle_Entrave_a_la_circulation_',
      'Feu_Habitation_Commerce',
      'Feu_Voitures',
      'Feu_Autres',
      'PAPAAF_Touchants',
      'PAPAAF_Non_Touchants',
      'MP7',
      'CM6',
      'GENL_DMP',
      'GM2L',
      'GL304',
      'LBD_40',
      'c9_mm',
      'c5_56_mm',
      'c7_62_mm',
      'Commentaire'
    ],
    frontend: [
      'date',
      'secteur',
      'mission',
      'horaire',
      'vlEngages',
      'effectifs',
      'nbOad',
      'controlesVl',
      'controlesPersonne',
      'nbInterCorgCic',
      'nbInterInitiative',
      'rensFrm',
      'rensFrs',
      'stupCannabis',
      'stupPlant',
      'stupAutres',
      'precisionStup',
      'infraTa',
      'infraDelits',
      'interpZgn',
      'interpZpn',
      'caillassageTouchant',
      'caillassageNonTouchant',
      'refusAvecInterp',
      'refusSansInterp',
      'obstacle',
      'feuHabitation',
      'feuVoitures',
      'feuAutres',
      'papafTouchant',
      'papafNonTouchant',
      'grenMp7',
      'grenCm6',
      'grenGenlDmp',
      'grenGm2l',
      'grenGl304',
      'munLbd40',
      'mun9mm',
      'mun556',
      'mun762',
      'commentairePam'
    ]
  }
}

// Types stricts pour validation
interface ValidChoices {
  CRCA: {
    Secteur: readonly ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']
    Intervention: readonly ['INITIATIVE', 'CIC']
    PAM: readonly ['PAM RAS', 'PAM non RAS']
  }
  CRFM: {
    Secteur: readonly ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA']
    Mission: readonly ['CTRZ', 'OAD', 'MO/RO', 'SECURISATION', 'RI']
    Horaires: readonly ['6h - 14h', '14h - 22h', '22h - 6h']
  }
}

const VALID_CHOICES: ValidChoices = {
  CRCA: {
    Secteur: ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
    Intervention: ['INITIATIVE', 'CIC'],
    PAM: ['PAM RAS', 'PAM non RAS']
  },
  CRFM: {
    Secteur: ['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA'],
    Mission: ['CTRZ', 'OAD', 'MO/RO', 'SECURISATION', 'RI'],
    Horaires: ['6h - 14h', '14h - 22h', '22h - 6h']
  }
} as const

async function retryFetch (url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options)
    if (response.ok || ![429, 500, 502, 503, 504].includes(response.status)) {
      return response
    }
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
  }
  throw new Error('Max retries exceeded')
}

export async function POST (request: Request) {
  try {
    const body = await request.json()
    const { table, records } = body as { table: string, records: Record<string, any>[] }

    // Validation stricte
    if (!['CRCA', 'CRFM'].includes(table) || !Array.isArray(records)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Format: {table: "CRCA|CRFM", records: []}' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (records.length === 0) {
      return new Response(
        JSON.stringify({ success: true, table, message: 'Aucune donnée à envoyer', recordsAdded: 0 }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const tableConfig = TABLE_FIELDS[table as keyof typeof TABLE_FIELDS]
    if (!tableConfig) {
      return new Response(
        JSON.stringify({ success: false, error: 'Table inconnue' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { grist, frontend } = tableConfig
    const validRecords = records.map((record, index) => {
      const validFields: RecordFields = {}

      grist.forEach((gristField, idx) => {
        const frontendField = frontend[idx]
        const value = record[frontendField]

        if (value !== undefined && value !== null && value !== '') {
          const stringValue = Array.isArray(value) ? value.join(', ') : String(value)

          // Validation choix typée
          const choices = (VALID_CHOICES as any)[table][gristField]
          if (choices && choices.includes(stringValue)) {
            validFields[gristField] = stringValue
          }
          else if (stringValue.trim()) {
            validFields[gristField] = stringValue
          }
        }
      })

      if (Object.keys(validFields).length === 0) {
        console.warn(`⚠️ Record ${index} ignoré: champs vides`)
      }

      return { fields: validFields }
    }).filter(record => Object.keys(record.fields).length > 0)

    console.warn(`🚀 ${validRecords.length}/${records.length} lignes → Table ${table}`)

    if (validRecords.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          table,
          error: 'Aucune donnée valide à envoyer',
          ignored: records.length
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Import process pour ESLint
    const process = await import('node:process')

    const gristResponse = await retryFetch(
      `${GRIST_BASE_URL}/api/docs/${GRIST_DOC_ID}/tables/${table}/records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GRIST_API_KEY!}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ records: validRecords })
      }
    )

    if (gristResponse.ok) {
      const result = await gristResponse.json()
      return new Response(
        JSON.stringify({
          success: true,
          table,
          message: `✅ ${table} OK ! ${validRecords.length} lignes ajoutées`,
          recordsAdded: validRecords.length,
          gristRecordIds: result.recordIds
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const gristError = await gristResponse.text()
    console.error(`❌ GRIST ${table} [${gristResponse.status}]:`, gristError)
    throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ GRIST API ERROR:', errorMessage)

    const process = await import('node:process')
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        hint: process.env.NODE_ENV === 'development'
          ? 'Vérifiez GRIST_API_KEY et mappings'
          : 'Contactez l\'administrateur'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
