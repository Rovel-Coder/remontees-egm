<script setup lang="ts">
import { ref } from 'vue'
import CrcaForm from '@/components/CrcaForm.vue'
import CrfmForm from '@/components/CrfmForm.vue'

const activeForm = ref<'crca' | 'crfm' | null>(null)

const crcaData = ref({})
const crfmData = ref({})

function handleSubmitCrca () {
  // TODO : envoyer crcaData.value vers Grist
}

function handleSubmitCrfm () {
  // TODO : envoyer crfmData.value vers Grist
}
</script>

<template>
  <div class="fr-container fr-mt-3w fr-mb-5w">
    <h1 class="fr-h2">
      Remontées EGM
    </h1>

    <p class="fr-text--sm fr-mb-3w">
      Sélectionnez le type de remontée à déclarer.
    </p>

    <div class="fr-btns-group fr-btns-group--inline fr-mb-4w">
      <DsfrButton
        :secondary="activeForm !== 'crca'"
        @click="activeForm = 'crca'"
      >
        Remontée CRCA
      </DsfrButton>

      <DsfrButton
        :secondary="activeForm !== 'crfm'"
        @click="activeForm = 'crfm'"
      >
        Remontée CRFM
      </DsfrButton>
    </div>

    <section v-if="activeForm === 'crca'">
      <CrcaForm
        v-model="crcaData"
        @submit="handleSubmitCrca"
      />
    </section>

    <section v-if="activeForm === 'crfm'">
      <CrfmForm
        v-model="crfmData"
        @submit="handleSubmitCrfm"
      />
    </section>
  </div>
</template>
