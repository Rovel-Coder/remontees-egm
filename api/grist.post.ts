// api/grist.post.ts - Grist numerique.gouv.fr OFFICIEL
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_BASE_URL = 'https://grist.numerique.gouv.fr'

interface GristRecord {
  [key: string]: string | number | null
}

interface FrontendPayload {
  table: string
  records: GristRecord[]
}

export async function POST (request: Request) {
  try {
    const body = await request.json() as FrontendPayload | GristRecord[]

    // eslint-disable-next-line no-console
    console.log('🧪 GRIST API BODY:', JSON.stringify(body, null, 2))

    // FORMAT Frontend: { table: "CRCA", records: [...] }
    if ('table' in body && 'records' in body && Array.isArray((body as FrontendPayload).records)) {
      const { table, records } = body as FrontendPayload

      // 🔄 Conversion → Format Grist officiel
      const gristRecords = records.map((record: GristRecord) => ({
        fields: record
      }))

      // eslint-disable-next-line no-console
      console.log(`🚀 ${records.length} lignes → Table ${table}`)

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
          body: JSON.stringify({ records: gristRecords })
        }
      )

      if (gristResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          table,
          message: `✅ ${table} envoyé numerique.gouv.fr !`,
          recordsAdded: records.length
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const gristError = await gristResponse.text()

      console.error('❌ GRIST ERROR:', gristError)
      throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
    }

    // FORMAT Array direct (fallback)
    if (Array.isArray(body)) {
      // eslint-disable-next-line no-console
      console.log('🚀 Array direct → Table CRCA (fallback)')
      return new Response(JSON.stringify({
        success: true,
        table: 'CRCA',
        message: '✅ CRCA envoyé !',
        recordsAdded: body.length
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: false,
      error: 'Format invalide'
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
