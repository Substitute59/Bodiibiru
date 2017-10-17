// @flow

import React from 'react'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { State } from 'react-powerplug'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { injectIntl } from 'react-intl'
import { css } from 'glamor'

/**
 * Actions
 */
import { login, loginWithFb, loginWithTw } from '../../actions/session'

/**
 * Utils
 */
import { onChange } from '../../utils/input'

/**
 * Styles
 */
const errorStyle = css({
  color: '#F44336',
  fontSize: '14px',
  marginTop: '10px',
  textAlign: 'center'
})

const formStyle = css({
  width: 250,
  margin: '0 auto'
})

const buttonStyle = css({
  marginTop: '10px'
})

const initialState = {
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  error: ''
}

const onSubmit = (state, setState, login) => event => {
  event.preventDefault()
  const { email, password } = state

  login(email.value, password.value).catch(err => {
    setState(state => ({ ...state, error: 'Identifiant ou mot de passe invalide' }))
  })
}

const onClickFb = (setState, loginWithFb) => event => {
  event.preventDefault()

  loginWithFb().catch(err => {
    console.log(err);
    setState(state => ({ ...state, error: 'Erreur fb connect' }))
  })
}

const onClickTw = (setState, loginWithTw) => event => {
  event.preventDefault()

  loginWithTw().catch(err => {
    setState(state => ({ ...state, error: 'Erreur twitter connect' }))
  })
}

type Props = {
  intl: Object,
  login: Function,
  loginWithFb: Function,
  loginWithTw: Function
}

const BaseFormLogin = ({ intl: { formatMessage }, login, loginWithFb, loginWithTw }: Props) => (
  <State initial={initialState}>
    {({ state, setState }) => (
      <form {...formStyle} onSubmit={onSubmit(state, setState, login)}>
        <div>
          <TextField
            id="email"
            type="email"
            fullWidth={true}
            hintText={formatMessage({ id: 'page.login.field.email.label' })}
            floatingLabelText={formatMessage({ id: 'page.login.field.email.label' })}
            errorText={state.email.error}
            onChange={onChange(setState)}
            required
          />
        </div>
        <div>
          <TextField
            id="password"
            type="password"
            fullWidth={true}
            hintText="Mot de passe"
            floatingLabelText="Mot de passe"
            errorText={state.password.error}
            onChange={onChange(setState)}
            required
          />
        </div>
        <br />
        <RaisedButton label="Se connecter" fullWidth primary type="submit" />
        {state.error ? <p {...errorStyle}>{state.error}</p> : null}
        <br />
        <div {...buttonStyle}>
          <RaisedButton
            label="Log in with facebook"
            fullWidth={true}
            secondary={true}
            onClick={onClickFb(setState, loginWithFb)}
          />
        </div>
        <div {...buttonStyle}>
          <RaisedButton
            label="Log in with twitter"
            fullWidth={true}
            secondary={true}
            onClick={onClickTw(setState, loginWithTw)}
          />
        </div>
      </form>
    )}
  </State>
)

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch),
  loginWithFb: bindActionCreators(loginWithFb, dispatch),
  loginWithTw: bindActionCreators(loginWithTw, dispatch)
})

export const FormLogin = connect(null, mapDispatchToProps)(injectIntl(BaseFormLogin))
