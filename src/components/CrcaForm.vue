<script setup lang="ts">
import {
  DsfrButton,
  DsfrInput,
  DsfrRadioButtonSet,
  DsfrSelect,
  DsfrCheckbox
} from '@gouvminint/vue-dsfr'
import { reactive, watch, onMounted, ref } from 'vue'
import type { CrcaModel } from '@/types'

const props = defineProps<{
  modelValue: Partial<CrcaModel>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Partial<CrcaModel>]
  'submit': [data: CrcaModel]
}>()

const initialState: Partial<CrcaModel> = {
  egm: '',
  secteur: '',
  indicatifs: [],
  intervention: '',
  natureIntervention: '',
  heureDebut: '',
  heureFin: '',
  lieu: '',
  pam: '',
  personnel: '',
  armement: '',
  materiel: '',
  resume: ''
}

const model = reactive<Partial<CrcaModel>>({
  ...initialState,
  ...props.modelValue
})

watch(() => props.modelValue, (newValue) => {
  Object.assign(model, newValue)
}, { deep: true, immediate: true })

watch(model, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

function resetForm() {
  Object.assign(model, initialState)
}

const requiredFields: (keyof CrcaModel)[] = [
  'egm',
  'secteur',
  'indicatifs',
  'intervention',
  'natureIntervention',
  'heureDebut',
  'heureFin',
  'lieu',
  'pam',
  'personnel',
  'armement',
  'materiel',
  'resume'
]

// OPTIONS ESCADRON DYNAMIQUES GRIST
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

// Gestion des indicatifs
const newIndicatif = ref('')

function addIndicatif() {
  if (newIndicatif.value.trim() && !model.indicatifs?.includes(newIndicatif.value.trim())) {
    if (!model.indicatifs) {
      model.indicatifs = []
    }
    model.indicatifs.push(newIndicatif.value.trim())
    newIndicatif.value = ''
  }
}

function removeIndicatif(index: number) {
  model.indicatifs?.splice(index, 1)
}

async function onSubmit(event: Event) {
  event.preventDefault()

  const missingFields = requiredFields.filter(field => {
    const value = model[field]
    return value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)
  })

  if (missingFields.length > 0) {
    console.warn('Champs obligatoires manquants:', missingFields)
    alert(`Champs manquants : ${missingFields.join(', ')}`)
    return
  }

  try {
    const crcaData: CrcaModel = {
      egm: model.egm!,
      secteur: model.secteur!,
      indicatifs: model.indicatifs!,
      intervention: model.intervention!,
      natureIntervention: model.natureIntervention!,
      heureDebut: model.heureDebut!,
      heureFin: model.heureFin!,
      lieu: model.lieu!,
      pam: model.pam!,
      personnel: model.personnel!,
      armement: model.armement!,
      materiel: model.materiel!,
      resume: model.resume!
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

    setTimeout(() => {
      resetForm()
    }, 3000)
  } catch (error) {
    console.error('❌ Erreur envoi CRCA:', error)
    alert('Erreur lors de l\'envoi du formulaire')
  }
}
</script>

<template>
  <form @submit="onSubmit">
    <h2 class="fr-h3">
      COMPTE RENDU D'ACTIVITÉ
    </h2>

    <!-- ESCADRON EN PREMIER -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrSelect
          v-model="model.egm"
          label="Escadron *"
          required
          :options="escadronOptions"
          :disabled="loadingEscadrons"
        />
      </div>
    </div>

    <!-- Secteur / Intervention -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-6">
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
      <div class="fr-col-12 fr-col-md-6">
        <DsfrRadioButtonSet
          v-model="model.intervention"
          legend="Type d'intervention *"
          :options="[
            { label: 'Initiative', value: 'INITIATIVE' },
            { label: 'CIC', value: 'CIC' },
          ]"
          required
        />
      </div>
    </div>

    <!-- Indicatifs -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Indicatifs de patrouille *
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12 fr-col-md-8">
          <DsfrInput
            v-model="newIndicatif"
            label="Ajouter un indicatif"
            label-visible
            placeholder="Ex: A1, B2..."
            @keyup.enter="addIndicatif"
          />
        </div>
        <div class="fr-col-12 fr-col-md-4">
          <DsfrButton
            type="button"
            :secondary="true"
            @click="addIndicatif"
          >
            Ajouter
          </DsfrButton>
        </div>
      </div>
      <div
        v-if="model.indicatifs && model.indicatifs.length > 0"
        class="fr-tags-group"
      >
        <button
          v-for="(indic, index) in model.indicatifs"
          :key="index"
          type="button"
          class="fr-tag fr-tag--dismiss"
          @click="removeIndicatif(index)"
        >
          {{ indic }}
        </button>
      </div>
    </section>

    <!-- Nature / Horaires -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12 fr-col-md-6">
        <DsfrInput
          v-model="model.natureIntervention"
          label="Nature de l'intervention *"
          label-visible
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrInput
          v-model="model.heureDebut"
          label="Heure début *"
          label-visible
          placeholder="08h30"
          required
        />
      </div>
      <div class="fr-col-12 fr-col-md-3">
        <DsfrInput
          v-model="model.heureFin"
          label="Heure fin *"
          label-visible
          placeholder="10h15"
          required
        />
      </div>
    </div>

    <!-- Lieu -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12">
        <DsfrInput
          v-model="model.lieu"
          label="Lieu *"
          label-visible
          required
        />
      </div>
    </div>

    <!-- PAM -->
    <div class="fr-grid-row fr-grid-row--gutters fr-mb-4w">
      <div class="fr-col-12">
        <DsfrRadioButtonSet
          v-model="model.pam"
          legend="PAM *"
          :options="[
            { label: 'PAM RAS', value: 'PAM RAS' },
            { label: 'PAM non RAS', value: 'PAM non RAS' },
          ]"
          required
        />
      </div>
    </div>

    <!-- Résumé -->
    <section class="fr-mb-4w">
      <DsfrInput
        v-model="model.resume"
        type="textarea"
        label="Résumé de l'intervention *"
        label-visible
        required
      />
    </section>

    <!-- Personnel / Armement / Matériel -->
    <section class="fr-mb-4w">
      <h3 class="fr-h4">
        Moyens engagés
      </h3>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12">
          <DsfrInput
            v-model="model.personnel"
            type="textarea"
            label="Personnel *"
            label-visible
            required
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-2w">
        <div class="fr-col-12">
          <DsfrInput
            v-model="model.armement"
            type="textarea"
            label="Armement *"
            label-visible
            required
          />
        </div>
      </div>
      <div class="fr-grid-row fr-grid-row--gutters">
        <div class="fr-col-12">
          <DsfrInput
            v-model="model.materiel"
            type="textarea"
            label="Matériel *"
            label-visible
            required
          />
        </div>
      </div>
    </section>

    <!-- Bouton d'envoi -->
    <div class="fr-grid-row fr-grid-row--gutters">
      <div class="fr-col-12">
        <DsfrButton
          type="submit"
          priority="primary"
        >
          Envoyer le CRCA vers Grist
        </DsfrButton>
      </div>
    </div>
  </form>
</template>
