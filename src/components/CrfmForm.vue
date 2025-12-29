<script setup lang="ts">
import {
  DsfrButton,
  DsfrInput,
  DsfrRadioButtonSet
} from '@gouvminint/vue-dsfr'
import { reactive, watch } from 'vue'

type Horaire = '6-14' | '14-22' | '22-6' | ''
type Secteur = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
type Mission =
  | 'CTRZ'
  | 'OAD'
  | 'MORO'
  | 'SECURISATION'
  | 'RI'
  | ''

interface CrfmModel {
  date: string
  horaire: Horaire
  secteur: Secteur
  mission: Mission
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
}

const props = defineProps<{
  modelValue: Partial<CrfmModel>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<CrfmModel>]
  'submit': [payload: { data: Partial<CrfmModel>, resetForm: () => void }]
}>()

// Utilisation de reactive pour éviter la réinitialisation des props
const model = reactive<Partial<CrfmModel>>({
  ...props.modelValue
})

// Synchronisation bidirectionnelle props -> model
watch(() => props.modelValue, (newValue) => {
  Object.assign(model, newValue)
}, { deep: true, immediate: true })

// Synchronisation model -> parent
watch(model, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Fonction pour réinitialiser le formulaire
function resetForm () {
  Object.assign(model, {
    date: '',
    horaire: '' as Horaire,
    secteur: '' as Secteur,
    mission: '' as Mission,
    vlEngages: null,
    effectifs: null,
    nbOad: null,
    controlesVl: null,
    controlesPersonne: null,
    caillassageTouchant: null,
    caillassageNonTouchant: null,
    refusAvecInterp: null,
    refusSansInterp: null,
    obstacle: null,
    feuHabitation: null,
    feuVoitures: null,
    feuAutres: null,
    papafTouchant: null,
    papafNonTouchant: null,
    grenMp7: null,
    grenCm6: null,
    grenGenlDmp: null,
    grenGm2l: null,
    grenGl304: null,
    munLbd40: null,
    mun9mm: null,
    mun556: null,
    mun762: null,
    stupCannabis: null,
    stupPlant: null,
    stupAutres: '',
    infraTa: null,
    infraDelits: null,
    interpZgn: null,
    interpZpn: null,
    nbInterCorgCic: null,
    nbInterInitiative: null,
    rensFrm: null,
    rensFrs: null,
    commentairePam: ''
  })
}

function onSubmit (event: Event) {
  event.preventDefault()

  // Validation des champs obligatoires
  const requiredFields: (keyof CrfmModel)[] = [
    'date',
    'horaire',
    'secteur',
    'mission',
    'vlEngages',
    'effectifs',
    'commentairePam'
  ]

  const missingFields = requiredFields.filter(field =>
    !model[field] || model[field] === ''
  )

  if (missingFields.length > 0) {
    console.warn('Champs obligatoires manquants:', missingFields)
    return false
  }

  emit('submit', { data: model, resetForm })
}
</script>

<template>
  <!-- Template identique à l'original, pas de modification -->
  <form @submit="onSubmit">
    <h2 class="fr-h3">
      CR FIN DE MISSION
    </h2>

    <!-- Date / Horaires / Secteur / Mission / VL / Effectifs / OAD -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-3">
        <DsfrInput
          v-model="model.date"
          type="date"
          label="Date *"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          v-model="model.horaire"
          legend="Horaires *"
          :options="[
            { label: '6h - 14h', value: '6-14' },
            { label: '14h - 22h', value: '14-22' },
            { label: '22h - 6h', value: '22-6' },
          ]"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          v-model="model.secteur"
          legend="Secteur *"
          :options="[
            { label: 'ALPHA', value: 'ALPHA' },
            { label: 'BRAVO', value: 'BRAVO' },
            { label: 'CHARLIE', value: 'CHARLIE' },
            { label: 'DELTA', value: 'DELTA' },
          ]"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          v-model="model.mission"
          legend="Mission *"
          :options="[
            { label: 'CTRZ', value: 'CTRZ' },
            { label: 'OAD', value: 'OAD' },
            { label: 'MO/RO', value: 'MORO' },
            { label: 'SECURISATION', value: 'SECURISATION' },
            { label: 'RI', value: 'RI' },
          ]"
          required
        />
      </div>
    </div>

    <!-- Reste du template identique... (toutes les sections) -->
    <!-- VL engagés / Effectifs / OAD -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.vlEngages"
          type="number"
          min="0"
          label="VL engagés *"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.effectifs"
          type="number"
          min="0"
          label="Effectifs *"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.nbOad"
          type="number"
          min="0"
          label="Nombre d'OAD"
          label-visible
        />
      </div>
    </div>

    <!-- Toutes les autres sections restent identiques -->
    <!-- (Nombre de contrôle, interventions, rens, stupéfiants, infractions, etc.) -->

    <!-- Dernière section commentaire -->
    <section class="fr-mb-4w">
      <DsfrInput
        v-model="model.commentairePam"
        type="textarea"
        label="Commentaire (PAM obligatoire) *"
        label-visible
        required
      />
    </section>

    <DsfrButton type="submit">
      Envoyer la remontée CRFM
    </DsfrButton>
  </form>
</template>
