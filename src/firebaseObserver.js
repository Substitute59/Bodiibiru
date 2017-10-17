// @flow

/**
 * Actions
 */
import { setUserSession } from './actions/session'

/**
 * Utils
 */
import { firebase } from './utils/firebase'
import { store } from './store'

export const firebaseObserver = () => {
  firebase.auth().onAuthStateChanged((user: Object) => {
    store.dispatch(setUserSession(user))
  })
}
