// @flow

import React from 'react'
import { css } from 'glamor'
import CircularProgress from 'material-ui/CircularProgress'

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

export const PageLoading = props => (
  <div {...pageStyle}>
    <CircularProgress size={80} thickness={5} />
  </div>
)
