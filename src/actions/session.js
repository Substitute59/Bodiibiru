// @flow
import fb from 'firebase'
import { SESSION } from '../constants'
import { firebase } from '../utils/firebase'

export const login = (email, password) => dispatch => {
  return firebase
    .auth()
    .setPersistence(fb.auth.Auth.Persistence.LOCAL)
    .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
    .then(() => dispatch({ type: SESSION.SET_CONNECTED, payload: true }))
    .catch((err) => console.log(err))
}

export const loginWithFb = () => dispatch => {
  const provider = new fb.auth.FacebookAuthProvider();
  return firebase
    .auth()
    .setPersistence(fb.auth.Auth.Persistence.LOCAL)
    .then(() => firebase.auth().signInWithPopup(provider))
    .then(() => dispatch({ type: SESSION.SET_CONNECTED, payload: true }))
    .catch((error) => {
      if (error.code === 'auth/account-exists-with-different-credential') {
        var email = error.email;
        var auth = firebase.auth();
        auth.fetchProvidersForEmail(email).then(function(providers) {
          if (providers[0] === 'password') {
            // TODO : faire un prompt plus beau qui demande si on veut remplacer son compte normal par un compte facebook
            var password = prompt("Cette adresse email est déjà associée à un compte de type email/mot de passe.\nVeuillez saisir votre mot de passe.");
            auth.signInWithEmailAndPassword(email, password)
              .then(() => dispatch({ type: SESSION.SET_CONNECTED, payload: true }));
          }
        });
      }
    });
}

export const loginWithTw = () => dispatch => {
  const provider = new fb.auth.TwitterAuthProvider();
  return firebase
    .auth()
    .setPersistence(fb.auth.Auth.Persistence.LOCAL)
    .then(() => firebase.auth().signInWithPopup(provider))
    .then(() => dispatch({ type: SESSION.SET_CONNECTED, payload: true }))
}

export const logout = () => dispatch => {
  return firebase
    .auth()
    .signOut()
    .then(() => dispatch({ type: SESSION.SET_CONNECTED, payload: false }))
}

export const setUserSession = (user: ?Object) => dispatch =>
  dispatch({ type: SESSION.SET_CONNECTED, payload: !!user })
