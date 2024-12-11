import React, { Component } from "react";
import * as d3 from "d3";

class Child1 extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      selectedColorMode: "Sentiment", // default color mode
      highlightedTweets: [], // list of selected tweets
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.tweets !== this.props.tweets ||
      prevState.selectedColorMode !== this.state.selectedColorMode
    ) {
      this.renderVisualization();
    }
  }

  renderVisualization() {
    const { selectedColorMode, highlightedTweets } = this.state;
    const { tweets } = this.props;

    const svgWidth = 800;
    const svgHeight = 800;
    const marginConfig = { top: 100, right: 50, bottom: 50, left: 120 };

    d3.select(this.svgRef.current).selectAll("*").remove();

    const svgContainer = d3
      .select(this.svgRef.current)
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

    const sentimentScale = d3
      .scaleLinear()
      .domain([-1, 0, 1])
      .range(["red", "#ECECEC", "green"]);
    const subjectivityScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range(["#ECECEC", "#4467C4"]);

    const colorScalesMap = {
      Sentiment: sentimentScale,
      Subjectivity: subjectivityScale,
    };

    const currentColorScale = colorScalesMap[selectedColorMode];

    // Draw tweet circles
    svgContainer
      .selectAll("circle")
      .data(tweets)
      .enter()
      .append("circle")
      .attr("cx", (tweet) => tweet.x)
      .attr("cy", (tweet) => tweet.y)
      .attr("r", 6)
      .attr("fill", (tweet) => currentColorScale(tweet[selectedColorMode]))
      .attr("stroke", (tweet) =>
        highlightedTweets.some((highlightedTweet) => highlightedTweet.idx === tweet.idx) ? "black" : "none"
      )
      .attr("stroke-width", 1.5)
      .on("click", (event, tweet) => this.toggleTweetSelection(tweet));

    // Draw month labels
    const monthPositions = {
      March: svgHeight / 5,
      April: svgHeight / 2,
      May: (4 * svgHeight) / 5,
    };

    svgContainer
      .selectAll(".month-label")
      .data(Object.keys(monthPositions))
      .enter()
      .append("text")
      .attr("x", marginConfig.left - 65)
      .attr("y", (month) => monthPositions[month])
      .attr("dy", "0.35em")
      .style("text-anchor", "end")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .text((month) => month);

    // Legend creation
    const legendGroup = svgContainer
      .append("g")
      .attr("transform", `translate(${svgWidth - 100}, 50)`);
    legendGroup.append("rect").attr("width", 15).attr("height", 150).style("fill", "url(#colorGradient)");

    const legendTopText = {
      Sentiment: "Positive",
      Subjectivity: "Subjective",
    };

    const legendBottomText = {
      Sentiment: "Negative",
      Subjectivity: "Objective",
    };

    legendGroup
      .append("text")
      .attr("x", 20)
      .attr("y", 10)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(legendTopText[selectedColorMode]);

    legendGroup
      .append("text")
      .attr("x", 20)
      .attr("y", 140)
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .text(legendBottomText[selectedColorMode]);

    const colorGradient = svgContainer.append("defs").append("linearGradient").attr("id", "colorGradient").attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");

    colorGradient.append("stop").attr("offset", "0%").attr("stop-color", this.getGradientColorStart(selectedColorMode));
    colorGradient.append("stop").attr("offset", "50%").attr("stop-color", this.getGradientColorMiddle(selectedColorMode));
    colorGradient.append("stop").attr("offset", "100%").attr("stop-color", this.getGradientColorEnd(selectedColorMode));
  }

  getGradientColorStart = (mode) => {
    const colors = {
      Sentiment: "green",
      Subjectivity: "#4467C4",
    };
    return colors[mode];
  };

  getGradientColorMiddle = (mode) => {
    const colors = {
      Sentiment: "#ECECEC",
      Subjectivity: "#D6E3F8",
    };
    return colors[mode];
  };

  getGradientColorEnd = (mode) => {
    const colors = {
      Sentiment: "red",
      Subjectivity: "#ECECEC",
    };
    return colors[mode];
  };

  toggleTweetSelection = (tweet) => {
    this.setState((prevState) => {
      const alreadySelected = prevState.highlightedTweets.find((t) => t.idx === tweet.idx);
      const updatedTweets = alreadySelected
        ? prevState.highlightedTweets.filter((t) => t.idx !== tweet.idx)
        : [tweet, ...prevState.highlightedTweets];

      const selectedTweetIds = new Set(updatedTweets.map((t) => t.idx));

      d3.select(this.svgRef.current)
        .selectAll("circle")
        .attr("stroke", (tweetData) =>
          selectedTweetIds.has(tweetData.idx) ? "black" : "none"
        );

      return { highlightedTweets: updatedTweets };
    });
  };

  render() {
    const { highlightedTweets } = this.state;

    return (
      <div className="child1">
        <div className="dropdown">
          <label>
            <strong>Color By:</strong>
            <select
              className="color-dropdown"
              onChange={(event) =>
                this.setState({ selectedColorMode: event.target.value })
              }
            >
              <option value="Sentiment">Sentiment</option>
              <option value="Subjectivity">Subjectivity</option>
            </select>
          </label>
        </div>
        <svg ref={this.svgRef}></svg>
        <div className="selected-tweets">
          <ul>
            {highlightedTweets.map((tweet) => (
              <li key={tweet.idx}>{tweet.RawTweet}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default Child1;
