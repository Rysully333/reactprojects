import React from "react"
import kanePic from '../assets/kanepic.png'

export default function Header() {
    return(
        <header>
            <img src={kanePic} width="100%" />
            <h2>Patrick Kane</h2>
            <h4>Left Forward</h4>

            <a className="espn" href="https://www.espn.com/nhl/player/_/id/3735/patrick-kane">
                ESPN Profile
            </a>

        </header>
    )
}