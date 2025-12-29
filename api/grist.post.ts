// api/grist.post.ts - VERSION DEBUG MAX - SUPPORT CRCA + CRFM
import process from 'node:process'

export default async function handler (req: any, res: any) {
  try {
    console.warn('🔍 API GRIST - START')
    console.warn('📋 req.method:', req.method)
    console.warn('📋 req.body type:', typeof req.body)
    console.warn('📋 req.body:', req.body)

    if (req.method !== 'POST') {
      console.error('❌ Méthode non POST:', req.method)
      return res.status(405).json({ error: 'Méthode POST requise' })
    }

    // ✅ DEBUG : Forcer parsing JSON si besoin
    let data
    if (typeof req.body === 'string') {
      data = JSON.parse(req.body)
    }
    else if (typeof req.body === 'object' && req.body !== null) {
      data = req.body
    }
    else {
      console.error('❌ req.body invalide:', req.body)
      return res.status(400).json({ error: 'Données invalides', body: req.body })
    }

    console.warn('✅ Données parsées:', data)

    const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    console.warn('🔑 GRIST_API_KEY existe:', !!GRIST_API_KEY)
    console.warn('🔑 GRIST_API_KEY length:', GRIST_API_KEY?.length || 0)

    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    if (!GRIST_API_KEY) {
      console.error('❌ GRIST_API_KEY MANQUANTE!')
      return res.status(500).json({
        error: 'GRIST_API_KEY manquante dans Vercel Environment Variables',
        hasKey: !!GRIST_API_KEY,
        envKeys: Object.keys(process.env).filter(k => k.includes('GRIST'))
      })
    }

    // ✅ Détection de la table cible
    const tableName = data.table || 'CRFM'
    console.warn('📊 Table cible:', tableName)

    let gristData

    // 🎯 MAPPING CRFM (file:2) - 38 colonnes complètes
    if (tableName === 'CRFM') {
      gristData = [{
        date: data.date || '',
        horaire: data.horaire || '',
        secteur: data.secteur || '',
        mission: data.mission || '',
        vl_engages: Number(data.vlEngages) || 0,
        effectifs: Number(data.effectifs) || 0,
        nb_oad: Number(data.nbOad) || 0,
        controles_vl: Number(data.controlesVl) || 0,
        controles_personne: Number(data.controlesPersonne) || 0,
        caillassage_touchant: Number(data.caillassageTouchant) || 0,
        caillassage_non_touchant: Number(data.caillassageNonTouchant) || 0,
        refus_avec_interp: Number(data.refusAvecInterp) || 0,
        refus_sans_interp: Number(data.refusSansInterp) || 0,
        obstacle: Number(data.obstacle) || 0,
        feu_habitation: Number(data.feuHabitation) || 0,
        feu_voitures: Number(data.feuVoitures) || 0,
        feu_autres: Number(data.feuAutres) || 0,
        papaf_touchant: Number(data.papafTouchant) || 0,
        papaf_non_touchant: Number(data.papafNonTouchant) || 0,
        gren_mp7: Number(data.grenMp7) || 0,
        gren_cm6: Number(data.grenCm6) || 0,
        gren_genl_dmp: Number(data.grenGenlDmp) || 0,
        gren_gm2l: Number(data.grenGm2l) || 0,
        gren_gl304: Number(data.grenGl304) || 0,
        mun_lbd40: Number(data.munLbd40) || 0,
        mun_9mm: Number(data.mun9mm) || 0,
        mun_556: Number(data.mun556) || 0,
        mun_762: Number(data.mun762) || 0,
        stup_cannabis: Number(data.stupCannabis) || 0,
        stup_plant: Number(data.stupPlant) || 0,
        stup_autres: data.stupAutres || '',
        infra_ta: Number(data.infraTa) || 0,
        infra_delits: Number(data.infraDelits) || 0,
        interp_zgn: Number(data.interpZgn) || 0,
        interp_zpn: Number(data.interpZpn) || 0,
        nb_inter_corg_cic: Number(data.nbInterCorgCic) || 0,
        nb_inter_initiative: Number(data.nbInterInitiative) || 0,
        rens_frm: Number(data.rensFrm) || 0,
        rens_frs: Number(data.rensFrs) || 0,
        commentaire_pam: data.commentairePam || ''
      }]
    }
    // 🎯 MAPPING CRCA (file:1) - Colonnes spécifiques (hors EGM/Traite/MessageTchap)
    else if (tableName === 'CRCA') {
      gristData = [{
        // Champs communs
        'secteur': data.secteur || '',
        // Colonnes spécifiques CRCA
        'Indic Patrouille': data.indicPatrouille || '',
        'intervention': data.intervention || '',
        'Nature Intervention': data.natureIntervention || '',
        'Heure dbut Intervention': data.heureDebut || '',
        'Heure Fin Intervention': data.heureFin || '',
        'lieu': data.lieu || '',
        'Rsum Intervention': data.resumeIntervention || '',
        'pam': data.pam || '',
        'personnel': data.personnel || '',
        'armement': data.armement || '',
        'materiel': data.materiel || ''
      }]
    }
    else {
      return res.status(400).json({ error: 'Table invalide. Utilisez CRCA ou CRFM', table: tableName })
    }

    console.warn('📤 Envoi à Grist:', tableName, gristData[0])

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

    const result = await response.json()
    console.warn('📥 Grist response:', response.status, result)

    if (!response.ok) {
      console.error('❌ GRIST ERROR:', response.status, result)
      return res.status(500).json({
        error: `Grist ${response.status} (${tableName})`,
        details: result,
        table: tableName
      })
    }

    console.warn('✅ SUCCÈS TOTAL!')
    return res.status(200).json({
      success: true,
      message: `${tableName} enregistré !`,
      table: tableName,
      inserted: result.ids || result.id || 1
    })
  }
  catch (error) {
    console.error('❌ CRASH TOTAL:', error)
    return res.status(500).json({
      error: (error as Error).message || 'Erreur serveur',
      stack: (error as Error).stack,
      timestamp: new Date().toISOString()
    })
  }
}
