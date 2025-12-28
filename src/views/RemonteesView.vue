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

async function submitCrca () {
  const formData = { ...crcaFormData }
  const gristPayload = [{
    ...formData,
    indicatifs: (formData.indicatifs || []).join(','),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]

  try {
    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gristPayload)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    statusTitle.value = `✅ Succès ${result.table || 'CRCA'}`
    statusMessage.value = `Remontée ${result.table || 'CRCA'} créée dans Grist !`
    Object.assign(crcaFormData, {})
  }
  catch {
    statusTitle.value = '📋 Mode manuel'
    statusMessage.value = 'Copier JSON console pour Grist (ID: 287D12LdHqN4hYBpsm52fo)'
    console.warn('🚀 GRIST READY - Copier JSON ci-dessous:', gristPayload)
  }
}

async function submitCrfm () {
  const formData = { ...crfmFormData }
  const gristPayload = [{
    ...formData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }]

  try {
    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gristPayload)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const result = await response.json()
    statusTitle.value = `✅ Succès ${result.table || 'CRFM'}`
    statusMessage.value = `Remontée ${result.table || 'CRFM'} créée dans Grist !`
    Object.assign(crfmFormData, {})
  }
  catch {
    statusTitle.value = '📋 Mode manuel'
    statusMessage.value = 'Copier JSON console pour Grist table CRFM'
    console.warn('🚀 GRIST READY - Copier JSON ci-dessous:', gristPayload)
  }
}

// ✅ ESLINT OK - 1 statement par ligne
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
