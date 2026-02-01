<!-- src/components/CrcaForm.vue -->

<script setup lang="ts">
import {
  DsfrAlert,
  DsfrButton,
  DsfrCheckbox,
  DsfrInput,
  DsfrRadioButtonSet,
  DsfrSelect
} from '@gouvminint/vue-dsfr'
import { computed, ref, watch, onMounted } from 'vue'

type Secteur = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
type Intervention = 'INITIATIVE' | 'CIC' | ''
type Pam = 'PAM RAS' | 'PAM non RAS' | ''

interface CrcaModel {
  egm: string
  secteur: Secteur
  indicatifs: string[]
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
}

const props = defineProps<{
  modelValue: Partial<CrcaModel>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<CrcaModel>]
  'submit': [data: CrcaModel]
}>()

const model = ref<Partial<CrcaModel>>({
  egm: '',
  secteur: '' as Secteur,
  indicatifs: [],
  intervention: '' as Intervention,
  natureIntervention: '',
  heureDebut: '',
  heureFin: '',
  lieu: '',
  pam: '' as Pam,
  personnel: '',
  armement: '',
  materiel: '',
  resume: '',
  ...props.modelValue,
})

const isSubmitting = ref(false)
const submitMessage = ref('')
const submitError = ref('')

const escadronOptions = ref<{value: string, text: string}[]>([])
const loadingEscadrons = ref(false)

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

watch(() => props.modelValue, (newVal) => {
  model.value = { ...model.value, ...newVal }
}, { deep: true })

watch(model, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

const isValid = computed(() => {
  const m = model.value
  return (
    m.egm !== ''
    && m.secteur !== ''
    && (m.indicatifs?.length ?? 0) > 0
    && m.intervention !== ''
    && m.natureIntervention?.trim() !== ''
    && m.heureDebut?.trim() !== ''
    && m.heureFin?.trim() !== ''
    && m.lieu?.trim() !== ''
    && m.pam !== ''
    && m.resume?.trim() !== ''
  )
})

function updateIndicatifs (value: string, checked: boolean) {
  const currentIndicatifs = model.value.indicatifs || []
  const newIndicatifs = checked
    ? [...currentIndicatifs, value]
    : currentIndicatifs.filter(i => i !== value)
  model.value.indicatifs = newIndicatifs
}

function formatHeureOnBlur (value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length !== 4) {
    return value
  }
  const heures = digits.slice(0, 2)
  const minutes = digits.slice(2, 4)
  return `${heures}h${minutes}`
}

const indicatifsPatrouille = [
  { label: 'A1', value: 'A1' },
  { label: 'A11', value: 'A11' },
  { label: 'A12', value: 'A12' },
  { label: 'A13', value: 'A13' },
  { label: 'A2', value: 'A2' },
  { label: 'A21', value: 'A21' },
  { label: 'A22', value: 'A22' },
  { label: 'A23', value: 'A23' },
  { label: 'A3', value: 'A3' },
  { label: 'A31', value: 'A31' },
  { label: 'A32', value: 'A32' },
  { label: 'A33', value: 'A33' },
  { label: 'B1', value: 'B1' },
  { label: 'B11', value: 'B11' },
  { label: 'B12', value: 'B12' },
  { label: 'B13', value: 'B13' },
  { label: 'B2', value: 'B2' },
  { label: 'B21', value: 'B21' },
  { label: 'B22', value: 'B22' },
  { label: 'B23', value: 'B23' },
  { label: 'B3', value: 'B3' },
  { label: 'B31', value: 'B31' },
  { label: 'B32', value: 'B32' },
  { label: 'B33', value: 'B33' },
  { label: 'C1', value: 'C1' },
  { label: 'C11', value: 'C11' },
  { label: 'C12', value: 'C12' },
  { label: 'C13', value: 'C13' },
  { label: 'C2', value: 'C2' },
  { label: 'C21', value: 'C21' },
  { label: 'C22', value: 'C22' },
  { label: 'C23', value: 'C23' },
  { label: 'C3', value: 'C3' },
  { label: 'C31', value: 'C31' },
  { label: 'C32', value: 'C32' },
  { label: 'C33', value: 'C33' },
  { label: 'D1', value: 'D1' },
  { label: 'D11', value: 'D11' },
  { label: 'D12', value: 'D12' },
  { label: 'D13', value: 'D13' },
  { label: 'D2', value: 'D2' },
  { label: 'D21', value: 'D21' },
  { label: 'D22', value: 'D22' },
  { label: 'D23', value: 'D23' },
  { label: 'D3', value: 'D3' },
  { label: 'D31', value: 'D31' },
  { label: 'D32', value: 'D32' },
  { label: 'D33', value: 'D33' }
]

const indicatifsA = computed(() => indicatifsPatrouille.filter(i => i.value.startsWith('A')))
const indicatifsB = computed(() => indicatifsPatrouille.filter(i => i.value.startsWith('B')))
const indicatifsC = computed(() => indicatifsPatrouille.filter(i => i.value.startsWith('C')))
const indicatifsD = computed(() => indicatifsPatrouille.filter(i => i.value.startsWith('D')))

async function onSubmit (event: Event) {
  event.preventDefault()

  if (!isValid.value) {
    submitError.value = 'Veuillez remplir tous les champs obligatoires'
    return
  }

  isSubmitting.value = true
  submitError.value = ''
  submitMessage.value = ''

  try {
    const crcaData: CrcaModel = {
      egm: model.value.egm!,
      secteur: model.value.secteur!,
      indicatifs: model.value.indicatifs!,
      intervention: model.value.intervention!,
      natureIntervention: model.value.natureIntervention!,
      heureDebut: model.value.heureDebut!,
      heureFin: model.value.heureFin!,
      lieu: model.value.lieu!,
      pam: model.value.pam!,
      personnel: model.value.personnel || '',
      armement: model.value.armement || '',
      materiel: model.value.materiel || '',
      resume: model.value.resume!,
    }

    // Envoyer vers l'API serverless
    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        table: 'CRCA',
        records: [crcaData]
      })
    })

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`)
    }

    const result = await response.json()
    console.log('✅ CRCA envoyé avec succès:', result)

    emit('submit', crcaData)

    submitMessage.value = '✅ CRCA envoyé avec succès vers Grist !'

    setTimeout(() => {
      Object.assign(model.value, {
        egm: '',
        secteur: '' as Secteur,
        indicatifs: [],
        intervention: '' as Intervention,
        natureIntervention: '',
        heureDebut: '',
        heureFin: '',
        lieu: '',
        pam: '' as Pam,
        personnel: '',
        armement: '',
        materiel: '',
        resume: '',
      })
    }, 3000)
  }
  catch (error) {
    console.error('Erreur soumission CRCA:', error)
    submitError.value = 'Erreur lors de l\'envoi vers Grist. Veuillez réessayer.'
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form
    class="fr-mb-5w"
    @submit="onSubmit"
  >
    <h2 class="fr-h3 fr-mb-3w">
      Formulaire CRCA
    </h2>

    <!-- Message de succès -->
    <DsfrAlert
      v-if="submitMessage"
      title="Succès"
      description="CRCA enregistré dans Grist"
      type="success"
      class="fr-mb-3w"
    />

    <!-- Message d'erreur -->
    <DsfrAlert
      v-if="submitError"
      title="Erreur"
      :description="submitError"
      type="error"
      class="fr-mb-3w"
    />

    <!-- Select Escadron -->
    <DsfrSelect
      v-model="model.egm"
      label="Escadron (EGM) *"
      :options="escadronOptions"
      :disabled="loadingEscadrons"
      required
      class="fr-mb-3w"
    />

    <DsfrRadioButtonSet
      v-model="model.secteur"
      legend="Secteur d'action *"
      :options="[
        { label: 'ALPHA', value: 'ALPHA' },
        { label: 'BRAVO', value: 'BRAVO' },
        { label: 'CHARLIE', value: 'CHARLIE' },
        { label: 'DELTA', value: 'DELTA' },
      ]"
      class="fr-mb-3w"
      required
    />

    <fieldset
      v-if="model.secteur"
      class="fr-fieldset fr-mb-3w"
    >
      <legend class="fr-fieldset__legend fr-text--md">
        Indicatif de la Patrouille *
      </legend>

      <div
        v-if="model.secteur === 'ALPHA'"
        class="fr-col-12"
      >
        <p class="fr-text--sm fr-mb-1v fr-text--bold">
          Secteur ALPHA
        </p>
        <DsfrCheckbox
          v-for="opt in indicatifsA"
          :key="opt.value"
          :label="opt.label"
          :name="`indicatif-${opt.value}`"
          :model-value="(model.indicatifs || []).includes(opt.value)"
          class="fr-mb-1v"
          @update:model-value="updateIndicatifs(opt.value, $event)"
        />
      </div>

      <div
        v-if="model.secteur === 'BRAVO'"
        class="fr-col-12"
      >
        <p class="fr-text--sm fr-mb-1v fr-text--bold">
          Secteur BRAVO
        </p>
        <DsfrCheckbox
          v-for="opt in indicatifsB"
          :key="opt.value"
          :label="opt.label"
          :name="`indicatif-${opt.value}`"
          :model-value="(model.indicatifs || []).includes(opt.value)"
          class="fr-mb-1v"
          @update:model-value="updateIndicatifs(opt.value, $event)"
        />
      </div>

      <div
        v-if="model.secteur === 'CHARLIE'"
        class="fr-col-12"
      >
        <p class="fr-text--sm fr-mb-1v fr-text--bold">
          Secteur CHARLIE
        </p>
        <DsfrCheckbox
          v-for="opt in indicatifsC"
          :key="opt.value"
          :label="opt.label"
          :name="`indicatif-${opt.value}`"
          :model-value="(model.indicatifs || []).includes(opt.value)"
          class="fr-mb-1v"
          @update:model-value="updateIndicatifs(opt.value, $event)"
        />
      </div>

      <div
        v-if="model.secteur === 'DELTA'"
        class="fr-col-12"
      >
        <p class="fr-text--sm fr-mb-1v fr-text--bold">
          Secteur DELTA
        </p>
        <DsfrCheckbox
          v-for="opt in indicatifsD"
          :key="opt.value"
          :label="opt.label"
          :name="`indicatif-${opt.value}`"
          :model-value="(model.indicatifs || []).includes(opt.value)"
          class="fr-mb-1v"
          @update:model-value="updateIndicatifs(opt.value, $event)"
        />
      </div>
    </fieldset>

    <DsfrRadioButtonSet
      v-model="model.intervention"
      legend="Intervention *"
      :options="[
        { label: 'INITIATIVE', value: 'INITIATIVE' },
        { label: 'CIC', value: 'CIC' },
      ]"
      class="fr-mb-3w"
      required
    />

    <DsfrInput
      v-model="model.natureIntervention"
      label="Nature de l'intervention *"
      label-visible
      required
      class="fr-mb-3w"
    />

    <div class="fr-grid-row fr-grid-row--gutters fr-mb-3w">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInput
          v-model="model.heureDebut"
          label="Heure début (HHhMM) *"
          label-visible
          placeholder="08h30"
          required
          @blur="model.heureDebut = formatHeureOnBlur(model.heureDebut || '')"
        />
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInput
          v-model="model.heureFin"
          label="Heure fin (HHhMM) *"
          label-visible
          placeholder="10h15"
          required
          @blur="model.heureFin = formatHeureOnBlur(model.heureFin || '')"
        />
      </div>
    </div>

    <DsfrInput
      v-model="model.lieu"
      label="Lieu *"
      label-visible
      required
      class="fr-mb-3w"
    />

    <DsfrRadioButtonSet
      v-model="model.pam"
      legend="PAM *"
      :options="[
        { label: 'PAM RAS', value: 'PAM RAS' },
        { label: 'PAM non RAS', value: 'PAM non RAS' },
      ]"
      class="fr-mb-3w"
      required
    />

    <div
      v-if="model.pam === 'PAM non RAS'"
      class="fr-grid-row fr-grid-row--gutters fr-mb-3w"
    >
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.personnel"
          label="Personnel"
          label-visible
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.armement"
          label="Armement"
          label-visible
        />
      </div>
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          v-model="model.materiel"
          label="Matériel"
          label-visible
        />
      </div>
    </div>

    <DsfrInput
      v-model="model.resume"
      type="textarea"
      label="Résumé de l'intervention *"
      label-visible
      required
      class="fr-mb-3w"
    />

    <DsfrButton
      type="submit"
      :loading="isSubmitting"
      :disabled="!isValid || isSubmitting"
      priority="primary"
    >
      🚀 {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer vers Grist CRCA' }}
    </DsfrButton>
  </form>
</template>
