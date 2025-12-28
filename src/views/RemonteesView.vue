<script setup lang="ts">
import type { CrcaModel, CrfmModel } from '@/types'
import { reactive, ref } from 'vue'
import CrcaForm from '@/components/CrcaForm.vue'
import CrfmForm from '@/components/CrfmForm.vue'

const showCrca = ref(false)
const showCrfm = ref(false)
const statusMessage = ref('')
const statusTitle = ref('')

const crcaFormData = reactive<Partial<CrcaModel>>({})
const crfmFormData = reactive<Partial<CrfmModel>>({})

// ✅ GRIST CRCA - TABLE EXPLICITE "CRCA"
async function sendCrcaToGrist (data: Partial<CrcaModel>): Promise<{ success: true, message: string }> {
  // FORMAT GRIST : { table: "CRCA", records: [...] }
  const gristPayload = {
    table: 'CRCA', // ← FORCE TABLE CRCA
    records: [{
      Secteur: data.secteur || '',
      Indic_Patrouille: (data.indicatifs || []).join(', '),
      Intervention: data.intervention || '',
      Nature_Intervention: data.natureIntervention || '',
      Heure_debut_Intervention: data.heureDebut || '',
      Heure_Fin_Intervention: data.heureFin || '',
      PAM: data.pam || '',
      Lieu: data.lieu || '',
      Resume_Intervention: data.resume || '',
      Personnel: data.personnel || '',
      Armement: data.armement || '',
      Materiel: data.materiel || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  }

  // eslint-disable-next-line no-console
  console.log('🚀 GRIST CRCA → TABLE CRCA:', JSON.stringify(gristPayload, null, 2))

  const response = await fetch('/api/grist.post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gristPayload)
  })

  const result = await response.json()
  // eslint-disable-next-line no-console
  console.log('📨 GRIST CRCA RESPONSE:', result)

  if (response.ok && result.success) {
    return { success: true, message: `✅ CRCA envoyé table CRCA !` }
  }
  throw new Error(result.error || `Grist table CRCA KO (status: ${response.status})`)
}

// ✅ GRIST CRFM - TABLE EXPLICITE "CRFM"
async function sendCrfmToGrist (data: Partial<CrfmModel>): Promise<{ success: true, message: string }> {
  const gristPayload = {
    table: 'CRFM', // ← FORCE TABLE CRFM
    records: [{
      Date: data.date || '',
      Secteur: data.secteur || '',
      Horaire: data.horaire || '',
      Mission: data.mission || '',
      VL_engagés: data.vlEngages || 0,
      Effectifs: data.effectifs || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }]
  }

  const response = await fetch('/api/grist.post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gristPayload)
  })

  const result = await response.json()
  if (response.ok && result.success) {
    return { success: true, message: `✅ CRFM envoyé table CRFM !` }
  }
  throw new Error(result.error || `Grist table CRFM KO (status: ${response.status})`)
}

async function submitCrca () {
  try {
    if (!crcaFormData.secteur || (crcaFormData.indicatifs?.length || 0) === 0) {
      throw new Error('Secteur + 1 indicatif obligatoires')
    }

    await sendCrcaToGrist(crcaFormData)

    statusTitle.value = '✅ Succès CRCA'
    statusMessage.value = 'Remontée CRCA → Table CRCA Grist !'
    Object.assign(crcaFormData, {})
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRCA'
    statusMessage.value = `Table CRCA: ${errorMessage}`
  }
}

async function submitCrfm () {
  try {
    await sendCrfmToGrist(crfmFormData)

    statusTitle.value = '✅ Succès CRFM'
    statusMessage.value = 'Remontée CRFM → Table CRFM Grist !'
    Object.assign(crfmFormData, {})
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRFM'
    statusMessage.value = `Table CRFM: ${errorMessage}`
  }
}

function toggleCrca () {
  showCrca.value = !showCrca.value
}

function resetCrfm () {
  showCrfm.value = false
}

function toggleCrfm () {
  showCrfm.value = !showCrfm.value
}

function resetCrca () {
  showCrca.value = false
}

function handleCrcaClick () {
  toggleCrca()
  resetCrfm()
}

function handleCrfmClick () {
  toggleCrfm()
  resetCrca()
}
</script>

<template>
  <div class="fr-container fr-mt-5w fr-mb-5w">
    <!-- Header Gendarmerie NC -->
    <div class="fr-header__body">
      <div class="fr-container">
        <div class="fr-header__body-row">
          <div class="fr-header__brand">
            <div class="fr-header__brand-top">
              <div class="fr-header__navbar">
                <p class="fr-header__service">
                  <span class="fr-header__service-tagline">Gendarmerie</span>
                  <span class="fr-header__service-label">Remontées EGM NC</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BOUTONS DSFR -->
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mt-4w fr-mb-5w">
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--primary w-100"
          @click="handleCrcaClick"
        >
          📋 Remontée CRCA → Table CRCA
        </button>
      </div>
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--secondary w-100"
          @click="handleCrfmClick"
        >
          📋 Remontée CRFM → Table CRFM
        </button>
      </div>
    </div>

    <!-- FORMULAIRES -->
    <div
      v-if="showCrca"
      class="fr-mb-5w"
    >
      <div class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-h3">
          📋 Nouvelle remontée CRCA
        </legend>
        <CrcaForm
          v-model="crcaFormData"
          @submit="submitCrca"
        />
      </div>
    </div>

    <div
      v-if="showCrfm"
      class="fr-mb-5w"
    >
      <div class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-h3">
          📋 Nouvelle remontée CRFM
        </legend>
        <CrfmForm
          v-model="crfmFormData"
          @submit="submitCrfm"
        />
      </div>
    </div>

    <!-- Status AUTO -->
    <div
      v-if="statusMessage"
      class="fr-mt-5w"
    >
      <div
        class="fr-alert"
        :class="[
          { 'fr-alert--success': statusTitle.includes('✅') },
          { 'fr-alert--error': statusTitle.includes('❌') },
        ]"
      >
        <p class="fr-alert__title">
          {{ statusTitle }}
        </p>
        <p>{{ statusMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
