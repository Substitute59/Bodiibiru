import fb from 'firebase'

const config = {
  apiKey: process.env.REACT_APP_GJ_API_KEY,
  authDomain: process.env.REACT_APP_GJ_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_GJ_DATABASE_URL,
  projectId: process.env.REACT_APP_GJ_PROJECT_ID,
  storageBucket: process.env.REACT_APP_GJ_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_GJ_MESSAGING_SENDER_ID
}

export const firebase = fb.initializeApp(config)
