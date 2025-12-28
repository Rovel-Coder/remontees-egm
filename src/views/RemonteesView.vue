<script setup lang="ts">
import { reactive, ref } from 'vue'

const showCrca = ref(false)
const showCrfm = ref(false)
const statusMessage = ref('')
const statusTitle = ref('')

const crcAFormData = reactive({
  secteur: 'ALPHA',
  indicatifs: 'A1',
  intervention: 'INITIATIVE',
  natureIntervention: '',
  heureDebut: '00:00',
  heureFin: '00:00',
  lieu: '',
  pam: 'PAM_RAS',
  personnel: '',
  armement: '',
  materiel: '',
  resume: ''
})

const crfmFormData = reactive({
  secteur: ''
})

async function submitCrca () {
  const formData = { ...crcAFormData }

  console.warn('🚀 GRIST READY - Copier JSON ci-dessous dans Grist (ID: 287D12LdHqN4hYBpsm52fo)')
  console.warn('JSON CRCA:', formData)

  try {
    const gristPayload = { records: [{ fields: formData }] }
    const response = await fetch('/api/grist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gristPayload)
    })

    if (response.ok) {
      statusTitle.value = '✅ Succès'
      statusMessage.value = 'Remontée CRCA créée dans Grist !'
      showCrca.value = false
      return
    }
  }
  catch {
    // API échouée
  }

  statusTitle.value = '📋 Mode manuel'
  statusMessage.value = 'Copier JSON console pour Grist'
}

function submitCrfm () {
  console.warn('CRFM:', crfmFormData)
  statusTitle.value = '✅ CRFM'
  statusMessage.value = 'Remontée CRFM enregistrée'
  showCrfm.value = false
}
</script>

<template>
  <div class="fr-container fr-mt-5w fr-mb-5w">
    <!-- Header Gendarmerie NC SIMPLIFIÉ (NO LOGO) -->
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

    <!-- Boutons DSFR ALIGNÉS PARFAIT -->
    <div class="fr-grid-row fr-grid-row--center fr-py-4w">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-4 fr-col-xl-3">
        <div class="fr-grid-row fr-grid-row--center">
          <div class="fr-col-xs-12 fr-col-md-6">
            <button
              class="fr-btn fr-btn--primary fr-mb-2w"
              @click="showCrca = true"
            >
              📋 Nouvelle remontée CRCA
            </button>
          </div>
          <div class="fr-col-xs-12 fr-col-md-6">
            <button
              class="fr-btn fr-btn--secondary fr-mb-2w"
              @click="showCrfm = true"
            >
              📋 Nouvelle remontée CRFM
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Status DSFR natif -->
    <div
      v-if="statusMessage"
      class="fr-mt-3w"
    >
      <div class="fr-alert fr-alert--success fr-mb-3w">
        <p class="fr-alert__title">
          {{ statusTitle }}
        </p>
        <p>{{ statusMessage }}</p>
      </div>
    </div>

    <!-- Modal CRCA DSFR natif -->
    <div
      v-if="showCrca"
      class="fr-modal-overlay"
      @click.self="showCrca = false"
    >
      <div class="fr-container fr-modal-container">
        <div class="fr-modal">
          <div class="fr-modal__header">
            <button
              class="fr-btn fr-btn--close-modal"
              @click="showCrca = false"
            >
              Fermer
            </button>
            <h1 class="fr-modal__title">
              📋 Nouvelle remontée CRCA
            </h1>
          </div>
          <form @submit.prevent="submitCrca">
            <fieldset class="fr-fieldset">
              <legend class="fr-fieldset__legend fr-text--lead">
                Détails intervention
              </legend>

              <div class="fr-field-row">
                <label
                  class="fr-label"
                  for="secteur"
                >Secteur</label>
                <select
                  id="secteur"
                  v-model="crcAFormData.secteur"
                  class="fr-select"
                >
                  <option value="ALPHA">
                    ALPHA
                  </option>
                  <option value="BETA">
                    BETA
                  </option>
                  <option value="GAMMA">
                    GAMMA
                  </option>
                </select>
              </div>

              <div class="fr-field-row">
                <label
                  class="fr-label"
                  for="indicatifs"
                >Indicatifs</label>
                <input
                  id="indicatifs"
                  v-model="crcAFormData.indicatifs"
                  placeholder="A1"
                  class="fr-input"
                >
              </div>

              <div class="fr-field-row--md">
                <div class="fr-col">
                  <label
                    class="fr-label"
                    for="intervention"
                  >Intervention</label>
                  <select
                    id="intervention"
                    v-model="crcAFormData.intervention"
                    class="fr-select"
                  >
                    <option value="INITIATIVE">
                      INITIATIVE
                    </option>
                    <option value="INTERVENTION">
                      INTERVENTION
                    </option>
                  </select>
                </div>
                <div class="fr-col">
                  <label
                    class="fr-label"
                    for="natureIntervention"
                  >Nature</label>
                  <input
                    id="natureIntervention"
                    v-model="crcAFormData.natureIntervention"
                    class="fr-input"
                  >
                </div>
              </div>

              <div class="fr-field-row--md">
                <div class="fr-col">
                  <label
                    class="fr-label"
                    for="heureDebut"
                  >Heure début</label>
                  <input
                    id="heureDebut"
                    v-model="crcAFormData.heureDebut"
                    type="time"
                    class="fr-input"
                  >
                </div>
                <div class="fr-col">
                  <label
                    class="fr-label"
                    for="heureFin"
                  >Heure fin</label>
                  <input
                    id="heureFin"
                    v-model="crcAFormData.heureFin"
                    type="time"
                    class="fr-input"
                  >
                </div>
              </div>

              <div class="fr-field-row">
                <label
                  class="fr-label"
                  for="lieu"
                >Lieu</label>
                <input
                  id="lieu"
                  v-model="crcAFormData.lieu"
                  class="fr-input"
                >
              </div>

              <div class="fr-field-row">
                <label
                  class="fr-label"
                  for="pam"
                >PAM</label>
                <select
                  id="pam"
                  v-model="crcAFormData.pam"
                  class="fr-select"
                >
                  <option value="PAM_RAS">
                    PAM_RAS
                  </option>
                  <option value="PAM_ENGAGES">
                    PAM_ENGAGES
                  </option>
                </select>
              </div>

              <div class="fr-field-row">
                <label
                  class="fr-label"
                  for="resume"
                >Résumé</label>
                <textarea
                  id="resume"
                  v-model="crcAFormData.resume"
                  rows="3"
                  class="fr-textarea"
                />
              </div>

              <div class="fr-field-row fr-grid-row--right">
                <button
                  type="submit"
                  class="fr-btn fr-btn--primary"
                >
                  ✅ Envoyer vers Grist
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal CRFM -->
    <div
      v-if="showCrfm"
      class="fr-modal-overlay"
      @click.self="showCrfm = false"
    >
      <div class="fr-container fr-modal-container">
        <div class="fr-modal">
          <div class="fr-modal__header">
            <button
              class="fr-btn fr-btn--close-modal"
              @click="showCrfm = false"
            >
              Fermer
            </button>
            <h1 class="fr-modal__title">
              📋 Nouvelle remontée CRFM
            </h1>
          </div>
          <form @submit.prevent="submitCrfm">
            <div class="fr-field-row">
              <label
                class="fr-label"
                for="crfm-secteur"
              >Secteur</label>
              <input
                id="crfm-secteur"
                v-model="crfmFormData.secteur"
                class="fr-input"
              >
            </div>
            <div class="fr-field-row fr-grid-row--right">
              <button
                type="submit"
                class="fr-btn fr-btn--primary"
              >
                ✅ Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fr-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.fr-modal-container {
  max-width: 80%;
  max-height: 90vh;
}

.fr-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.fr-modal__header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.fr-btn--close-modal {
  margin: -0.75rem;
}
</style>
