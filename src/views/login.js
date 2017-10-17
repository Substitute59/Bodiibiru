// @flow

import React from 'react'
import { css } from 'glamor'
import Paper from 'material-ui/Paper'
import { injectIntl } from 'react-intl'

/**
 * Components
 */
import { FormLogin } from '../components/form/'

/**
 * Styles
 */
const pageStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1565C0'
})

const containerStyle = css({
  padding: '20px 30px'
})

class BasePageLogin extends React.Component {
  props: {
    intl: Object
  };

  render () {
    return (
      <div {...pageStyle}>
        <Paper zDepth={2} {...containerStyle}>
          <FormLogin />
        </Paper>
      </div>
    )
  }
}

export const PageLogin = injectIntl(BasePageLogin)
