import React from 'react'

import Header from '../../component/Header'
import Footer from '../../component/Footer'

import './style.scss'

export default class Application extends React.Component{
  constructor(props){
    super(props)

  }

  render() {
    return (
      <div>
        <Header />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}
