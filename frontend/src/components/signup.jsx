import React from "react";

export default class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: "not ready yet!"};
  }

  componentDidMount() {
    console.log("fetching")
    fetch("http://localhost:3001/api/login")
    .then(res => res.json())
    .then(
      (result) => {
        console.log("fetched!");
        console.log(result)
        this.setState({
          data: result.data
        });
        console.log("state changed!");
      }
    )
  }


  render() {
    return (<div>Sign-up Page! Welcome! {this.state.data}</div>)
  }
}
