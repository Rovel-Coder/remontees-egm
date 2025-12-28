<script setup lang="ts">
import { reactive, ref } from 'vue'

const showCrca = ref(false)
const showCrfm = ref(false)
const statusMessage = ref('')
const statusTitle = ref('')

// Formulaires réactifs
const crcAFormData = reactive({
  secteur: 'ALPHA',
  indicatifs: [] as string[],
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

// SUBMIT GRIST API AUTO (fetch natif)
async function submitCrca () {
  const formData = { ...crcAFormData }

  // Format EXACT Grist API
  const gristPayload = {
    records: [{
      fields: {
        secteur: formData.secteur,
        indicatifs: Array.isArray(formData.indicatifs) ? formData.indicatifs.join(',') : formData.indicatifs,
        intervention: formData.intervention,
        natureIntervention: formData.natureIntervention,
        heureDebut: formData.heureDebut,
        heureFin: formData.heureFin,
        lieu: formData.lieu,
        pam: formData.pam,
        personnel: formData.personnel || '',
        armement: formData.armement || '',
        materiel: formData.materiel || '',
        resume: formData.resume
      }
    }]
  }

  try {
    const response = await fetch('/api/grist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gristPayload)
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    statusTitle.value = '✅ Succès'
    statusMessage.value = 'Remontée CRCA créée dans Grist !'
    showCrca.value = false

    // Reset formulaire
    Object.assign(crcAFormData, {
      secteur: 'ALPHA',
      indicatifs: [],
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
  }
  catch {
    statusTitle.value = '📋 Mode manuel'
    statusMessage.value = 'Copier JSON console pour Grist (ID: 287D12LdHqN4hYBpsm52fo)'

    console.warn('🚀 GRIST READY - Copier JSON ci-dessous')
    console.warn('JSON CRCA:', formData)
    console.warn('JSON Grist API:', gristPayload)
  }
}

async function submitCrfm () {
  console.warn('CRFM submit:', crfmFormData)
  statusTitle.value = '✅ CRFM'
  statusMessage.value = 'Remontée CRFM enregistrée (console)'
  showCrfm.value = false
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
              <div class="fr-header__logo">
                <p class="fr-logo">
                  République<br>Française
                </p>
              </div>
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

    <!-- Boutons principales -->
    <div class="fr-grid-row fr-grid-row--center">
      <div class="fr-col-12 fr-col-md-6 fr-col-lg-4">
        <DsfrButton
          class="fr-mb-3w"
          @click="showCrca = true"
        >
          📋 Nouvelle remontée CRCA
        </DsfrButton>
        <DsfrButton
          variant="secondary"
          class="fr-mb-3w"
          @click="showCrfm = true"
        >
          📋 Nouvelle remontée CRFM
        </DsfrButton>
      </div>
    </div>

    <!-- Messages de statut -->
    <div
      v-if="statusMessage"
      class="fr-mt-3w"
    >
      <DsfrAlert
        :title="statusTitle"
        :description="statusMessage"
      />
    </div>

    <!-- Formulaire CRCA -->
    <DsfrModal
      v-model="showCrca"
      title="📋 Nouvelle remontée CRCA"
    >
      <form
        class="fr-col-12"
        @submit.prevent="submitCrca"
      >
        <div class="fr-fieldset">
          <DsfrFieldset legend="Détails intervention">
            <div class="fr-field-row">
              <label
                class="fr-label"
                for="secteur"
              >Secteur</label>
              <DsfrSelect
                id="secteur"
                v-model="crcAFormData.secteur"
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
              </DsfrSelect>
            </div>

            <div class="fr-field-row">
              <label
                class="fr-label"
                for="indicatifs"
              >Indicatifs</label>
              <DsfrInputMultiple
                id="indicatifs"
                v-model="crcAFormData.indicatifs"
                placeholder="A1"
              />
            </div>

            <div class="fr-field-row--md">
              <div class="fr-col">
                <label
                  class="fr-label"
                  for="intervention"
                >Intervention</label>
                <DsfrSelect
                  id="intervention"
                  v-model="crcAFormData.intervention"
                >
                  <option value="INITIATIVE">
                    INITIATIVE
                  </option>
                  <option value="INTERVENTION">
                    INTERVENTION
                  </option>
                </DsfrSelect>
              </div>
              <div class="fr-col">
                <label
                  class="fr-label"
                  for="natureIntervention"
                >Nature</label>
                <DsfrInput
                  id="natureIntervention"
                  v-model="crcAFormData.natureIntervention"
                />
              </div>
            </div>

            <div class="fr-field-row--md">
              <div class="fr-col">
                <label
                  class="fr-label"
                  for="heureDebut"
                >Heure début</label>
                <DsfrInput
                  id="heureDebut"
                  v-model="crcAFormData.heureDebut"
                  type="time"
                />
              </div>
              <div class="fr-col">
                <label
                  class="fr-label"
                  for="heureFin"
                >Heure fin</label>
                <DsfrInput
                  id="heureFin"
                  v-model="crcAFormData.heureFin"
                  type="time"
                />
              </div>
            </div>

            <div class="fr-field-row">
              <label
                class="fr-label"
                for="lieu"
              >Lieu</label>
              <DsfrInput
                id="lieu"
                v-model="crcAFormData.lieu"
              />
            </div>

            <div class="fr-field-row">
              <label
                class="fr-label"
                for="pam"
              >PAM</label>
              <DsfrSelect
                id="pam"
                v-model="crcAFormData.pam"
              >
                <option value="PAM_RAS">
                  PAM_RAS
                </option>
                <option value="PAM_ENGAGES">
                  PAM_ENGAGES
                </option>
              </DsfrSelect>
            </div>

            <div class="fr-field-row">
              <label
                class="fr-label"
                for="resume"
              >Résumé</label>
              <DsfrTextarea
                id="resume"
                v-model="crcAFormData.resume"
                rows="3"
              />
            </div>
          </DsfrFieldset>

          <div class="fr-field-row">
            <DsfrButton
              type="submit"
              primary
            >
              ✅ Envoyer vers Grist
            </DsfrButton>
          </div>
        </div>
      </form>
    </DsfrModal>

    <!-- Formulaire CRFM -->
    <DsfrModal
      v-model="showCrfm"
      title="📋 Nouvelle remontée CRFM"
    >
      <form
        class="fr-col-12"
        @submit.prevent="submitCrfm"
      >
        <div class="fr-fieldset">
          <DsfrFieldset legend="Détails mission CRFM">
            <div class="fr-field-row">
              <label
                class="fr-label"
                for="crfm-secteur"
              >Secteur</label>
              <DsfrInput
                id="crfm-secteur"
                v-model="crfmFormData.secteur"
              />
            </div>
            <div class="fr-field-row">
              <DsfrButton
                type="submit"
                primary
              >
                ✅ Envoyer vers Grist
              </DsfrButton>
            </div>
          </DsfrFieldset>
        </div>
      </form>
    </DsfrModal>
  </div>
</template>
