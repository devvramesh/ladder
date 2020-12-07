
import React from "react";
import {Link} from "react-router-dom";
import LoginButton from "./login_button";
import './home.css'

export default class Home extends React.Component {

    render() {
        const style = {
            width: '200px',
            alignSelf: 'flex-end',
            marginRight: '20px',
            marginTop: '40px',
            backgroundColor: '#A96562',
            padding: '15px 30px',
            fontSize: '30pt'
        };
        return (
            <div className="column">
                <LoginButton style={style} redirectUri={`${window.location.origin}/profile`}></LoginButton>
                <h1 className="logo" id="home-logo">Ladder</h1>
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
