// api/grist.ts (ESLint parfait)
import process from 'node:process'

const GRIST_DOC_ID = process.env.GRIST_DOC_ID!
const GRIST_API_KEY = process.env.GRIST_API_KEY!

export default async function handler (req: Request) {
  try {
    const { type, payload } = await req.json()

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

    const successResponse = {
      success: true,
      message: `${type} envoyé Grist !`
    }

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }
  catch (error: any) {
    const errorResponse = {
      success: false,
      message: error.message
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
