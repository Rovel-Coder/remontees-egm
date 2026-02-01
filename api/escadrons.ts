// api/escadrons.ts

import type { VercelRequest, VercelResponse } from '@vercel/node'

const CONFIG = {
    GRIST_SERVER: process.env.GRIST_SERVER || 'https://grist.numerique.gouv.fr',
    GRIST_DOC_ID: process.env.GRIST_DOC_ID || '287D12LdHqN4hYBpsm52fo',
    GRIST_API_KEY: process.env.GRIST_API_KEY
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Support CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Méthode GET requise' })
        return
    }

    const { table = 'Escadron' } = req.query

    if (!CONFIG.GRIST_API_KEY) {
        res.status(500).json({ error: 'GRIST_API_KEY manquante' })
        return
    }

    const gristUrl = `${CONFIG.GRIST_SERVER}/api/docs/${CONFIG.GRIST_DOC_ID}/tables/${table}/records`

    try {
        const response = await fetch(gristUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${CONFIG.GRIST_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })

        if (!response.ok) {
            const text = await response.text()
            console.error('GRIST ERROR', response.status, text.slice(0, 300))
            res.status(response.status).json({ error: `Grist ${response.status}` })
            return
        }

        const data = await response.json()
        res.status(200).json(data)
    } catch (error: unknown) {
        console.error('FETCH ERROR', error)
        res.status(500).json({
            error: (error as Error).message || 'Erreur réseau',
            timestamp: new Date().toISOString()
        })
    }
}
