<script setup lang="ts">
import {
  DsfrButton,
  DsfrCheckbox,
  DsfrInput,
  DsfrRadioButtonSet
} from '@gouvminint/vue-dsfr'
import { computed, ref, watch } from 'vue'

type Secteur = 'ALPHA' | 'BRAVO' | 'CHARLIE' | 'DELTA' | ''
type Intervention = 'INITIATIVE' | 'CIC' | ''
type Pam = 'PAM_RAS' | 'PAM_NON_RAS' | ''

interface CrcaModel {
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
  'submit': []
}>()

const model = ref<Partial<CrcaModel>>({
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

watch(() => props.modelValue, (newVal) => {
  model.value = { ...model.value, ...newVal }
}, { deep: true })

// Auto-emit sur chaque changement
watch(model, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })

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

function onSubmit (event: Event) {
  event.preventDefault()
  emit('submit')
}
</script>

<template>
  <form @submit="onSubmit">
    <h2 class="fr-h3">
      Formulaire CRCA
    </h2>

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
      <legend class="fr-fieldset__legend">
        Indicatif de la Patrouille *
      </legend>

      <div
        v-if="model.secteur === 'ALPHA'"
        class="fr-col-12"
      >
        <p class="fr-text--sm fr-mb-1v">
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
        <p class="fr-text--sm fr-mb-1v">
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
        <p class="fr-text--sm fr-mb-1v">
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
        <p class="fr-text--sm fr-mb-1v">
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
      label="Nature Intervention *"
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
        { label: 'PAM RAS', value: 'PAM_RAS' },
        { label: 'PAM non RAS', value: 'PAM_NON_RAS' },
      ]"
      class="fr-mb-3w"
      required
    />

    <div
      v-if="model.pam === 'PAM_NON_RAS'"
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
      label="Résumé Intervention *"
      label-visible
      required
      class="fr-mb-3w"
    />

    <DsfrButton type="submit">
      🚀 Envoyer automatiquement vers Grist CRCA
    </DsfrButton>
  </form>
</template>
