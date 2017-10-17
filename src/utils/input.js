// @flow

export const onChange = (setState: Function) => (event: Object) => {
  const { id, value } = event.target

  setState(state => ({
    ...state,
    [id]: {
      value,
      error: ''
    }
  }))
}
