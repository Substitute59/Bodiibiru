// @flow

import { SESSION } from '../constants/'

const initialState = {
  isConnected: null
}

export const session = (state = initialState, action) => {
  switch (action.type) {
    case SESSION.SET_CONNECTED:
      return {
        ...state,
        isConnected: action.payload
      }
    default:
      return state
  }
}
