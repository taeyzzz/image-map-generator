import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Header from '../../component/Header'

import './style.scss'

export default class Application extends React.Component{
  constructor(props){
    super(props)

  }

  render() {
    return (
      <MuiThemeProvider>
        <Header />
        {this.props.children}
      </MuiThemeProvider>
    )
  }
}
