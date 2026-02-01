// api/grist.get.ts

import process from 'node:process'
import type { IncomingMessage, ServerResponse } from 'node:http'

const HTTP_METHOD_NOT_ALLOWED = 405
const HTTP_INTERNAL_SERVER_ERROR = 500
const HTTP_OK = 200
const HTTP_BAD_REQUEST = 400

const CONFIG = {
    GRIST_SERVER: process.env.GRIST_SERVER || 'https://grist.numerique.gouv.fr',
    GRIST_DOC_ID: process.env.GRIST_DOC_ID || '287D12LdHqN4hYBpsm52fo',
    GRIST_API_KEY: process.env.GRIST_API_KEY
}

export default async function handler(
    req: IncomingMessage & { query?: Record<string, string> },
    res: ServerResponse
) {
    if (req.method !== 'GET') {
        res.writeHead(HTTP_METHOD_NOT_ALLOWED, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Méthode GET requise' }))
        return
    }

    // Extraire le paramètre 'table' de l'URL
    const url = new URL(req.url || '', `http://${req.headers.host}`)
    const table = url.searchParams.get('table') || 'Escadron'

    if (!CONFIG.GRIST_API_KEY) {
        res.writeHead(HTTP_INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'GRIST_API_KEY manquante' }))
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
            res.writeHead(response.status, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: `Grist ${response.status}` }))
            return
        }

        const data = await response.json()

        // Ajouter les headers CORS pour permettre l'accès depuis le frontend
        res.writeHead(HTTP_OK, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        })
        res.end(JSON.stringify(data))
    } catch (error: unknown) {
        console.error('FETCH ERROR', error)
        res.writeHead(HTTP_INTERNAL_SERVER_ERROR, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
            error: (error as Error).message || 'Erreur réseau',
            timestamp: new Date().toISOString()
        }))
    }
}
