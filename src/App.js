import React, { Component } from 'react';
import FileUpload from './FileUpload';
import Child1 from './Child1';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweetsData: [], // To store the uploaded tweets data
    };
  }

  setData = (data) => {
    // Slice the data to the first 300 entries
    const slicedData = data.slice(0, 300);
    this.setState({ tweetsData: slicedData });
  };

  render() {
    const { tweetsData } = this.state;

    return (
      <div>
        <FileUpload setData={this.setData} />
        <Child1 tweetsData={tweetsData} />
      </div>
    );
  }
}

export default App;
