import React from "react";
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

    this.state = {
      selectedIndex: 0,
      entries: this.props.entries
    }
  }

  select = (index) => {
    return () => this.setState({ selectedIndex: index })
  }

  createPreviews = () => {
    const entries = this.state.entries.map((entry, i) => {
      const selected = (i === this.state.selectedIndex)
      return (
        <div
          key={i}
          className={`pointer border sidebar-entry
            ${selected ? "sidebar-selected" : ""}`}
          onClick={this.select(i)}>
          <div className="sidebar-preview-outer">
            <div className="sidebar-preview-inner">
              {this.props.displayPreview(entry)}
            </div>
            <div className="sidebar-arrow">
              &rarr;
            </div>
          </div>
        </div>);
    });

    return (<div className="sidebar-preview-pane">
      {entries}
    </div>);
  }

  displaySelected = () => {
    const index = this.state.selectedIndex
    const entries = this.state.entries.slice()
    const selected = entries[index]

    const deleteFn = () => {
      entries.splice(index, index + 1)
      this.setState({
        entries: entries
      })
    }

    return selected ? this.props.displayEntry(selected, deleteFn) : null;
  }

  render() {
    // TODO: put these side-by-side instead of vertical.
    // maybe introduce a max-height + scroll-on-overflow for the item pane
    if (this.state.entries.length === 0) {
      return null;
    }

    return (<div className="sidebar-outer border">
      {this.createPreviews()}
      <div className="sidebar-item-pane">{this.displaySelected()}</div>
    </div>)
  }
}
