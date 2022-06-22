import React from 'react'
import { render } from '@testing-library/react'
import { App } from '../App'

describe('App test', () => {
  it('to render app', () => {
    render(<App />)

    const appContainer = document.querySelector('.app')

    expect(appContainer).toBeInTheDocument()
  })
})