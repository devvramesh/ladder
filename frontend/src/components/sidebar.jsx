import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"

// NOTE(jake):
// Required props:
//    entries:        an array of JS objects corresponding with each entry
//
//    displayPreview: a function within the parent component which
//                    takes in an entry from [entries] and returns
//                    the HTML display for its sidebar preview
//
//    onSelect:       a function within the parent component.
//                    when a sidebar item is selected, its index
//                    within the sidebar is passed to onSelect.
//                    So, onSelect(index) will be called in the parent
//                    component, which should then set its state
//                    to render the new selection. see:Search.
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0
    }
  }

  select = (index) => {
    return () => this.props.onSelect(index);
  }

  createPreviews = () => {
    console.log(this.props)
    const entries = this.props.entries.map((entry, i) => {
      return (
        <li key={i} className="border" onClick={this.select(i)}>
          {this.props.displayPreview(entry)}
        </li>);
    });

    return (<div>
      <ul>{entries}</ul>
    </div>);
  }

  render() {
    return (<div className="border">[Sidebar component]
      <div>[Entries] {this.createPreviews()}</div>
    </div>)
  }
}
