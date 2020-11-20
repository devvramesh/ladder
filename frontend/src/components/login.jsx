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
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/>
                <input type="button" value="Log In" />
                <Link to="/signup">
                    Sign up instead
                </Link>
            </div>
        )
    }
}
