<!-- src/components/CrfmForm.vue -->

<script setup lang="ts">
import {
  DsfrButton,
  DsfrInput,
  DsfrRadioButtonSet,
  DsfrSelect
} from '@gouvminint/vue-dsfr'
import { reactive, watch, onMounted, ref } from 'vue'


// Props/Emits
const props = defineProps<{
  modelValue: Partial<CrfmModel>
}>()


const emit = defineEmits<{
  'update:modelValue': [value: Partial<CrfmModel>]
  'submit': [data: CrfmModel]
}>()


// Types
type Horaire = '6h - 14h' | '14h - 22h' | '22h - 6h' | ''
type Secteur = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
type Mission =
  | 'CTRZ'
  | 'OAD'
  | 'MO/RO'
  | 'SECURISATION'
  | 'RI'
  | ''
type Escadron = string  // ID Grist de la table référencée


interface CrfmModel {
  date: string
  horaire: Horaire
  secteur: Secteur
  mission: Mission
  escadron: Escadron
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
  stupAutres: number | null
  stupAutresPrecision: string
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


// État initial
const initialState: Partial<CrfmModel> = {
  date: '',
  horaire: '',
  secteur: '',
  mission: '',
  escadron: '',
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
  stupAutres: null,
  stupAutresPrecision: '',
  infraTa: null,
  infraDelits: null,
  interpZgn: null,
  interpZpn: null,
  nbInterCorgCic: null,
  nbInterInitiative: null,
  rensFrm: null,
  rensFrs: null,
  commentairePam: ''
}


// Modèle réactif
const model = reactive<Partial<CrfmModel>>({
  ...initialState,
  ...props.modelValue
})


// Watchers
watch(() => props.modelValue, (newValue) => {
  Object.assign(model, newValue)
}, { deep: true, immediate: true })


watch(model, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })


// Reset
function resetForm () {
  Object.assign(model, initialState)
}


// Champs obligatoires
const requiredFields: (keyof CrfmModel)[] = [
  'date',
  'horaire',
  'secteur',
  'mission',
  'escadron',
  'vlEngages',
  'effectifs',
  'commentairePam'
]


// OPTIONS ESCADRON DYNAMIQUES GRIST
const escadronOptions = ref<{value: string, text: string}[]>([])
const loadingEscadrons = ref(false)


// Dans CrfmForm.vue et CrcaForm.vue (section onMounted)
onMounted(async () => {
  loadingEscadrons.value = true
  try {
    const response = await fetch('/api/escadrons')
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const data = await response.json()
    
    escadronOptions.value = data.records.map((record: any) => ({
      value: String(record.id),
      text: record.fields.Nom_Escadron || `Escadron ${record.id}`
    }))
    
  } catch (error) {
    console.error('❌ Erreur chargement escadrons:', error)
    escadronOptions.value = [
      { value: '', text: 'Erreur de chargement' }
    ]
  } finally {
    loadingEscadrons.value = false
  }
})





// Submit
async function onSubmit (event: Event) {
  event.preventDefault()

  const missingFields = requiredFields.filter(field =>
    model[field] === null || model[field] === undefined || model[field] === ''
  )

  if (missingFields.length > 0) {
    console.warn('Champs obligatoires manquants:', missingFields)
    return
  }

  try {
    const crfmData: CrfmModel = {
      date: model.date!,
      horaire: model.horaire!,
      secteur: model.secteur!,
      mission: model.mission!,
      escadron: model.escadron!,
      vlEngages: model.vlEngages!,
      effectifs: model.effectifs!,
      nbOad: model.nbOad ?? null,
      controlesVl: model.controlesVl ?? null,
      controlesPersonne: model.controlesPersonne ?? null,
      caillassageTouchant: model.caillassageTouchant ?? null,
      caillassageNonTouchant: model.caillassageNonTouchant ?? null,
      refusAvecInterp: model.refusAvecInterp ?? null,
      refusSansInterp: model.refusSansInterp ?? null,
      obstacle: model.obstacle ?? null,
      feuHabitation: model.feuHabitation ?? null,
      feuVoitures: model.feuVoitures ?? null,
      feuAutres: model.feuAutres ?? null,
      papafTouchant: model.papafTouchant ?? null,
      papafNonTouchant: model.papafNonTouchant ?? null,
      grenMp7: model.grenMp7 ?? null,
      grenCm6: model.grenCm6 ?? null,
      grenGenlDmp: model.grenGenlDmp ?? null,
      grenGm2l: model.grenGm2l ?? null,
      grenGl304: model.grenGl304 ?? null,
      munLbd40: model.munLbd40 ?? null,
      mun9mm: model.mun9mm ?? null,
      mun556: model.mun556 ?? null,
      mun762: model.mun762 ?? null,
      stupCannabis: model.stupCannabis ?? null,
      stupPlant: model.stupPlant ?? null,
      stupAutres: model.stupAutres ?? null,
      stupAutresPrecision: model.stupAutresPrecision ?? '',
      infraTa: model.infraTa ?? null,
      infraDelits: model.infraDelits ?? null,
      interpZgn: model.interpZgn ?? null,
      interpZpn: model.interpZpn ?? null,
      nbInterCorgCic: model.nbInterCorgCic ?? null,
      nbInterInitiative: model.nbInterInitiative ?? null,
      rensFrm: model.rensFrm ?? null,
      rensFrs: model.rensFrs ?? null,
      commentairePam: model.commentairePam!
    }

    emit('submit', crfmData)

    setTimeout(() => {
      resetForm()
    }, 3000)
  }
  catch (error) {
    console.error('Erreur préparation CRFM:', error)
  }
}
</script>



<template>
  <form @submit="onSubmit">
    <h2 class="fr-h3">
      CR FIN DE MISSION
    </h2>

    <!-- ESCADRON EN PREMIER -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrSelect
          v-model="model.escadron"
          label="Escadron"
          required
          :options="escadronOptions"
          :disabled="loadingEscadrons"
        />
      </div>
    </div>

    <!-- Date / Horaires / Secteur / Mission -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-3">
        <DsfrInput
          v-model="model.date"
          type="date"
          label="Date"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          v-model="model.horaire"
          legend="Horaires"
          :options="[
            { label: '6h - 14h', value: '6h - 14h' },
            { label: '14h - 22h', value: '14h - 22h' },
            { label: '22h - 6h', value: '22h - 6h' },
          ]"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          v-model="model.secteur"
          legend="Secteur"
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
          legend="Mission"
          :options="[
            { label: 'CTRZ', value: 'CTRZ' },
            { label: 'OAD', value: 'OAD' },
            { label: 'MO/RO', value: 'MO/RO' },
            { label: 'SECURISATION', value: 'SECURISATION' },
            { label: 'RI', value: 'RI' },
          ]"
          required
        />
      </div>
    </div>

    <!-- VL engagés / Effectifs / OAD -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.vlEngages"
          type="number"
          min="0"
          label="VL engagés"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.effectifs"
          type="number"
          min="0"
          label="Effectifs"
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

    <!-- 1. Nombre de contrôle -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Nombre de contrôle
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.controlesVl"
            type="number"
            min="0"
            label="VL"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.controlesPersonne"
            type="number"
            min="0"
            label="Personne"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 2. Nombre d'intervention -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Nombre d'interventions
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.nbInterCorgCic"
            type="number"
            min="0"
            label="CORG / CIC"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.nbInterInitiative"
            type="number"
            min="0"
            label="Initiative"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 3. Rens -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Rens
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.rensFrm"
            type="number"
            min="0"
            label="FRM"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.rensFrs"
            type="number"
            min="0"
            label="FRS"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 4. Stupéfiants -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Stupéfiants (quantité)
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.stupCannabis"
            type="number"
            min="0"
            label="Cannabis (gr)"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.stupPlant"
            type="number"
            min="0"
            label="Plant cannabis"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.stupAutres"
            type="number"
            min="0"
            label="Autres (quantité)"
            label-visible
          />
        </div>
      </div>
      <DsfrInput
        v-model="model.stupAutresPrecision"
        label="Si autres, précisez (type)"
        label-visible
      />
    </section>

    <!-- 5. Infractions constatées -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Infractions constatées
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.infraTa"
            type="number"
            min="0"
            label="TA"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.infraDelits"
            type="number"
            min="0"
            label="Délits"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 6. Interpellations -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Interpellations
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.interpZgn"
            type="number"
            min="0"
            label="ZGN"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.interpZpn"
            type="number"
            min="0"
            label="ZPN"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 7. Caillassage -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Caillassage
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.caillassageTouchant"
            type="number"
            min="0"
            label="Caillassage touchant"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.caillassageNonTouchant"
            type="number"
            min="0"
            label="Caillassage non touchant"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 8. Refus d'obtempérer -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Refus d'obtempérer
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.refusAvecInterp"
            type="number"
            min="0"
            label="Avec interpellation"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.refusSansInterp"
            type="number"
            min="0"
            label="Sans interpellation"
            label-visible
          />
        </div>
      </div>
      <DsfrInput
        v-model="model.obstacle"
        type="number"
        min="0"
        label="Obstacle (Entrave à la circulation)"
        label-visible
      />
    </section>

    <!-- 9. Feu -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Feu
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.feuHabitation"
            type="number"
            min="0"
            label="Habitation / Commerce"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.feuVoitures"
            type="number"
            min="0"
            label="Voitures"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.feuAutres"
            type="number"
            min="0"
            label="Autres"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 10. PAPAAF -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        PAPAAF
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.papafTouchant"
            type="number"
            min="0"
            label="Touchants"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.papafNonTouchant"
            type="number"
            min="0"
            label="Non touchants"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 11. Grenade -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Grenade
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.grenMp7"
            type="number"
            min="0"
            label="MP7"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.grenCm6"
            type="number"
            min="0"
            label="CM6"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            v-model="model.grenGenlDmp"
            type="number"
            min="0"
            label="GENL / DMP"
            label-visible
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.grenGm2l"
            type="number"
            min="0"
            label="GM2L"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.grenGl304"
            type="number"
            min="0"
            label="GL304"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 12. Munitions -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Munitions
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.munLbd40"
            type="number"
            min="0"
            label="LBD 40"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.mun9mm"
            type="number"
            min="0"
            label="9 mm"
            label-visible
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.mun556"
            type="number"
            min="0"
            label="5,56 mm"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.mun762"
            type="number"
            min="0"
            label="7,62 mm"
            label-visible
          />
        </div>
      </div>
    </section>

    <!-- 13. Commentaire -->
    <section class="fr-mb-6w">
      <DsfrInput
        v-model="model.commentairePam"
        type="textarea"
        label="Commentaire (PAM obligatoire)"
        label-visible
        required
      />
    </section>

    <!-- Bouton d'envoi en bas -->
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrButton
          type="submit"
          priority="primary"
        >
          Envoyer la remontée CRFM vers Grist
        </DsfrButton>
      </div>
    </div>
  </form>
</template>
