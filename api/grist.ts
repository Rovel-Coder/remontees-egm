// api/grist.ts (ESLint parfait)
import process from 'node:process'

const GRIST_DOC_ID = process.env.GRIST_DOC_ID!
const GRIST_API_KEY = process.env.GRIST_API_KEY!

export async function POST (request: Request) {
  try {
    const { type, payload } = await request.json()

    const GRIST_BASE_URL = `https://docs.getgrist.com/${GRIST_DOC_ID}/api/v1`
    const record: any = {
      ...payload,
      created_at: new Date().toISOString()
    }

    record.updated_at = new Date().toISOString()

    const url = `${GRIST_BASE_URL}/tables/${type}/records/`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GRIST_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([record])
    })

    if (!response.ok) {
      throw new Error(`Grist ${response.status}`)
    }

    return Response.json({
      success: true,
      message: `${type} envoyé Grist !`
    })
  }
  catch (error: any) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    )
  }
}
