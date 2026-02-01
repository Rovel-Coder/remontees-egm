// src/types/index.ts

// Types réutilisables
export type Secteur = '' | 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA'
export type Horaire = '' | '6h - 14h' | '14h - 22h' | '22h - 6h'
export type Mission = '' | 'CTRZ' | 'OAD' | 'MO/RO' | 'SECURISATION' | 'RI'
export type Intervention = '' | 'INITIATIVE' | 'CIC'
export type Pam = '' | 'PAM RAS' | 'PAM NON RAS'

// Modèles complets
export interface CrcaModel {
  egm: string // ID Grist de l'escadron (Ref:Escadron)
  secteur: Secteur
  indicatifs: string[] // Reste en array côté front, sera converti en string pour Grist
  intervention: Intervention
  natureIntervention: string
  heureDebut: string
  heureFin: string
  lieu: string
  pam: Pam
  personnel: string
  armement: string
  materiel: string
  resume: string
  traite?: boolean // champ "Traité" (Bool)
  created_at?: string
  updated_at?: string
}

export interface CrfmModel {
  date: string
  secteur: Secteur
  mission: Mission
  horaire: Horaire
  escadron: string // ID Grist de l'escadron (Ref:Escadron)
  effectifs: number | null
  vlEngages: number | null
  nbOad: number | null
  controlesVl: number | null
  controlesPersonne: number | null
  nbInterCorgCic: number | null
  nbInterInitiative: number | null
  rensFrm: number | null
  rensFrs: number | null
  stupCannabis: number | null
  stupPlant: number | null
  stupAutres: number | null // ← Changé de diversQuantite à stupAutres
  stupAutresPrecision: string // ← Changé de diversPrecision à stupAutresPrecision
  infraTa: number | null // Correspond à TA dans Grist
  infraDelits: number | null // Correspond à Delits dans Grist
  interpZgn: number | null // Correspond à Interpellation_ZGN
  interpZpn: number | null // Correspond à Interpellation_ZPN
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
  commentairePam: string
  created_at?: string
  updated_at?: string
}
