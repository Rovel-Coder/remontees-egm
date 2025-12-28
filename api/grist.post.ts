import process from 'node:process'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = process.env.GRIST_TOKEN

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GRIST_TOKEN missing'
    })
  }

  try {
    // ✅ Détecte automatiquement la table selon les données
    const firstRecord = Array.isArray(body) ? body[0] : body
    const tableName = firstRecord.intervention || firstRecord.horaire ? 'CRCA' : 'CRFM'

    const response = await $fetch(
      `https://grist.numerique.gouv.fr/api/docs/287D12LdHqN4hYBpsm52fo/tables/${tableName}/records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: Array.isArray(body) ? body : [body]
      }
    )

    return {
      success: true,
      message: `✅ ${tableName} envoyé dans Grist !`,
      table: tableName,
      records: response
    }
  }
  catch (error) {
    console.error('Grist API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Grist API error'
    })
  }
})
