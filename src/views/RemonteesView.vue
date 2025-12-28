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

// ✅ CRCA → /api/grist.post (FONCTIONNEL)
async function sendCrcaToGrist (data: Partial<CrcaModel>): Promise<{ success: true, message: string, table: string }> {
  const gristPayload = {
    table: 'CRCA',
    records: [{
      secteur: data.secteur || '',
      indicatifs: Array.isArray(data.indicatifs) ? data.indicatifs : [],
      intervention: data.intervention || '',
      natureIntervention: data.natureIntervention || '',
      heureDebut: data.heureDebut || '',
      heureFin: data.heureFin || '',
      pam: data.pam || '',
      lieu: data.lieu || '',
      resume: data.resume || '',
      personnel: data.personnel || '',
      armement: data.armement || '',
      materiel: data.materiel || ''
    }]
  }

  const response = await fetch('/api/grist.post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gristPayload)
  })

  const result = await response.json()
  if (response.ok && result.success) {
    return { success: true, message: result.message || '✅ CRCA envoyé !', table: 'CRCA' }
  }
  throw new Error(result.error || 'Grist CRCA KO')
}

// ✅ CRFM → /api/grist.post (NOUVEAU - CORS OK)
async function sendCrfmToGrist (data: Partial<CrfmModel>): Promise<{ success: true, message: string, table: string }> {
  const gristPayload = {
    table: 'CRFM',
    records: [{
      date: data.date || '',
      secteur: data.secteur || '',
      mission: data.mission || '',
      horaire: data.horaire || '',
      effectifs: data.effectifs || null,
      vlEngages: data.vlEngages || null,
      nbOad: data.nbOad || null,
      controlesVl: data.controlesVl || null,
      controlesPersonne: data.controlesPersonne || null,
      nbInterCorgCic: data.nbInterCorgCic || null,
      nbInterInitiative: data.nbInterInitiative || null,
      rensFrm: data.rensFrm || null,
      rensFrs: data.rensFrs || null,
      stupCannabis: data.stupCannabis || null,
      stupPlant: data.stupPlant || null,
      stupAutres: data.stupAutres || '',
      infraTa: data.infraTa || null,
      infraDelits: data.infraDelits || null,
      interpZgn: data.interpZgn || null,
      interpZpn: data.interpZpn || null,
      caillassageTouchant: data.caillassageTouchant || null,
      caillassageNonTouchant: data.caillassageNonTouchant || null,
      refusAvecInterp: data.refusAvecInterp || null,
      refusSansInterp: data.refusSansInterp || null,
      obstacle: data.obstacle || null,
      feuHabitation: data.feuHabitation || null,
      feuVoitures: data.feuVoitures || null,
      feuAutres: data.feuAutres || null,
      papafTouchant: data.papafTouchant || null,
      papafNonTouchant: data.papafNonTouchant || null,
      grenMp7: data.grenMp7 || null,
      grenCm6: data.grenCm6 || null,
      grenGenlDmp: data.grenGenlDmp || null,
      grenGm2l: data.grenGm2l || null,
      grenGl304: data.grenGl304 || null,
      munLbd40: data.munLbd40 || null,
      mun9mm: data.mun9mm || null,
      mun556: data.mun556 || null,
      mun762: data.mun762 || null,
      commentairePam: data.commentairePam || ''
    }]
  }

  const response = await fetch('/api/grist.post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gristPayload)
  })

  const result = await response.json()
  if (response.ok && result.success) {
    return { success: true, message: result.message || '✅ CRFM envoyé !', table: 'CRFM' }
  }
  throw new Error(result.error || 'Grist CRFM KO')
}

// ✅ SUBMIT CRCA
async function submitCrca () {
  try {
    if (!crcaFormData.secteur || (crcaFormData.indicatifs?.length || 0) === 0) {
      throw new Error('Secteur + 1 indicatif obligatoires')
    }

    const result = await sendCrcaToGrist(crcaFormData)
    statusTitle.value = result.message
    statusMessage.value = `✅ ${result.table} → Grist numerique.gouv.fr`
    Object.assign(crcaFormData, {}) // Reset
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRCA'
    statusMessage.value = errorMessage
  }
}

// ✅ SUBMIT CRFM
async function submitCrfm () {
  try {
    const result = await sendCrfmToGrist(crfmFormData)
    statusTitle.value = result.message
    statusMessage.value = `✅ ${result.table} → Grist numerique.gouv.fr`
    Object.assign(crfmFormData, {}) // Reset
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRFM'
    statusMessage.value = errorMessage
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

    <!-- BOUTONS DSFR CENTRÉS -->
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mt-4w fr-mb-5w">
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--primary w-100"
          @click="handleCrcaClick"
        >
          📋 Remontée CRCA ✅
        </button>
      </div>
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--secondary w-100"
          @click="handleCrfmClick"
        >
          📋 Remontée CRFM ✅
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
.w-100 {
  width: 100%;
}
</style>
