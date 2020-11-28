import React from "react";
import {Link} from "react-router-dom";
import {makeBackendRequest} from "../util"
import './sidebar.css'

// NOTE(jake):
// Required props:
//    entries:        an array of JS objects corresponding with each entry
//
//    displayPreview: a function within the parent component which
//                    takes in an entry from [entries] and returns
//                    the HTML display for its sidebar preview
//
//    displayEntry:  a function within the parent component which
//                    takes in an entry from [entries] and returns
//                    the HTML display for it
//
//    ifEmpty:       a component to display in place of an empty sidebar
export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);

    console.log('Sidebar:')
    console.log(this.props)

    this.state = {
      selectedIndex: 0
    }
  }

  select = (index) => {
    return () => this.setState({ selectedIndex: index })
  }

  createPreviews = () => {
    console.log(this.props)
    const entries = this.props.entries.map((entry, i) => {
      const selected = (i === this.state.selectedIndex)
      return (
        <div
          key={i}
          className={`pointer border sidebar-entry
            ${selected ? "sidebar-selected" : ""}`}
          onClick={this.select(i)}>
          {this.props.displayPreview(entry)}
        </div>);
    });

    return (<div className="sidebar-preview-pane">
      {entries}
      <p>TODO: make this scroll if taller than the right (item) pane. see sidebar.jsx and sidebar.css</p>
    </div>);
  }

  displaySelected = () => {
    const selected = this.props.entries[this.state.selectedIndex]
    return selected ? this.props.displayEntry(selected) : null;
  }

  render() {
    // TODO: put these side-by-side instead of vertical.
    // maybe introduce a max-height + scroll-on-overflow for the item pane
    if (this.props.entries.length === 0) {
      return this.props.ifEmpty;
    }

    return (<div className="sidebar-outer border">
      {this.createPreviews()}
      <div className="sidebar-item-pane">{this.displaySelected()}</div>
    </div>)
  }
}
