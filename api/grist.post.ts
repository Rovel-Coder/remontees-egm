// api/grist.post.ts - VERCEL + 100% CLEAN
import type { IncomingMessage, ServerResponse } from 'node:http'

export default async function handler (
  req: IncomingMessage & { body?: any },
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body = ''

  // eslint-disable-next-line node/prefer-global/buffer
  req.on('data', (chunk: Buffer) => {
    body += chunk.toString()
  })

  req.on('end', async () => {
    try {
      const data = JSON.parse(body)
      // eslint-disable-next-line node/prefer-global/process
      const token = process.env.GRIST_TOKEN

      console.warn('📥 Body reçu')
      console.warn('🔑 Token OK:', !!token)

      if (!token) {
        console.error('❌ GRIST_TOKEN manquant!')
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'GRIST_TOKEN missing' }))
        return
      }

      const firstRecord = Array.isArray(data) ? data[0] : data
      const tableName = firstRecord.intervention || firstRecord.horaire ? 'CRCA' : 'CRFM'

      console.warn('📊 Table:', tableName)

      // ✅ GRIST FORMAT CORRECT
      const gristPayload = {
        records: Array.isArray(data) ? data : [data]
      }

      const response = await fetch(
        `https://grist.numerique.gouv.fr/api/docs/287D12LdHqN4hYBpsm52fo/tables/${tableName}/records`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(gristPayload)
        }
      )

      console.warn('🌐 Grist status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Grist error:', response.status, errorText)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: `Grist ${response.status}` }))
        return
      }

      const _result = await response.json()
      console.warn('✅ Grist succès!')

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        success: true,
        message: `✅ ${tableName} envoyé dans Grist !`,
        table: tableName
      }))
    }
    catch (parseError) {
      console.error('❌ JSON parse error:', parseError)
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
    }
  })
}
