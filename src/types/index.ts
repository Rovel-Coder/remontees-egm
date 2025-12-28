export interface CrcaModel {
  secteur: 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
  indicatifs: string[]
  intervention: 'INITIATIVE' | 'CIC' | ''
  natureIntervention: string
  heureDebut: string
  heureFin: string
  lieu: string
  pam: 'PAM_RAS' | 'PAM_NON_RAS' | ''
  personnel: string
  armement: string
  materiel: string
  resume: string
  created_at?: string
  updated_at?: string
}

export interface CrfmModel {
  date: string
  horaire: '6-14' | '14-22' | '22-6' | ''
  secteur: 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
  mission: 'CTRZ' | 'OAD' | 'MORO' | 'SECURISATION' | 'RI' | ''
  vlEngages: number | null
  effectifs: number | null
  nbOad: number | null
  controlesVl: number | null
  controlesPersonne: number | null
  caillassageTouchant: number | null
  caillassageNonTouchant: number | null
  refusAvecInterp: number | null
  refusSansInterp: number | null
  obstacle: number | null
  feuHabitation: number | null
  feuVoitures: number | null
  feuAutres: number | null
  papafTouchant: number | null
  papafNonTouchant: number | null
  grenMp7: number | null
  grenCm6: number | null
  grenGenlDmp: number | null
  grenGm2l: number | null
  grenGl304: number | null
  munLbd40: number | null
  mun9mm: number | null
  mun556: number | null
  mun762: number | null
  stupCannabis: number | null
  stupPlant: number | null
  stupAutres: string
  infraTa: number | null
  infraDelits: number | null
  interpZgn: number | null
  interpZpn: number | null
  nbInterCorgCic: number | null
  nbInterInitiative: number | null
  rensFrm: number | null
  rensFrs: number | null
  commentairePam: string
  created_at?: string
  updated_at?: string
}
