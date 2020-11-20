import React from "react";
import {makeBackendRequest} from "../util"
import {Link} from "react-router-dom";

export default class CreateJob extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };
        }

        render() {
        return (
            <div>
                <input placeholder="Job Title"/>
                <input placeholder="Job Description"/>
                <input placeholder="Job Qualifications"/>
                <input placeholder="Logistics"/>
                <input type="button" value="Save" />
                <input type="button" value="Save & Publish" />
                <Link to="#PLACEHOLDER">
                    Cancel
                </Link>
            </div>
        )
    }
}
