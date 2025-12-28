import type { CrcaModel, CrfmModel } from '@/types' // 👈 AJOUTEZ CETTE LIGNE

const GRIST_DOC_ID = import.meta.env.VITE_GRIST_DOC_ID as string
const GRIST_API_KEY = import.meta.env.VITE_GRIST_API_KEY as string
const GRIST_BASE_URL = `https://docs.getgrist.com/${GRIST_DOC_ID}/api/v1`

class GristService {
  private headers = new Headers({
    'Authorization': `Bearer ${GRIST_API_KEY}`,
    'Content-Type': 'application/json'
  })

  async init (): Promise<void> {
    if (!GRIST_DOC_ID || !GRIST_API_KEY) {
      throw new Error('VITE_GRIST_DOC_ID ou VITE_GRIST_API_KEY manquant dans .env')
    }
  }

  async submitCrca (data: Partial<CrcaModel>): Promise<any> {
    const record = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const response = await fetch(`${GRIST_BASE_URL}/tables/CRCA/records/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify([record])
    })

    if (!response.ok) {
      throw new Error(`Grist CRCA ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  async submitCrfm (data: Partial<CrfmModel>): Promise<any> {
    const record = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const response = await fetch(`${GRIST_BASE_URL}/tables/CRFM/records/`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify([record])
    })

    if (!response.ok) {
      throw new Error(`Grist CRFM ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  }

  async loadDrafts (): Promise<{ crca: any[] | null, crfm: any[] | null }> {
    try {
      const [crcaRes, crfmRes] = await Promise.all([
        fetch(`${GRIST_BASE_URL}/tables/CRCA/records/`, { headers: this.headers }),
        fetch(`${GRIST_BASE_URL}/tables/CRFM/records/`, { headers: this.headers })
      ])

      const crcaData = crcaRes.ok ? await crcaRes.json() : null
      const crfmData = crfmRes.ok ? await crfmRes.json() : null

      return {
        crca: crcaData?.rows?.[0] || null,
        crfm: crfmData?.rows?.[0] || null
      }
    }
    catch {
      return { crca: null, crfm: null }
    }
  }
}

export const gristService = new GristService()
