// api/grist.post.ts - Vue 3 + Vercel Serverless
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'

export async function POST (request: Request) {
  try {
    const body = await request.json()

    // eslint-disable-next-line no-console
    console.log('🧪 GRIST API BODY:', JSON.stringify(body, null, 2))

    // FORMAT 1: { table: "CRCA", records: [...] } ← Frontend actuel
    if (body.table && Array.isArray(body.records)) {
      const { table, records } = body

      // eslint-disable-next-line no-console
      console.log(`🚀 Ajout ${records.length} lignes → Table ${table}`)

      // Grist REST API direct - process.env fixé
      const gristResponse = await fetch(`https://getgrist.com/${GRIST_DOC_ID}/api/table/${table}`, {
        method: 'PATCH',
        headers: {
          // eslint-disable-next-line node/prefer-global/process
          'Authorization': `Bearer ${process.env.GRIST_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records })
      })

      if (gristResponse.ok) {
        return new Response(JSON.stringify({
          success: true,
          table,
          message: `✅ ${table} envoyé !`,
          recordsAdded: records.length
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const gristError = await gristResponse.text()

      console.error('❌ GRIST RAW ERROR:', gristError)
      throw new Error(`Grist ${table} KO: ${gristResponse.status}`)
    }

    // FORMAT 2: Array direct (fallback)
    if (Array.isArray(body) && body.length > 0) {
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
      error: 'Format payload invalide'
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
