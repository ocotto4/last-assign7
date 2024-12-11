import React, { Component } from "react";
import FileUpload from "./FileUpload";
import Child1 from "./Child1";
import * as d3 from "d3";

class App extends Component {
  state = {
    tweets: [], // to store the parsed tweet data
  };

  setTweets = (data) => {
    const width = 800;
    const height = 800;

    const monthRegions = {
      March: height / 5,
      April: height / 2,
      May: (4 * height) / 5,
    };

    const simulation = d3
      .forceSimulation(data.slice(0, 300))
      .force("x", d3.forceX(width / 2).strength(0.19))
      .force("y", d3.forceY((d) => monthRegions[d.Month]).strength(1.3))
      .force("charge", d3.forceManyBody().strength(-15.5))
      .force("collision", d3.forceCollide(7))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    const tweetsWithPosition = data.map((tweet, idx) => ({
      ...tweet,
      x: simulation.nodes()[idx]?.x || 0,
      y: simulation.nodes()[idx]?.y || 0,
    }));

    this.setState({ tweets: tweetsWithPosition });
  };

  render() {
    const { tweets } = this.state;

    return (
      <div>
        <FileUpload set_data={this.setTweets} />
        <Child1 tweets={tweets} />
      </div>
    );
  }
}

export default App;
