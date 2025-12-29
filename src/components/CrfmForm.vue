<script setup lang="ts">
import {
  DsfrButton,
  DsfrInput,
  DsfrRadioButtonSet
} from '@gouvminint/vue-dsfr'
import { reactive, watch } from 'vue'

const props = defineProps<{
  modelValue: Partial<CrfmModel>
}>()

// ✅ Correction TypeScript : définir correctement les événements
const emit = defineEmits<{
  'update:modelValue': [value: Partial<CrfmModel>]
  'submitSuccess': [{ message: string, isError: boolean }] // ✅ TypeScript correct
}>()

// Configuration Grist
const GRIST_DOC_ID = '287D12LdHqN4hYBpsm52fo'
const GRIST_API_KEY = import.meta.env.VITE_GRIST_API_KEY
const GRIST_SERVER = 'https://grist.numerique.gouv.fr'

// Types et interface (inchangés)
type Horaire = '6-14' | '14-22' | '22-6' | ''
type Secteur = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
type Mission =
  | 'CTRZ'
  | 'OAD'
  | 'MO/RO'
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

// État initial du formulaire
const initialState: Partial<CrfmModel> = {
  date: '',
  horaire: '',
  secteur: '',
  mission: '',
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
}

const model = reactive<Partial<CrfmModel>>({
  ...initialState,
  ...props.modelValue
})

// Synchronisation bidirectionnelle
watch(() => props.modelValue, (newValue) => {
  Object.assign(model, newValue)
}, { deep: true, immediate: true })

watch(model, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

function resetForm () {
  Object.assign(model, initialState)
}

const requiredFields: (keyof CrfmModel)[] = [
  'date',
  'horaire',
  'secteur',
  'mission',
  'vlEngages',
  'effectifs',
  'commentairePam'
]

// Fonction utilitaire pour les messages
function showMessage (message: string, isError: boolean = false) {
  if (isError) {
    console.error(message)
  }
  emit('submitSuccess', { message, isError }) // ✅ TypeScript OK
}

// Fonction pour envoyer vers Grist
async function sendToGrist () {
  const missingFields = requiredFields.filter(field =>
    !model[field] || model[field] === ''
  )

  if (missingFields.length > 0) {
    showMessage(`Champs obligatoires manquants: ${missingFields.join(', ')}`, true)
    return false
  }

  if (!GRIST_API_KEY) {
    showMessage('Clé API Grist manquante. Configurez VITE_GRIST_API_KEY dans votre .env', true)
    return false
  }

  try {
    const gristData = [{
      date: model.date,
      horaire: model.horaire,
      secteur: model.secteur,
      mission: model.mission,
      vl_engages: model.vlEngages,
      effectifs: model.effectifs,
      nb_oad: model.nbOad,
      controles_vl: model.controlesVl,
      controles_personne: model.controlesPersonne,
      caillassage_touchant: model.caillassageTouchant,
      caillassage_non_touchant: model.caillassageNonTouchant,
      refus_avec_interp: model.refusAvecInterp,
      refus_sans_interp: model.refusSansInterp,
      obstacle: model.obstacle,
      feu_habitation: model.feuHabitation,
      feu_voitures: model.feuVoitures,
      feu_autres: model.feuAutres,
      papaf_touchant: model.papafTouchant,
      papaf_non_touchant: model.papafNonTouchant,
      gren_mp7: model.grenMp7,
      gren_cm6: model.grenCm6,
      gren_genl_dmp: model.grenGenlDmp,
      gren_gm2l: model.grenGm2l,
      gren_gl304: model.grenGl304,
      mun_lbd40: model.munLbd40,
      mun_9mm: model.mun9mm,
      mun_556: model.mun556,
      mun_762: model.mun762,
      stup_cannabis: model.stupCannabis,
      stup_plant: model.stupPlant,
      stup_autres: model.stupAutres,
      infra_ta: model.infraTa,
      infra_delits: model.infraDelits,
      interp_zgn: model.interpZgn,
      interp_zpn: model.interpZpn,
      nb_inter_corg_cic: model.nbInterCorgCic,
      nb_inter_initiative: model.nbInterInitiative,
      rens_frm: model.rensFrm,
      rens_frs: model.rensFrs,
      commentaire_pam: model.commentairePam
    }]

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

    if (!response.ok) {
      throw new Error(`Erreur API Grist: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()
    console.warn('Données envoyées à Grist:', result)

    resetForm()
    emit('submitSuccess', { message: 'Données envoyées avec succès vers Grist !', isError: false }) // ✅ TypeScript OK
    return true
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    console.error('Erreur envoi Grist:', error)
    showMessage(`Erreur lors de l'envoi: ${errorMessage}`, true)
    return false
  }
}
</script>

<template>
  <form @submit.prevent="sendToGrist">
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
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.stupCannabis"
            type="number"
            min="0"
            label="Cannabis"
            label-visible
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            v-model="model.stupPlant"
            type="number"
            min="0"
            label="Plant cannabis"
            label-visible
          />
        </div>
      </div>
      <DsfrInput
        v-model="model.stupAutres"
        label="Si autres, précisez"
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
        label="Commentaire (PAM obligatoire) *"
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
          class="fr-mb-4w"
        >
          Envoyer la remontée CRFM vers Grist
        </DsfrButton>
      </div>
    </div>
  </form>
</template>
