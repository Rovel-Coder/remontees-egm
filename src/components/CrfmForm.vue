<script setup lang="ts">
// ✅ AJOUTE ÇA en haut de CrfmForm.vue
import {
  DsfrButton,
  DsfrInput,
  DsfrRadioButtonSet
} from '@gouvminint/vue-dsfr'
import { computed } from 'vue'

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
  (e: 'update:modelValue', value: Partial<CrfmModel>): void
  (e: 'submit'): void
}>()

const model = computed<Partial<CrfmModel>>({
  get: () => ({
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
    commentairePam: '',
    ...props.modelValue,
  }),
  set: value => emit('update:modelValue', value),
})

function updateField<K extends keyof CrfmModel> (key: K, value: CrfmModel[K]) {
  model.value = { ...model.value, [key]: value }
}

function parseNumber (value: string): number | null {
  if (value === '') {
    return null
  }

  const n = Number(value)
  return Number.isNaN(n) ? null : n
}

function onSubmit (event: Event) {
  event.preventDefault()
  emit('submit')
}
</script>

<template>
  <form @submit="onSubmit">
    <h2 class="fr-h3">
      CR FIN DE MISSION
    </h2>

    <!-- Date / Horaires / Secteur / Mission / VL / Effectifs / OAD -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-3">
        <DsfrInput
          :model-value="model.date ?? ''"
          type="date"
          label="Date *"
          label-visible
          required
          @update:model-value="updateField('date', $event)"
        />
      </div>

      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          :model-value="model.horaire"
          legend="Horaires *"
          :options="[
            { label: '6h - 14h', value: '6-14' },
            { label: '14h - 22h', value: '14-22' },
            { label: '22h - 6h', value: '22-6' },
          ]"
          @update:model-value="updateField('horaire', $event as Horaire)"
        />
      </div>

      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          :model-value="model.secteur"
          legend="Secteur *"
          :options="[
            { label: 'ALPHA', value: 'ALPHA' },
            { label: 'BRAVO', value: 'BRAVO' },
            { label: 'CHARLIE', value: 'CHARLIE' },
            { label: 'DELTA', value: 'DELTA' },
          ]"
          @update:model-value="updateField('secteur', $event as Secteur)"
        />
      </div>

      <div class="fr-col-12 fr-col-md-3">
        <DsfrRadioButtonSet
          :model-value="model.mission"
          legend="Mission *"
          :options="[
            { label: 'CTRZ', value: 'CTRZ' },
            { label: 'OAD', value: 'OAD' },
            { label: 'MO/RO', value: 'MORO' },
            { label: 'SECURISATION', value: 'SECURISATION' },
            { label: 'RI', value: 'RI' },
          ]"
          @update:model-value="updateField('mission', $event as Mission)"
        />
      </div>
    </div>

    <!-- VL engagés / Effectifs / OAD -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          :model-value="model.vlEngages ?? ''"
          type="number"
          min="0"
          label="VL engagés *"
          label-visible
          required
          @update:model-value="updateField('vlEngages', parseNumber($event))"
        />
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          :model-value="model.effectifs ?? ''"
          type="number"
          min="0"
          label="Effectifs *"
          label-visible
          required
          @update:model-value="updateField('effectifs', parseNumber($event))"
        />
      </div>

      <div class="fr-col-12 fr-col-md-4">
        <DsfrInput
          :model-value="model.nbOad ?? ''"
          type="number"
          min="0"
          label="Nombre d'OAD"
          label-visible
          @update:model-value="updateField('nbOad', parseNumber($event))"
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
            :model-value="model.controlesVl ?? ''"
            type="number"
            min="0"
            label="VL"
            label-visible
            @update:model-value="updateField('controlesVl', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.controlesPersonne ?? ''"
            type="number"
            min="0"
            label="Personne"
            label-visible
            @update:model-value="updateField('controlesPersonne', parseNumber($event))"
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
            :model-value="model.nbInterCorgCic ?? ''"
            type="number"
            min="0"
            label="CORG / CIC"
            label-visible
            @update:model-value="updateField('nbInterCorgCic', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.nbInterInitiative ?? ''"
            type="number"
            min="0"
            label="Initiative"
            label-visible
            @update:model-value="updateField('nbInterInitiative', parseNumber($event))"
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
            :model-value="model.rensFrm ?? ''"
            type="number"
            min="0"
            label="FRM"
            label-visible
            @update:model-value="updateField('rensFrm', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.rensFrs ?? ''"
            type="number"
            min="0"
            label="FRS"
            label-visible
            @update:model-value="updateField('rensFrs', parseNumber($event))"
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
            :model-value="model.stupCannabis ?? ''"
            type="number"
            min="0"
            label="Cannabis"
            label-visible
            @update:model-value="updateField('stupCannabis', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.stupPlant ?? ''"
            type="number"
            min="0"
            label="Plant cannabis"
            label-visible
            @update:model-value="updateField('stupPlant', parseNumber($event))"
          />
        </div>
      </div>
      <DsfrInput
        :model-value="model.stupAutres"
        label="Si autres, précisez"
        label-visible
        @update:model-value="updateField('stupAutres', $event)"
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
            :model-value="model.infraTa ?? ''"
            type="number"
            min="0"
            label="TA"
            label-visible
            @update:model-value="updateField('infraTa', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.infraDelits ?? ''"
            type="number"
            min="0"
            label="Délits"
            label-visible
            @update:model-value="updateField('infraDelits', parseNumber($event))"
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
            :model-value="model.interpZgn ?? ''"
            type="number"
            min="0"
            label="ZGN"
            label-visible
            @update:model-value="updateField('interpZgn', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.interpZpn ?? ''"
            type="number"
            min="0"
            label="ZPN"
            label-visible
            @update:model-value="updateField('interpZpn', parseNumber($event))"
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
            :model-value="model.caillassageTouchant ?? ''"
            type="number"
            min="0"
            label="Caillassage touchant"
            label-visible
            @update:model-value="updateField('caillassageTouchant', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.caillassageNonTouchant ?? ''"
            type="number"
            min="0"
            label="Caillassage non touchant"
            label-visible
            @update:model-value="updateField('caillassageNonTouchant', parseNumber($event))"
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
            :model-value="model.refusAvecInterp ?? ''"
            type="number"
            min="0"
            label="Avec interpellation"
            label-visible
            @update:model-value="updateField('refusAvecInterp', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.refusSansInterp ?? ''"
            type="number"
            min="0"
            label="Sans interpellation"
            label-visible
            @update:model-value="updateField('refusSansInterp', parseNumber($event))"
          />
        </div>
      </div>
      <DsfrInput
        :model-value="model.obstacle ?? ''"
        type="number"
        min="0"
        label="Obstacle (Entrave à la circulation)"
        label-visible
        @update:model-value="updateField('obstacle', parseNumber($event))"
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
            :model-value="model.feuHabitation ?? ''"
            type="number"
            min="0"
            label="Habitation / Commerce"
            label-visible
            @update:model-value="updateField('feuHabitation', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            :model-value="model.feuVoitures ?? ''"
            type="number"
            min="0"
            label="Voitures"
            label-visible
            @update:model-value="updateField('feuVoitures', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            :model-value="model.feuAutres ?? ''"
            type="number"
            min="0"
            label="Autres"
            label-visible
            @update:model-value="updateField('feuAutres', parseNumber($event))"
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
            :model-value="model.papafTouchant ?? ''"
            type="number"
            min="0"
            label="Touchants"
            label-visible
            @update:model-value="updateField('papafTouchant', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.papafNonTouchant ?? ''"
            type="number"
            min="0"
            label="Non touchants"
            label-visible
            @update:model-value="updateField('papafNonTouchant', parseNumber($event))"
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
            :model-value="model.grenMp7 ?? ''"
            type="number"
            min="0"
            label="MP7"
            label-visible
            @update:model-value="updateField('grenMp7', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            :model-value="model.grenCm6 ?? ''"
            type="number"
            min="0"
            label="CM6"
            label-visible
            @update:model-value="updateField('grenCm6', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrInput
            :model-value="model.grenGenlDmp ?? ''"
            type="number"
            min="0"
            label="GENL / DMP"
            label-visible
            @update:model-value="updateField('grenGenlDmp', parseNumber($event))"
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.grenGm2l ?? ''"
            type="number"
            min="0"
            label="GM2L"
            label-visible
            @update:model-value="updateField('grenGm2l', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.grenGl304 ?? ''"
            type="number"
            min="0"
            label="GL304"
            label-visible
            @update:model-value="updateField('grenGl304', parseNumber($event))"
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
            :model-value="model.munLbd40 ?? ''"
            type="number"
            min="0"
            label="LBD 40"
            label-visible
            @update:model-value="updateField('munLbd40', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.mun9mm ?? ''"
            type="number"
            min="0"
            label="9 mm"
            label-visible
            @update:model-value="updateField('mun9mm', parseNumber($event))"
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.mun556 ?? ''"
            type="number"
            min="0"
            label="5,56 mm"
            label-visible
            @update:model-value="updateField('mun556', parseNumber($event))"
          />
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrInput
            :model-value="model.mun762 ?? ''"
            type="number"
            min="0"
            label="7,62 mm"
            label-visible
            @update:model-value="updateField('mun762', parseNumber($event))"
          />
        </div>
      </div>
    </section>

    <!-- 13. Commentaire -->
    <section class="fr-mb-4w">
      <DsfrInput
        :model-value="model.commentairePam"
        type="textarea"
        label="Commentaire (PAM obligatoire) *"
        label-visible
        required
        @update:model-value="updateField('commentairePam', $event)"
      />
    </section>

    <DsfrButton type="submit">
      Envoyer la remontée CRFM
    </DsfrButton>
  </form>
</template>
