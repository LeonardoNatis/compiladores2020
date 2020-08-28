import React, { Component } from "react";

class Upload extends Component {
  constructor(props) {
    super(props);
  }

  showFile = async (event) => {
    event.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      console.log(text);
      this.props.onChangefile(text);
    };
    reader.readAsText(event.target.files[0]);
  };

  render = () => {
    return (
      <div>
        <input type="file" onChange={(event) => this.showFile(event)} />
      </div>
    );
  };
}

export default Upload;
