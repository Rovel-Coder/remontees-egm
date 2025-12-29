// api/grist.post.ts - DIAGNOSTIC API KEY + TABLES
import process from 'node:process'

export default async function handler (req: any, res: any) {
  try {
    const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    // 🔍 TEST 1: DOC ACCESS
    console.warn('🔍 TEST DOC ACCESS...')
    const docResponse = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/`,
      { headers: { Authorization: `Bearer ${GRIST_API_KEY}` } }
    )
    const docText = await docResponse.text()
    console.warn('📋 DOC ACCESS:', docResponse.status, docText.substring(0, 300))

    // 🔍 TEST 2: LIST TABLES
    console.warn('🔍 TEST LIST TABLES...')
    const tablesResponse = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/tables/`,
      { headers: { Authorization: `Bearer ${GRIST_API_KEY}` } }
    )
    const tablesText = await tablesResponse.text()
    console.warn('📋 TABLES LIST:', tablesResponse.status, tablesText.substring(0, 1000))

    // 🔍 TEST 3: CRFM SPECIFIC
    console.warn('🔍 TEST CRFM TABLE...')
    const cfmResponse = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/tables/CRFM/`,
      { headers: { Authorization: `Bearer ${GRIST_API_KEY}` } }
    )
    const cfmText = await cfmResponse.text()
    console.warn('📋 CRFM TABLE:', cfmResponse.status, cfmText.substring(0, 500))

    return res.status(200).json({
      success: true,
      diagnostic: {
        docAccess: docResponse.status,
        tablesList: tablesResponse.status,
        cfmTable: cfmResponse.status,
        apiKeyLength: GRIST_API_KEY?.length || 0,
        docId: GRIST_DOC_ID
      },
      logs: {
        doc: docText.substring(0, 500),
        tables: tablesText.substring(0, 500),
        cfm: cfmText.substring(0, 500)
      }
    })
  }
  catch (error) {
    console.error('❌ DIAGNOSTIC ERROR:', error)
    return res.status(500).json({ error: (error as Error).message })
  }
}
