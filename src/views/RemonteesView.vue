<script setup lang="ts">
import type { CrcaModel, CrfmModel } from '@/types'
import { reactive, ref } from 'vue'
import CrcaForm from '@/components/CrcaForm.vue'
import CrfmForm from '@/components/CrfmForm.vue'

const activeTab = ref<'none' | 'CRCA' | 'CRFM'>('none')
const statusMessage = ref('')
const statusTitle = ref('')

const crcaFormData = reactive<Partial<CrcaModel>>({})
const crfmFormData = reactive<Partial<CrfmModel>>({})

async function submitCrca (): Promise<void> {
  try {
    if (!crcaFormData.secteur || (crcaFormData.indicatifs?.length || 0) === 0) {
      throw new Error('Secteur + 1 indicatif obligatoires')
    }

    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: 'CRCA',
        records: [{
          secteur: crcaFormData.secteur || '',
          indicatifs: Array.isArray(crcaFormData.indicatifs) ? crcaFormData.indicatifs : [],
          intervention: crcaFormData.intervention || '',
          natureIntervention: crcaFormData.natureIntervention || '',
          heureDebut: crcaFormData.heureDebut || '',
          heureFin: crcaFormData.heureFin || '',
          pam: crcaFormData.pam || '',
          lieu: crcaFormData.lieu || '',
          resume: crcaFormData.resume || '',
          personnel: crcaFormData.personnel || '',
          armement: crcaFormData.armement || '',
          materiel: crcaFormData.materiel || ''
        }]
      })
    })

    const result = await response.json()
    if (response.ok && result.success) {
      statusTitle.value = result.message || '✅ CRCA envoyé !'
      statusMessage.value = `✅ CRCA → Grist numerique.gouv.fr`
      Object.assign(crcaFormData, {})
      return
    }
    throw new Error(result.error || 'Grist CRCA KO')
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRCA'
    statusMessage.value = errorMessage
  }
}

async function submitCrfm (): Promise<void> {
  console.warn('🔍 DEBUG CRFM - Données:', JSON.stringify(crfmFormData, null, 2))

  try {
    const response = await fetch('/api/grist.post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        table: 'CRFM',
        records: [{
          date: crfmFormData.date || '',
          secteur: crfmFormData.secteur || '',
          mission: crfmFormData.mission || '',
          horaire: crfmFormData.horaire || '',
          effectifs: crfmFormData.effectifs || null,
          vlEngages: crfmFormData.vlEngages || null,
          nbOad: crfmFormData.nbOad || null,
          controlesVl: crfmFormData.controlesVl || null,
          controlesPersonne: crfmFormData.controlesPersonne || null,
          nbInterCorgCic: crfmFormData.nbInterCorgCic || null,
          nbInterInitiative: crfmFormData.nbInterInitiative || null,
          rensFrm: crfmFormData.rensFrm || null,
          rensFrs: crfmFormData.rensFrs || null,
          stupCannabis: crfmFormData.stupCannabis || null,
          stupPlant: crfmFormData.stupPlant || null,
          stupAutres: crfmFormData.stupAutres || '',
          TA: crfmFormData.infraTa || null,
          Delits: crfmFormData.infraDelits || null,
          Interpellation_ZGN: crfmFormData.interpZgn || null,
          Interpellation_ZPN: crfmFormData.interpZpn || null,
          caillassageTouchant: crfmFormData.caillassageTouchant || null,
          caillassageNonTouchant: crfmFormData.caillassageNonTouchant || null,
          refusAvecInterp: crfmFormData.refusAvecInterp || null,
          refusSansInterp: crfmFormData.refusSansInterp || null,
          obstacle: crfmFormData.obstacle || null,
          feuHabitation: crfmFormData.feuHabitation || null,
          feuVoitures: crfmFormData.feuVoitures || null,
          feuAutres: crfmFormData.feuAutres || null,
          papafTouchant: crfmFormData.papafTouchant || null,
          papafNonTouchant: crfmFormData.papafNonTouchant || null,
          grenMp7: crfmFormData.grenMp7 || null,
          grenCm6: crfmFormData.grenCm6 || null,
          grenGenlDmp: crfmFormData.grenGenlDmp || null,
          grenGm2l: crfmFormData.grenGm2l || null,
          grenGl304: crfmFormData.grenGl304 || null,
          munLbd40: crfmFormData.munLbd40 || null,
          mun9mm: crfmFormData.mun9mm || null,
          mun556: crfmFormData.mun556 || null,
          mun762: crfmFormData.mun762 || null,
          commentairePam: crfmFormData.commentairePam || ''
        }]
      })
    })

    const result = await response.json()
    if (response.ok && result.success) {
      statusTitle.value = result.message || '✅ CRFM envoyé !'
      statusMessage.value = `✅ CRFM → Grist numerique.gouv.fr`
      Object.assign(crfmFormData, {})
      return
    }
    throw new Error(result.error || 'Grist CRFM KO')
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
    statusTitle.value = '❌ Erreur CRFM'
    statusMessage.value = errorMessage
  }
}

function setActiveTab (tab: 'CRCA' | 'CRFM'): void {
  activeTab.value = tab

  if (tab === 'CRCA') {
    Object.assign(crfmFormData, {})
  }

  if (tab === 'CRFM') {
    Object.assign(crcaFormData, {})
  }
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

    <!-- ✅ BOUTONS DSFR UNIQUEMENT -->
    <div class="fr-grid-row fr-grid-row--center fr-grid-row--gutters fr-mb-5w">
      <div class="fr-col-12 fr-col-md-6">
        <button
          class="fr-btn fr-btn--primary w-100 dsfr-tab-btn"
          :class="{ 'fr-btn--secondary': activeTab !== 'CRCA' }"
          @click="setActiveTab('CRCA')"
        >
          Remontée CRCA
        </button>
      </div>
      <div class="fr-col-12 fr-col-md-6">
        <button
          class="fr-btn fr-btn--primary w-100 dsfr-tab-btn"
          :class="{ 'fr-btn--secondary': activeTab !== 'CRFM' }"
          @click="setActiveTab('CRFM')"
        >
          Remontée CRFM
        </button>
      </div>
    </div>

    <!-- ✅ FORMULAIRES UNIQUEMENT APRÈS CLIC -->
    <div
      v-if="activeTab === 'CRCA'"
      class="fr-mb-5w"
    >
      <div class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-h3">
          Nouvelle remontée CRCA
        </legend>
        <CrcaForm
          v-model="crcaFormData"
          @submit="submitCrca"
        />
      </div>
    </div>

    <div
      v-if="activeTab === 'CRFM'"
      class="fr-mb-5w"
    >
      <div class="fr-fieldset">
        <legend class="fr-fieldset__legend fr-h3">
          Nouvelle remontée CRFM
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
.dsfr-tab-btn {
  border-radius: 8px !important;
  margin-bottom: 1rem;

  &.fr-btn--primary {
    --bg-color: var(--bg-action-high-blue-france) !important;
    --color-contrast: white;
  }

  &.fr-btn--secondary {
    --bg-color: transparent;
    --border-color: var(--border-action-high-blue-france);
    --color: var(--text-action-high-blue-france);

    &:hover {
      --bg-color: var(--bg-action-light-blue-france);
    }
  }
}

@media (max-width: 768px) {
  .dsfr-tab-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
