import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"
import LoginButton from "./login_button";
import './home.css'

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <LoginButton redirectUri={window.location.origin}></LoginButton>
                <h1 class="logo">Ladder</h1>
                <Link to="/search?category=employee">
                    <button class="large-button">Find Employees</button>
                </Link>
                <Link to="/search?category=job">
                    <button class="large-button">See Who's Hiring</button>
                </Link>
            </div>
        )
    }
}
