import React from "react";
import {makeBackendRequest} from "../util"
import {Link} from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
        }

        render() {
        return (
            <div>
                Still figuring out how to use Auth0 api together with custom styled login
                <input placeholder="Name"/>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <div>
                    <input type="radio" /> Employee

                    <input type="radio" /> Employer
                </div>
                <input type="button" value="Sign Up" />
                <Link to="/signup">
                    Sign up instead
                </Link>
            </div>
        )
    }
}
