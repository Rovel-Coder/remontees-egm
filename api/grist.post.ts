// api/grist.post.ts - CRCA UNIQUEMENT - 0 erreurs
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
  }
  // ✅ CRFM supprimé → gristService.ts
}

export async function POST (request: Request) {
  try {
    const body = await request.json()

    // eslint-disable-next-line no-console
    console.log('🧪 GRIST API BODY (CRCA):', JSON.stringify(body, null, 2))

    // ✅ CRCA UNIQUEMENT
    if (body.table === 'CRCA' && Array.isArray(body.records)) {
      const { table, records } = body
      const { grist, frontend } = TABLE_FIELDS[table]

      // ✅ Mapping typé CRCA
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

      // eslint-disable-next-line no-console
      console.log(`🚀 ${validRecords.length} lignes CRCA → Grist`)

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
      console.error('❌ GRIST RAW ERROR (CRCA):', gristError)
      throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Table CRCA uniquement (CRFM → gristService)'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'

    console.error('❌ GRIST API ERROR (CRCA):', errorMessage)
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
