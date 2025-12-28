// api/grist.post.ts - Grist numerique.gouv.fr + TypeScript parfait
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

// ✅ COLONNES GRIST CRCA EXACTES
type GristField = string
type RecordFields = Record<GristField, string>
interface FrontendRecord { [key: string]: string | string[] | undefined | null }

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

export async function POST (request: Request) {
  try {
    const body = await request.json()

    // eslint-disable-next-line no-console
    console.log('🧪 GRIST API BODY:', JSON.stringify(body, null, 2))

    if (body.table === 'CRCA' && Array.isArray(body.records)) {
      const records: FrontendRecord[] = body.records

      // ✅ FILTRER + TYPPER colonnes existantes
      const validRecords: { fields: RecordFields }[] = records.map((record: FrontendRecord) => {
        const validFields: RecordFields = {}
        CRCA_FIELDS.forEach((field: GristField) => {
          const value = record[field]
          if (value !== undefined && value !== null) {
            validFields[field] = Array.isArray(value) ? value.join(', ') : String(value)
          }
        })
        return { fields: validFields }
      })

      // eslint-disable-next-line no-console
      console.log('✅ COLONNES FILTRÉES:', validRecords)

      const gristResponse = await fetch(
        `${GRIST_BASE_URL}/api/docs/${GRIST_DOC_ID}/tables/CRCA/records`,
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
          table: 'CRCA',
          message: `✅ CRCA envoyé ! ${validRecords.length} lignes`,
          recordsAdded: validRecords.length
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const gristError = await gristResponse.text()

      console.error('❌ GRIST ERROR:', gristError)
      throw new Error(`Grist CRCA KO: ${gristResponse.status}`)
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Table CRCA uniquement'
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
