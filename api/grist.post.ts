// api/grist.post.ts - CRCA + CRFM COMPLET
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

type GristField = string
type RecordFields = Record<GristField, string>
interface FrontendRecord { [key: string]: any }

const CRCA_FIELDS: GristField[] = [
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
]

const CRFM_FIELDS: GristField[] = [
  'Date',
  'Horaire',
  'Secteur',
  'Mission',
  'VL_engagés',
  'Effectifs',
  'nbOad',
  'controlesVl',
  'controlesPersonne',
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
  'stupCannabis',
  'stupPlant',
  'stupAutres',
  'infraTa',
  'infraDelits',
  'interpZgn',
  'interpZpn',
  'nbInterCorgCic',
  'nbInterInitiative',
  'rensFrm',
  'rensFrs',
  'commentairePam'
]

const TABLE_FIELDS: Record<string, GristField[]> = {
  CRCA: CRCA_FIELDS,
  CRFM: CRFM_FIELDS
}

export async function POST (request: Request) {
  try {
    const body = await request.json()

    // eslint-disable-next-line no-console
    console.log('🧪 GRIST API BODY:', JSON.stringify(body, null, 2))

    if (body.table && Array.isArray(body.records) && TABLE_FIELDS[body.table]) {
      const { table, records } = body
      const fields = TABLE_FIELDS[table]

      // ✅ FILTRER colonnes table spécifique
      const validRecords: { fields: RecordFields }[] = records.map((record: FrontendRecord) => {
        const validFields: RecordFields = {}
        fields.forEach((field: GristField) => {
          const value = record[field]
          if (value !== undefined && value !== null) {
            validFields[field] = Array.isArray(value) ? value.join(', ') : String(value)
          }
        })
        return { fields: validFields }
      })

      // eslint-disable-next-line no-console
      console.log(`🚀 ${validRecords.length} lignes → Table ${table}`)

      const gristResponse = await fetch(
        `${GRIST_BASE_URL}/api/docs/${GRIST_DOC_ID}/tables/${table}/records`,
        {
          method: 'POST',
          headers: {
            // eslint-disable-next-line node/prefer-global/process
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

      console.error('❌ GRIST ERROR:', gristError)
      throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Table CRCA/CRFM uniquement'
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
