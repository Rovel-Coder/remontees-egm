// api/grist.post.ts - VERSION FINALE - ESLINT OK
import process from 'node:process'

export default async function handler (req: any, res: any) {
  try {
    console.warn('🔍 API GRIST - START')

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode POST requise' })
    }

    // ✅ ESLint: const au lieu de let
    const parsedBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const record = parsedBody.records?.[0] || parsedBody
    if (!record) {
      return res.status(400).json({ error: 'Aucun record trouvé' })
    }

    console.warn('✅ Record extrait:', record)

    const GRIST_DOC_ID = 'o-remontes'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    if (!GRIST_API_KEY) {
      return res.status(500).json({ error: 'GRIST_API_KEY manquante' })
    }

    const tableName = parsedBody.table || 'CRFM'
    console.warn('📊 Table cible:', tableName)

    // 🎯 MAPPING CRFM → FORMAT GRIST "fields"
    let gristFields // muté selon table
    if (tableName === 'CRFM') {
      gristFields = {
        date: record.date || '',
        horaire: record.horaire || '',
        secteur: record.secteur || '',
        mission: record.mission || '',
        vl_engages: Number(record.vlEngages) || 0,
        effectifs: Number(record.effectifs) || 0,
        nb_oad: Number(record.nbOad) || 0,
        controles_vl: Number(record.controlesVl) || 0,
        controles_personne: Number(record.controlesPersonne) || 0,
        caillassage_touchant: Number(record.caillassageTouchant) || 0,
        caillassage_non_touchant: Number(record.caillassageNonTouchant) || 0,
        refus_avec_interp: Number(record.refusAvecInterp) || 0,
        refus_sans_interp: Number(record.refusSansInterp) || 0,
        obstacle: Number(record.obstacle) || 0,
        feu_habitation: Number(record.feuHabitation) || 0,
        feu_voitures: Number(record.feuVoitures) || 0,
        feu_autres: Number(record.feuAutres) || 0,
        papaf_touchant: Number(record.papafTouchant) || 0,
        papaf_non_touchant: Number(record.papafNonTouchant) || 0,
        gren_mp7: Number(record.grenMp7) || 0,
        gren_cm6: Number(record.grenCm6) || 0,
        gren_genl_dmp: Number(record.grenGenlDmp) || 0,
        gren_gm2l: Number(record.grenGm2l) || 0,
        gren_gl304: Number(record.grenGl304) || 0,
        mun_lbd40: Number(record.munLbd40) || 0,
        mun_9mm: Number(record.mun9mm) || 0,
        mun_556: Number(record.mun556) || 0,
        mun_762: Number(record.mun762) || 0,
        stup_cannabis: Number(record.stupCannabis) || 0,
        stup_plant: Number(record.stupPlant) || 0,
        stup_autres: record.stupAutres || '',
        infra_ta: Number(record.TA) || 0,
        infra_delits: Number(record.Delits) || 0,
        interp_zgn: Number(record.Interpellation_ZGN) || 0,
        interp_zpn: Number(record.Interpellation_ZPN) || 0,
        nb_inter_corg_cic: Number(record.nbInterCorgCic) || 0,
        nb_inter_initiative: Number(record.nbInterInitiative) || 0,
        rens_frm: Number(record.rensFrm) || 0,
        rens_frs: Number(record.rensFrs) || 0,
        commentaire_pam: record.commentairePam || ''
      }
    }
    // 🎯 MAPPING CRCA
    else if (tableName === 'CRCA') {
      gristFields = {
        'secteur': record.secteur || '',
        'Indic Patrouille': record.indicPatrouille || '',
        'intervention': record.intervention || '',
        'Nature Intervention': record.natureIntervention || '',
        'Heure dbut Intervention': record.heureDebut || '',
        'Heure Fin Intervention': record.heureFin || '',
        'Lieu': record.lieu || '',
        'Rsum Intervention': record.resumeIntervention || '',
        'PAM': record.pam || '',
        'Personnel': record.personnel || '',
        'Armement': record.armement || '',
        'Materiel': record.materiel || ''
      }
    }
    else {
      return res.status(400).json({ error: 'Table: CRCA ou CRFM requis' })
    }

    // ✅ FORMAT GRIST OFFICIEL
    const gristData = {
      records: [{ fields: gristFields }]
    }

    console.warn('📤 Envoi GRIST FORMAT:', gristData)

    const response = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/tables/${tableName}/records/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GRIST_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gristData)
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error('❌ GRIST ERROR:', response.status, text.substring(0, 300))
      return res.status(response.status).json({
        error: `Grist ${response.status}`,
        details: text.substring(0, 500),
        sent: gristData
      })
    }

    const result = await response.json()
    console.warn('✅ SUCCÈS GRIST:', result)

    return res.status(200).json({
      success: true,
      message: `${tableName} enregistré !`,
      table: tableName,
      inserted: result.ids || result.id || 1
    })
  }
  catch (error) {
    console.error('❌ CRASH:', error)
    return res.status(500).json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    })
  }
}
