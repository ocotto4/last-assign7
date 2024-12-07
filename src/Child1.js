import React, { Component } from 'react';
import * as d3 from 'd3';

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colorType: 'Sentiment',
      selectedTweets: []
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.tweetsData !== this.props.tweetsData || prevState.colorType !== this.state.colorType) {
      this.createVisualization(this.props.tweetsData, this.state.colorType);
    }
  }

  createVisualization = (data, colorType) => {
    const width = 1500;
    const height = 500;

    const sentimentColorScale = d3.scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);

    const subjectivityColorScale = d3.scaleLinear()
      .domain([0, 1])
      .range(["#ECECEC", "#4467C4"]);

    const colorScale = colorType === 'Sentiment' ? sentimentColorScale : subjectivityColorScale;

    const monthGroups = d3.group(data, d => d.Month);
    const months = Array.from(monthGroups.keys());

    const svg = d3.select("#chart")
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const groupWidth = width / months.length;

    months.forEach((month, i) => {
      const groupData = monthGroups.get(month);

      const monthGroup = svg.append("g")
        .attr("transform", `translate(${i * groupWidth + 80}, 100)`);

      monthGroup.append("text")
        .attr("x", groupWidth / 2)
        .attr("y", -20)
        .text(month)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("fill", "black");

      const circleGroup = monthGroup.append("g");

      const simulation = d3.forceSimulation(groupData)
        .force('x', d3.forceX(groupWidth / 2).strength(0.5))
        .force('y', d3.forceY(height / 2).strength(0.1))
        .force('collide', d3.forceCollide(10))
        .stop();

      const circles = circleGroup.selectAll("circle")
        .data(groupData)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("fill", d => colorScale(d[colorType]))
        .attr("opacity", 0.8)
        .on("click", (event, d) => this.handleTweetClick(event, d, groupData));

      simulation.on("tick", () => {
        circles
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

      simulation.alpha(1).restart();
    });

    this.updateLegend(colorScale);
  };

  updateLegend = (colorScale, colorType) => {
    const legendWidth = 300;
    const legendHeight = 20;

    const svg = d3.select("#legend");
    svg.selectAll("*").remove();

    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");

    gradient.selectAll("stop")
      .data(colorScale.range())
      .enter().append("stop")
      .attr("offset", (d, i) => `${(i / (colorScale.range().length - 1)) * 100}%`)
      .attr("stop-color", d => d);

    svg.append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#gradient)");

    const labelYOffset = legendHeight + 25;

    if (colorType === "Sentiment") {
      svg.append("text")
        .attr("x", 0)
        .attr("y", labelYOffset)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Negative");

      svg.append("text")
        .attr("x", legendWidth)
        .attr("y", labelYOffset)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Positive");
    } else if (colorType === "Subjectivity") {
      svg.append("text")
        .attr("x", 0)
        .attr("y", labelYOffset)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Objective");

      svg.append("text")
        .attr("x", legendWidth)
        .attr("y", labelYOffset)
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text("Subjective");
    }

    svg.attr("width", legendWidth).attr("height", labelYOffset + 20);
  };

  handleColorTypeChange = (event) => {
    this.setState({ colorType: event.target.value });
  };

  handleTweetClick = (event, tweet, groupData) => {
    const { selectedTweets } = this.state;
    let updatedTweets;

    if (selectedTweets.some(selectedTweet => selectedTweet.idx === tweet.idx)) {
      updatedTweets = selectedTweets.filter(selectedTweet => selectedTweet.idx !== tweet.idx);
      d3.select(event.target).attr("stroke", null);
    } else {
      updatedTweets = [tweet, ...selectedTweets];
      d3.select(event.target).attr("stroke", "black").attr("stroke-width", 2);
    }

    this.setState({ selectedTweets: updatedTweets });
  };

  renderLegend = () => {
    return (
      <svg id="legend" style={{ marginBottom: "20px" }}></svg>
    );
  };

  render() {
    return (
      <div>
        <select onChange={this.handleColorTypeChange} value={this.state.colorType}>
          <option value="Sentiment">Sentiment</option>
          <option value="Subjectivity">Subjectivity</option>
        </select>

        {this.renderLegend()}

        <svg id="chart"></svg>

        <div id="selectedTweets" style={{ marginTop: "20px" }}>
          <h3>Selected Tweets</h3>
          <ul>
            {this.state.selectedTweets.map((tweet, index) => (
              <li key={tweet.idx}>
                <strong>{tweet.RawTweet}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Child1;
