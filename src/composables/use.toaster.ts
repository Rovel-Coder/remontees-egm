import { ref, type Ref } from 'vue'

const ALPHANUM_BASE = 'abcdefghijklmnopqrstuvwyz0123456789'
const RANDOM_ID_LENGTH = 5
const DEFAULT_TOAST_TIMEOUT = 10000
const DEFAULT_TITLE_TAG = 'h3'
const ALPHANUM_REPEAT_COUNT = 10

const alphanum = ALPHANUM_BASE.repeat(ALPHANUM_REPEAT_COUNT)

function getRandomAlphaNum(): string {
  const randomIndex = Math.floor(Math.random() * alphanum.length)
  return alphanum[randomIndex]
}

function getRandomString(length: number): string {
  return Array.from({ length }).map(getRandomAlphaNum).join('')
}

function getRandomHtmlId(prefix?: string, suffix?: string): string {
  const prefixPart = prefix ? `${prefix}-` : ''
  const suffixPart = suffix ? `-${suffix}` : ''
  return `${prefixPart}${getRandomString(RANDOM_ID_LENGTH)}${suffixPart}`
}

export interface Message {
  id?: string
  title?: string
  description: string
  type?: 'info' | 'success' | 'warning' | 'error'
  closeable?: boolean
  titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  timeout?: number
  style?: Record<string, string>
  class?: string | Record<string, boolean> | (string | Record<string, boolean>)[]
}

interface ToasterReturn {
  messages: Ref<Message[]>
  addMessage: (input: Message | string) => void
  removeMessage: (id: string) => void
  addSuccessMessage: (input: Message | string) => void
  addErrorMessage: (input: Message | string) => void
}

export function useToaster(defaultTimeout = DEFAULT_TOAST_TIMEOUT): ToasterReturn {
  const messages: Ref<Message[]> = ref([])
  const timeouts: Record<string, number> = {}

  function removeMessage(id: string): void {
    const index = messages.value.findIndex(message => message.id === id)
    if (timeouts[id]) {
      clearTimeout(timeouts[id])
      delete timeouts[id]
    }
    if (index !== -1) {
      messages.value.splice(index, 1)
    }
  }

  function addMessage(input: Message | string): void {
    const message: Message = typeof input === 'string' ? { description: input } : { ...input }

    if (message.id && timeouts[message.id]) {
      removeMessage(message.id)
    }

    const finalId = message.id || getRandomHtmlId('toaster')
    const finalTitleTag = message.titleTag || DEFAULT_TITLE_TAG
    const finalCloseable = message.closeable !== undefined ? message.closeable : true
    const finalType = message.type || 'info'
    const finalTimeout = message.timeout || defaultTimeout

    const completeMessage: Message = {
      ...message,
      id: finalId,
      titleTag: finalTitleTag,
      closeable: finalCloseable,
      type: finalType,
      timeout: finalTimeout
    }

    const messageId = String(finalId)
    const timeoutMs = Number(finalTimeout)

    messages.value.push(completeMessage)

    timeouts[messageId] = window.setTimeout(() => {
      removeMessage(messageId)
    }, timeoutMs)
  }

  function addSuccessMessage(input: Message | string): void {
    const msg = typeof input === 'string' ? { description: input } : input
    addMessage({ ...msg, type: 'success' })
  }

  function addErrorMessage(input: Message | string): void {
    const msg = typeof input === 'string' ? { description: input } : input
    addMessage({ ...msg, type: 'error' })
  }

  return { messages, addMessage, removeMessage, addSuccessMessage, addErrorMessage }
}
