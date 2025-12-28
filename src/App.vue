<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'

useScheme()

const searchQuery = ref('')

const serviceTitle = 'Gendarmerie Nationale'
const serviceDescription = 'Déclaration des remontées EGM en Nouvelle Calédonie EGM 26/5'
const logoText = ['Ministère', 'de l\'intérieur']

// ✅ SUPPRIMÉ quickLinks (bouton Remontée)
</script>

<template>
  <div id="app">
    <!-- ✅ HEADER SANS RECHERCHE + SANS BOUTON - TS FIX -->
    <DsfrHeader
      v-model="searchQuery"
      :service-title="serviceTitle"
      :service-description="serviceDescription"
      :logo-text="logoText"
      :quick-links="[]"
      :show-search="false"
    />

    <div class="fr-container fr-mt-3w fr-mt-md-5w fr-mb-5w">
      <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: var(--wds-background-contrast);
}
</style>
