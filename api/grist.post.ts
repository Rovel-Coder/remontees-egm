// api/grist.post.ts - VERSION DEBUG MAX - CORRIGÉ
import process from 'node:process'

export default async function handler (req: any, res: any) {
  try {
    console.warn('🔍 API GRIST - START')
    console.warn('📋 req.method:', req.method)
    console.warn('📋 req.body type:', typeof req.body)
    console.warn('📋 req.body keys:', Object.keys(req.body || {}))

    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode POST requise' })
    }

    // ✅ Parsing + extraction records
    let data
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body)
    }
    else {
      data = req.body
    }

    const record = data.records?.[0] || data // Support records[] OU direct
    if (!record) {
      return res.status(400).json({ error: 'Aucun record trouvé' })
    }

    console.warn('✅ Record extrait:', record)

    const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    if (!GRIST_API_KEY) {
      return res.status(500).json({ error: 'GRIST_API_KEY manquante' })
    }

    const tableName = data.table || record.table || 'CRFM'
    console.warn('📊 Table cible:', tableName)

    let gristData

    // 🎯 MAPPING CRFM - NOMS FRONTEND → GRIST
    if (tableName === 'CRFM') {
      gristData = [{
        date: record.date || '',
        horaire: record.horaire || record.Horaires || '',
        secteur: record.secteur || record.Secteur || '',
        mission: record.mission || record.Mission || '',
        vl_engages: Number(record.vlEngages || record.vlEngages) || 0,
        effectifs: Number(record.effectifs || record.Effectifs) || 0,
        nb_oad: Number(record.nbOad || record.nbOad) || 0,
        controles_vl: Number(record.controlesVl || record.controlesVl) || 0,
        controles_personne: Number(record.controlesPersonne || record.controlesPersonne) || 0,
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
        infra_ta: Number(record.infraTa || record.TA) || 0,
        infra_delits: Number(record.infraDelits || record.Delits) || 0,
        interp_zgn: Number(record.interpZgn || record.Interpellation_ZGN) || 0,
        interp_zpn: Number(record.interpZpn || record.Interpellation_ZPN) || 0,
        nb_inter_corg_cic: Number(record.nbInterCorgCic) || 0,
        nb_inter_initiative: Number(record.nbInterInitiative) || 0,
        rens_frm: Number(record.rensFrm) || 0,
        rens_frs: Number(record.rensFrs) || 0,
        commentaire_pam: record.commentairePam || record.commentairePam || ''
      }]
    }
    // 🎯 MAPPING CRCA (simplifié)
    else if (tableName === 'CRCA') {
      gristData = [{
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
      }]
    }
    else {
      return res.status(400).json({ error: 'Table: CRCA ou CRFM requis' })
    }

    console.warn('📤 Envoi Grist:', gristData[0])

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

    // ✅ Vérif status avant JSON
    if (!response.ok) {
      const text = await response.text()
      console.error('❌ GRIST ERROR:', response.status, text.substring(0, 500))
      return res.status(response.status).json({
        error: `Grist ${response.status}`,
        details: text.substring(0, 1000),
        table: tableName
      })
    }

    const result = await response.json()
    console.warn('✅ Grist OK:', result)

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
