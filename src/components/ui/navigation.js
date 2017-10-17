// @flow

import React from 'react'
import AppBar from 'material-ui/AppBar'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import { css } from 'glamor'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

/**
 * Actions
 */
import { logout } from '../../actions/session'

/**
 * Styles
 */
const appBarStyle = css({
  backgroundColor: '#1565C0 !important'
})

type Props = {
  logout: Function
}

const BaseNavigation = (props: Props) => (
  <AppBar
    title="Bodiibiru"
    {...appBarStyle}
    iconElementRight={
      <IconMenu
        iconButtonElement={
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        }
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Se déconnecter" onClick={props.logout} />
      </IconMenu>
    }
  />
)

const mapDispatchToProps = dispatch => ({
  logout: bindActionCreators(logout, dispatch)
})

export const Navigation = connect(null, mapDispatchToProps)(BaseNavigation)
