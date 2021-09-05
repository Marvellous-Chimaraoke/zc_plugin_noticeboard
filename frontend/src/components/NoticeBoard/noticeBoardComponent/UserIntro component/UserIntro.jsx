import { Button } from '@material-ui/core'
import React from 'react'
import './UserIntro.css'
import { Link } from 'react-router-dom'
import defaultEdit from './default.svg'

const UserIntro = () => {
  return (
    <div>
      <div className="UserIntro">
        <div className="IntroImg">
          <img src={require("../../../../assets/userintro.svg").default} />
        </div>
        <p>Hey your notice board is empty. notices would <br /> appear here when published.</p>
      </div>
      
    </div>
  )
}

export default UserIntro