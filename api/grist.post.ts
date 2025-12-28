// api/grist.post.ts - CRCA + CRFM - ESLint OK
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

type GristField = string
type RecordFields = Record<GristField, string>

const TABLE_FIELDS: Record<string, { grist: GristField[], frontend: string[] }> = {
  CRCA: {
    grist: [
      'Secteur',
      'Indic_Patrouille',
      'Intervention',
      'Nature_Intervention',
      'Heure_debut_Intervention',
      'Heure_Fin_Intervention',
      'PAM',
      'Lieu',
      'Resume_Intervention',
      'Personnel',
      'Armement',
      'Materiel'
    ],
    frontend: [
      'secteur',
      'indicatifs',
      'intervention',
      'natureIntervention',
      'heureDebut',
      'heureFin',
      'pam',
      'lieu',
      'resume',
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
      'Effectifs',
      'VL_Engages',
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
      '$Refus_Obtemperer_Avec_Interpellation',
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
      'effectifs',
      'vlEngages',
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
      'stupAutres',
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

export async function POST (request: Request) {
  try {
    const body = await request.json()

    console.warn('🧪 GRIST API BODY:', JSON.stringify(body, null, 2))

    if (body.table && body.table in TABLE_FIELDS && Array.isArray(body.records)) {
      const { table, records } = body
      const { grist, frontend } = TABLE_FIELDS[table]

      const validRecords = records.map((record: Record<string, any>) => {
        const validFields: RecordFields = {}
        grist.forEach((gristField: GristField, index: number) => {
          const frontendField = frontend[index]
          const value = record[frontendField]
          if (value !== undefined && value !== null && value !== '') {
            validFields[gristField] = Array.isArray(value) ? value.join(', ') : String(value)
          }
        })
        return { fields: validFields }
      })

      console.warn(`🚀 ${validRecords.length} lignes → Table ${table}`)

      const process = await import('node:process')
      const gristResponse = await fetch(
        `${GRIST_BASE_URL}/api/docs/${GRIST_DOC_ID}/tables/${table}/records`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.GRIST_API_KEY}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ records: validRecords })
        }
      )

      if (gristResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          table,
          message: `✅ ${table} envoyé ! ${validRecords.length} lignes`,
          recordsAdded: validRecords.length
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const gristError = await gristResponse.text()
      console.error('❌ GRIST RAW ERROR:', gristError)
      throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Table CRCA ou CRFM uniquement'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('❌ GRIST API ERROR:', errorMessage)
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
