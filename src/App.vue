<script setup lang="ts">
import { useScheme } from '@gouvminint/vue-dsfr'
import { ref } from 'vue'

useScheme()

const searchQuery = ref('')

const serviceTitle = 'Gendarmerie Nationale'
const serviceDescription = 'Déclaration des remontées EGM en Nouvelle Calédonie EGM 26/5'
const logoText = ['Ministère', 'de l\'intérieur']

const quickLinks = [
  {
    label: 'Remontées',
    to: '/remontees',
    icon: 'ri-flag-line',
  },
]
</script>

<template>
  <div id="app">
    <!-- Header Gendarmerie (inchangé) -->
    <DsfrHeader
      v-model="searchQuery"
      :service-title="serviceTitle"
      :service-description="serviceDescription"
      :logo-text="logoText"
      :quick-links="quickLinks"
      show-search
    />

    <!-- Contenu principal avec formulaires -->
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
