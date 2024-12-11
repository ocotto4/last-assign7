import React, { Component } from "react";

class FileUpload extends Component {
  state = {
    file: null,
  };

  handleFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
  };

  handleFileSubmit = (event) => {
    event.preventDefault();
    const { file } = this.state;

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const reader = new FileReader();
    reader.onload = this.processFileContent;
    reader.readAsText(file);
  };

  processFileContent = (e) => {
    const { set_data } = this.props;
    try {
      const json = JSON.parse(e.target.result);
      set_data(json); // Pass parsed JSON data to the parent component
    } catch (error) {
      alert("Invalid JSON file. Please upload a valid JSON file.");
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: "#f0f0f0", padding: "20px" }}>
        <h2>Upload a JSON File</h2>
        <form onSubmit={this.handleFileSubmit}>
          <input
            type="file"
            accept=".json"
            onChange={this.handleFileChange}
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    );
  }
}

export default FileUpload;
