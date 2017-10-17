import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { AppRouter } from './Router'

/**
 * Utils
 */
import 'reset-css/reset.css'
import { store } from './store'
import { setupIntl, getLanguage, getMessages } from './locales'
import { firebaseObserver } from './firebaseObserver'

const language = getLanguage()
const messages = getMessages(language)
setupIntl(language)
firebaseObserver()

const App = () => (
  <Provider store={store}>
    <IntlProvider locale={language} messages={messages}>
      <MuiThemeProvider>
        <Router>
          <AppRouter />
        </Router>
      </MuiThemeProvider>
    </IntlProvider>
  </Provider>
)

ReactDOM.render(<App />, document.getElementById('root'))
