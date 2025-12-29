// api/grist.post.ts - 100% ESLint/TypeScript clean
import process from 'node:process' // ✅ Fix ESLint ts/no-require-imports

export default async function handler (req: any, res: any) {
  try {
    console.warn('🔍 API GRIST - Requête CRFM reçue')

    // Vérifier méthode POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Méthode POST requise' })
    }

    const data = await req.json()
    console.warn('🔍 Données CRFM reçues:', data)

    const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
    const GRIST_API_KEY = process.env.GRIST_API_KEY
    const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

    if (!GRIST_API_KEY) {
      const error = new Error('GRIST_API_KEY manquante dans les variables d\'environnement')
      console.error('❌ ERREUR API GRIST:', error.message)
      return res.status(500).json({ error: error.message })
    }

    // ✅ Conversion complète strings → numbers + mapping snake_case
    const gristData = [{
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

    console.warn('📤 Données formatées pour Grist:', gristData[0])

    const response = await fetch(
      `${GRIST_SERVER}/o/api/docs/${GRIST_DOC_ID}/tables/CRFM/records/`,
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

    if (!response.ok) {
      const error = new Error(`Grist API erreur ${response.status}: ${JSON.stringify(result)}`)
      console.error('❌ ERREUR GRIST:', error.message)
      return res.status(500).json({
        error: error.message,
        gristStatus: response.status,
        gristResponse: result
      })
    }

    console.warn('✅ Grist succès:', result)
    return res.status(200).json({
      success: true,
      message: 'CRFM enregistré avec succès',
      gristId: result.ids || result.id || 'OK',
      recordCount: result.rowCount || 1
    })
  }
  catch (error) {
    console.error('❌ ERREUR CRITIQUE API GRIST:', (error as Error).message)
    return res.status(500).json({
      error: (error as Error).message || 'Erreur inconnue',
      timestamp: new Date().toISOString()
    })
  }
}
