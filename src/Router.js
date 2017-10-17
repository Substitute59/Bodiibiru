// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Route as BaseRoute, Redirect, Switch, withRouter } from 'react-router-dom'
import { isNull } from 'lodash'

/**
 * Pages
 */
import { PageHome, PageLogin, PageLoading } from './views/'

export const Route = connect(({ session }) => ({
  isConnected: session.isConnected
}))(props => {
  const { isConnected, isPrivate } = props

  if (isNull(isConnected)) {
    return <BaseRoute component={PageLoading} />
  }

  if (isPrivate && !isConnected) {
    return <Redirect to="/login" />
  }

  if (['/login'].includes(window.location.pathname) && isConnected) {
    return <Redirect to="/" />
  }

  return <BaseRoute {...props} />
})

class BasePageContainer extends React.Component {
  render () {
    return (
      <Switch>
        {/* Public */}
        <Route path="/login" component={PageLogin} />

        {/* Private */}
        <Route path="/" component={PageHome} exact isPrivate />
      </Switch>
    )
  }

  _openDrawer = () => {
    this.setState(state => ({ ...state, isDrawerOpen: true }))
  };
}

export const AppRouter = withRouter(BasePageContainer)
