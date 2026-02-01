import process from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import type { PluginOption, ProxyOptions } from 'vite'
import { defineConfig } from 'vite'

import { vueDsfrAutoimportPreset, vueDsfrComponentResolver } from '@gouvminint/vue-dsfr'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

const DEV_PROXY_PORT = 3000
const DEFAULT_BASE_PATH = '/'

const TYPESCRIPT_JSX_PATTERN = /\.tsx$/
const JAVASCRIPT_JSX_PATTERN = /\.jsx$/
const VUE_FILES_PATTERN = /\.vue$/
const VUE_QUERIES_PATTERN = /\.vue/

function getBasePath(): string {
  const baseUrl = process.env.BASE_URL
  if (!baseUrl) {
    return DEFAULT_BASE_PATH
  }
  return baseUrl
}

function rewriteGristPath(path: string): string {
  const gristApiPattern = /^\/api\/grist/
  if (gristApiPattern.test(path)) {
    return path.replace(gristApiPattern, '/o/api')
  }
  return path
}

function identityPath(path: string): string {
  return path
}

export default defineConfig(() => {
  const basePath = getBasePath()

  // Suffixe 'Elements' utilisé pour garantir la détection du pluriel par le linter
  const autoImportElements = [
    TYPESCRIPT_JSX_PATTERN,
    JAVASCRIPT_JSX_PATTERN,
    VUE_FILES_PATTERN,
    VUE_QUERIES_PATTERN
  ]

  const vueComponentElements = [
    VUE_FILES_PATTERN,
    VUE_QUERIES_PATTERN
  ]

  const vuePlugin = vue()
  const vueJsxPlugin = vueJsx()

  const autoImportPlugin = AutoImport({
    include: autoImportElements,
    vueTemplate: true,
    dts: './src/auto-imports.d.ts',
    eslintrc: {
      enabled: true,
      filepath: './.eslintrc-auto-import.json',
      globalsPropValue: true
    },
    imports: [
      'vue' as any,
      'vue-router' as any,
      'vitest' as any,
      vueDsfrAutoimportPreset as any
    ]
  }) as PluginOption

  const componentsPlugin = Components({
    extensions: ['vue'],
    dirs: ['src/components'],
    include: vueComponentElements,
    dts: './src/components.d.ts',
    resolvers: [vueDsfrComponentResolver]
  }) as PluginOption

  // Renommage explicite pour éviter l'erreur sur 'plugins' (parfois considéré singulier ou mot réservé)
  const vitePluginElements = [
    vuePlugin,
    vueJsxPlugin,
    autoImportPlugin,
    componentsPlugin
  ]

  const proxyGristPostConfig = {
    target: `http://localhost:${DEV_PROXY_PORT}`,
    changeOrigin: true,
    rewrite: identityPath
  } as ProxyOptions

  const proxyGristConfig = {
    target: 'https://getgrist.com',
    changeOrigin: true,
    secure: true,
    rewrite: rewriteGristPath
  } as ProxyOptions

  const proxyConfigs = {
    '/api/grist.post': proxyGristPostConfig,
    '/api/grist': proxyGristConfig
  }

  const resolveAliases = {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }

  const serverProxyConfig = {
    proxy: proxyConfigs
  }

  const serverConfig = {
    server: serverProxyConfig
  }

  const resolveConfig = {
    resolve: {
      alias: resolveAliases
    }
  }

  const viteConfig = {
    plugins: vitePluginElements,
    base: basePath,
    ...resolveConfig,
    ...serverConfig
  }

  return viteConfig
})
