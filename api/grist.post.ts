import process from 'node:process'
import { createError, defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = process.env.GRIST_TOKEN

  if (!token) {
    throw createError({ statusCode: 500, statusMessage: 'GRIST_TOKEN missing' })
  }

  try {
    const response = await $fetch('https://grist.numerique.gouv.fr/api/docs/287D12LdHqN4hYBpsm52fo/tables/CRCA/records', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body
    })

    return response
  }
  catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Grist API error'
    })
  }
})
