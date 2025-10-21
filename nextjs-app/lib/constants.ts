export const APP_CONFIG = {
  MAX_TEXT_LENGTH: 5000,
  DEBOUNCE_DELAY: 500,
  MIN_CHARS_FOR_SMALLER_FONT: 40,
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_THEME: 'mod+j',
  SWAP_LANGUAGES: 'mod+s',
  CLEAR_TEXT: 'mod+x',
  COPY_TRANSLATION: 'mod+c',
} as const;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  TIMEOUT: 10000,
} as const;

export const ANIMATIONS = {
  DURATION: 200,
  EASING: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;
