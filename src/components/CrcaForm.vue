<script setup lang="ts">
// ✅ IMPORTS DSFR AJOUTÉS
import {
  DsfrButton,
  DsfrCheckbox,
  DsfrInput,
  DsfrRadioButtonSet
} from '@gouvminint/vue-dsfr'
import { computed } from 'vue'

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
  (e: 'update:modelValue', value: Partial<CrcaModel>): void
  (e: 'submit'): void
}>()

const model = computed<Partial<CrcaModel>>({
  get: () => ({
    secteur: '' as Secteur,
    indicatifs: [] as string[],
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
  }),
  set: value => emit('update:modelValue', value),
})

function updateField<K extends keyof CrcaModel> (key: K, value: CrcaModel[K]) {
  model.value = { ...model.value, [key]: value }
}

function updateIndicatifs (value: string, checked: boolean) {
  const currentIndicatifs = model.value.indicatifs || []
  const newIndicatifs = checked
    ? [...currentIndicatifs, value]
    : currentIndicatifs.filter(i => i !== value)
  updateField('indicatifs' as const, newIndicatifs)
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
  { label: 'D33', value: 'D33' },
]

const indicatifsA = indicatifsPatrouille.filter(i => i.value.startsWith('A'))
const indicatifsB = indicatifsPatrouille.filter(i => i.value.startsWith('B'))
const indicatifsC = indicatifsPatrouille.filter(i => i.value.startsWith('C'))
const indicatifsD = indicatifsPatrouille.filter(i => i.value.startsWith('D'))

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
      :model-value="model.secteur"
      legend="Secteur d'action *"
      :options="[
        { label: 'ALPHA', value: 'ALPHA' },
        { label: 'BRAVO', value: 'BRAVO' },
        { label: 'CHARLIE', value: 'CHARLIE' },
        { label: 'DELTA', value: 'DELTA' },
      ]"
      class="fr-mb-3w"
      @update:model-value="updateField('secteur', $event as Secteur)"
    />

    <fieldset
      class="fr-fieldset fr-mb-3w"
      aria-labelledby="indicatifs-legend"
    >
      <legend
        id="indicatifs-legend"
        class="fr-fieldset__legend"
      >
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
          :value="opt.value"
          name="indicatif-patrouille-a"
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
          :value="opt.value"
          name="indicatif-patrouille-b"
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
          :value="opt.value"
          name="indicatif-patrouille-c"
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
          :value="opt.value"
          name="indicatif-patrouille-d"
          :model-value="(model.indicatifs || []).includes(opt.value)"
          class="fr-mb-1v"
          @update:model-value="updateIndicatifs(opt.value, $event)"
        />
      </div>
    </fieldset>

    <DsfrRadioButtonSet
      :model-value="model.intervention"
      legend="Intervention *"
      :options="[
        { label: 'INITIATIVE', value: 'INITIATIVE' },
        { label: 'CIC', value: 'CIC' },
      ]"
      class="fr-mb-3w"
      @update:model-value="updateField('intervention', $event as Intervention)"
    />

    <DsfrInput
      :model-value="model.natureIntervention ?? ''"
      label="Nature Intervention *"
      label-visible
      required
      class="fr-mb-3w"
      @update:model-value="updateField('natureIntervention', $event)"
    />

    <DsfrInput
      :model-value="model.heureDebut ?? ''"
      label="Heure début (HHhMM) *"
      label-visible
      placeholder="08h30"
      class="fr-mb-3w"
      @update:model-value="updateField('heureDebut', $event)"
      @blur="updateField('heureDebut', formatHeureOnBlur(model.heureDebut ?? ''))"
    />

    <DsfrInput
      :model-value="model.heureFin ?? ''"
      label="Heure fin (HHhMM) *"
      label-visible
      placeholder="10h15"
      class="fr-mb-3w"
      @update:model-value="updateField('heureFin', $event)"
      @blur="updateField('heureFin', formatHeureOnBlur(model.heureFin ?? ''))"
    />

    <DsfrInput
      :model-value="model.lieu ?? ''"
      label="Lieu *"
      label-visible
      class="fr-mb-3w"
      @update:model-value="updateField('lieu', $event)"
    />

    <DsfrRadioButtonSet
      :model-value="model.pam"
      legend="PAM *"
      :options="[
        { label: 'PAM RAS', value: 'PAM_RAS' },
        { label: 'PAM non RAS', value: 'PAM_NON_RAS' },
      ]"
      class="fr-mb-3w"
      @update:model-value="updateField('pam', $event as Pam)"
    />

    <template v-if="model.pam === 'PAM_NON_RAS'">
      <DsfrInput
        :model-value="model.personnel ?? ''"
        label="Personnel"
        label-visible
        class="fr-mb-3w"
        @update:model-value="updateField('personnel', $event)"
      />

      <DsfrInput
        :model-value="model.armement ?? ''"
        label="Armement"
        label-visible
        class="fr-mb-3w"
        @update:model-value="updateField('armement', $event)"
      />

      <DsfrInput
        :model-value="model.materiel ?? ''"
        label="Matériel"
        label-visible
        class="fr-mb-3w"
        @update:model-value="updateField('materiel', $event)"
      />
    </template>

    <DsfrInput
      :model-value="model.resume ?? ''"
      type="textarea"
      label="Résumé Intervention *"
      label-visible
      required
      class="fr-mb-3w"
      @update:model-value="updateField('resume', $event)"
    />

    <DsfrButton type="submit">
      Envoyer la remontée CRCA
    </DsfrButton>
  </form>
</template>
