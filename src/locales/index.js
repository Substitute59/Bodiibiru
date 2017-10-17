// @flow

import { addLocaleData } from 'react-intl'
import genericLocaleFR from 'react-intl/locale-data/fr'
import genericLocaleEN from 'react-intl/locale-data/en'
import { fr } from './fr'
import { en } from './en'

/**
 *
 */
export const getLanguage = (): string =>
  (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage

/**
 *
 */
export const getMessages = (language: string): Object => {
  const locales = { en, fr }

  const sanitizeLanguage = (str: string): string => str.toLowerCase().split(/[_-]+/)[0]

  return locales[sanitizeLanguage(language)] || locales[language] || locales.en
}

/**
 *
 */
export const setupIntl = (language: string): void => {
  addLocaleData([...genericLocaleEN, ...genericLocaleFR])
}
