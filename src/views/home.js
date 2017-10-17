// @flow

import React from 'react'
import { State } from 'react-powerplug'
import { css } from 'glamor'
import { connect } from 'react-redux'

/**
 * Components
 */
import { Navigation } from '../components/ui/'

/**
 * Styles
 */

const pageStyle = css({
  backgroundColor: '#f5f5f5',
  height: '100%'
})

const containerStyle = css({
  maxWidth: '960px',
  margin: '2rem auto'
})

const BasePageHome = (props: Props) => (
  <div {...pageStyle}>
    <Navigation />
    <State initial={{ isDropdownOpen: false }}>
      {({ state, setState }) => (
        <div {...containerStyle}>
          
        </div>
      )}
    </State>
  </div>
)

export const PageHome = connect()(BasePageHome)
