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

// ✅ ENVOI AUTOMATIQUE GRIST - Utilise votre api/grist.post.ts
async function sendToGrist (data: any, table: 'CRCA' | 'CRFM') {
  const gristPayload = [{
    ...data,
    indicatifs: (data.indicatifs || []).join(', '),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]

  try {
    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gristPayload)
    })

    if (response.ok) {
      const result = await response.json()
      return { success: true, table: result.table || table }
    }
    throw new Error(`HTTP ${response.status}`)
  }
  catch {
    console.warn('🚀 GRIST READY - Mode manuel:', gristPayload[0])
    return { success: false, payload: gristPayload[0] }
  }
}

async function submitCrca () {
  const result = await sendToGrist(crcaFormData, 'CRCA')

  if (result.success) {
    statusTitle.value = `✅ Succès CRCA`
    statusMessage.value = 'Remontée CRCA créée dans Grist !'
    Object.assign(crcaFormData, {})
  }
  else {
    statusTitle.value = '📋 Mode manuel'
    statusMessage.value = 'Copier JSON console pour Grist CRCA (ID: 287D12LdHqN4hYBpsm52fo)'
  }
}

async function submitCrfm () {
  const result = await sendToGrist(crfmFormData, 'CRFM')

  if (result.success) {
    statusTitle.value = `✅ Succès CRFM`
    statusMessage.value = 'Remontée CRFM créée dans Grist !'
    Object.assign(crfmFormData, {})
  }
  else {
    statusTitle.value = '📋 Mode manuel'
    statusMessage.value = 'Copier JSON console pour Grist CRFM'
  }
}

// ✅ TOUTES VOS FONCTIONS TOGGLE INCHANGÉES
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

    <!-- ✅ BOUTONS DSFR CENTRÉS -->
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mt-4w fr-mb-5w">
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--primary w-100"
          @click="handleCrcaClick"
        >
          📋 Remontée CRCA
        </button>
      </div>
      <div class="fr-col-12 fr-col-md-5 fr-col-lg-4">
        <button
          class="fr-btn fr-btn--secondary w-100"
          @click="handleCrfmClick"
        >
          📋 Remontée CRFM
        </button>
      </div>
    </div>

    <!-- ✅ FORMULAIRES SIMPLES - SANS CARDS -->
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

    <!-- Status -->
    <div
      v-if="statusMessage"
      class="fr-mt-5w"
    >
      <div class="fr-alert fr-alert--success">
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
