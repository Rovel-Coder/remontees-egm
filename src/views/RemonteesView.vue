<script setup lang="ts">
import type { CrcaModel, CrfmModel } from '@/types'
import { onMounted, ref } from 'vue'
import CrcaForm from '@/components/CrcaForm.vue'
import CrfmForm from '@/components/CrfmForm.vue'
import { gristService } from '@/services/gristService'

const activeTab = ref<'none' | 'crca' | 'crfm'>('none')
const successMsg = ref('')
const statusMsg = ref({ title: '', description: '' } as { title: string, description: string })

const crcaFormData = ref<Partial<CrcaModel>>({})
const crfmFormData = ref<Partial<CrfmModel>>({})

function selectCrca () {
  activeTab.value = 'crca'
  crcaFormData.value = {}
}

function selectCrfm () {
  activeTab.value = 'crfm'
  crfmFormData.value = {}
}

onMounted(() => {
  const _crcaDraft = gristService.loadDraft('CRCA')
  const _crfmDraft = gristService.loadDraft('CRFM')

  if (_crcaDraft) {
    crcaFormData.value = _crcaDraft
    statusMsg.value = { title: 'Brouillon chargé', description: 'CRCA restauré' }
  }

  setTimeout(() => statusMsg.value = { title: '', description: '' }, 3000)
})

async function handleSubmitCrca () {
  const result = await gristService.submitCrca(crcaFormData.value)
  successMsg.value = result.message
  gristService.clearDraft('CRCA')
  crcaFormData.value = {}
  activeTab.value = 'none' // Retour accueil
  setTimeout(() => successMsg.value = '', 5000)
}

async function handleSubmitCrfm () {
  const result = await gristService.submitCrfm(crfmFormData.value) // ✅ FIX submitCrfm
  successMsg.value = result.message
  gristService.clearDraft('CRFM')
  crfmFormData.value = {}
  activeTab.value = 'none' // Retour accueil
  setTimeout(() => successMsg.value = '', 5000)
}
</script>

<template>
  <div class="fr-grid-row fr-grid-row--center">
    <div class="fr-col-12 fr-col-lg-10">
      <header class="fr-mb-5w">
        <h1 class="fr-h1">
          Remontées EGM
        </h1>
        <p class="fr-text-lg">
          CRCA / CRFM - Gendarmerie Nationale
        </p>
      </header>

      <!-- Statut -->
      <DsfrAlert
        v-if="statusMsg.title"
        :title="statusMsg.title"
        :description="statusMsg.description"
        closable
      />

      <!-- BOUTONS DSFR (comme image) -->
      <div class="fr-grid-row fr-grid-row--gutters fr-mb-5w">
        <div class="fr-col-12 fr-col-md-6">
          <DsfrButton
            size="lg"
            class="fr-mb-2w"
            @click="selectCrca"
          >
            📋 Nouvelle remontée CRCA
          </DsfrButton>
        </div>
        <div class="fr-col-12 fr-col-md-6">
          <DsfrButton
            size="lg"
            class="fr-mb-2w"
            @click="selectCrfm"
          >
            📊 Nouvelle remontée CRFM
          </DsfrButton>
        </div>
      </div>

      <!-- Formulaire CRCA -->
      <div v-if="activeTab === 'crca'">
        <CrcaForm
          v-model="crcaFormData"
          @submit="handleSubmitCrca"
        />
      </div>

      <!-- Formulaire CRFM -->
      <div v-if="activeTab === 'crfm'">
        <CrfmForm
          v-model="crfmFormData"
          @submit="handleSubmitCrfm"
        />
      </div>

      <!-- Succès -->
      <DsfrAlert
        v-if="successMsg"
        title="✅ Succès !"
        :description="successMsg"
        type="success"
        closable
        @close="successMsg = ''"
      />
    </div>
  </div>
</template>
