import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"
import LoginButton from "./login_button";
import './home.css'

export default class Home extends React.Component {

    render() {
        const style = {
            width: '200px',
            alignSelf: 'flex-end',
            marginRight: '20px',
            marginTop: '40px'
        };
        return (
            <div className="column">
                <LoginButton style={style} redirectUri={window.location.origin}></LoginButton>
                <h1 className="logo">Ladder</h1>
                <div>
                    <Link to="/search?category=employee">
                        <button className="large-button">Find Employees</button>
                    </Link>
                    <Link to="/search?category=job">
                        <button className="large-button">See Who's Hiring</button>
                    </Link>
                </div>
            </div>
        )
    }
}
