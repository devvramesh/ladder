import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"
import LoginButton from "./login_button";

export default class Home extends React.Component {
    render() {
        return (
            <div>
                <LoginButton redirectUri={window.location.origin}></LoginButton>
                <h1>Ladder</h1>
                <Link to="/search?category=employee">
                    <button>Find Employees</button>
                </Link>
                <Link to="/search?category=job">
                    <button>See Who's Hiring</button>
                </Link>
            </div>
        )
    }
}
