import React, { Component } from 'react'
import '../App.css';
import * as d3 from 'd3';
//import { scaleLinear, scaleBand, scaleOrdinal} from 'd3-scale'
// import { schemeCategory10 } from 'd3-scale-chromatic';
// import {easeLinear} from 'd3-ease'
// import { axisBottom, axisLeft } from 'd3-axis'
// import { max, sum } from 'd3-array'
// import { select, event, mouse } from 'd3-selection'


class BarChart extends Component {
  constructor(props){
    super(props);

    this.getYValues=this.getYValues.bind(this);
    this.getXValues=this.getXValues.bind(this);
    this.groupByData=this.groupByData.bind(this);
    this.createBarChart = this.createBarChart.bind(this);
    this.onHover=this.onHover.bind(this);
    this.state = {
      data:[]
    }
  }

  componentDidMount() {
    this.createBarChart()
  }

  componentDidUpdate() {
    this.createBarChart()
  }
  onHover(d) {
    this.setState({ hover: d.value })
  }
  groupByData(items) {
    let temp = [],prev=[];
    let sortedItems = items.sort((a,b) => (a.attribute > b.attribute) ? 1 : ((b.attribute > a.attribute) ? -1 : 0))
    sortedItems.map((d)=>{
      if ( d.attribute !== prev ) {
        temp.push({key :d.attribute,value: parseInt(d.suicides,10)});
    } else {
        temp[temp.length-1].value = temp[temp.length-1].value + parseInt(d.suicides,10);
    }
    prev = d.attribute;
    })
    debugger;
    return temp;
  };

  getXValues(keyValues){
    let temp=[];
    if(keyValues!==undefined){
    keyValues.map((kv)=>{
      temp.push(kv.key);
    })
  }
    return temp;
  }

  getYValues(keyValues){
    let temp=[];
    if(keyValues!==undefined){
    keyValues.map((kv)=>{
      temp.push(kv.value);
    })
  }
    return temp;
  }

  createBarChart() {
    const node = this.node
    let width = 800;
    let height = 300; 
    debugger;
    console.log(this.props.data);
    let keyValues = this.groupByData(this.props.data);
    let xValues = this.getXValues(keyValues);
    let yValues = this.getYValues(keyValues);
    debugger;
    let xScale = d3.scaleBand().domain(xValues).range([0, width]).padding(0.4);
    const dataMax = d3.max(yValues)
    const yScale = d3.scaleLinear()
     .domain([0, dataMax])
     .range([height, 0])
     
     //d3.select(node).remove()
     d3.select(node).selectAll("svg > *").remove();
     
     var g = d3.select(node).append("g")
     .attr("transform", "translate(" + 100 + "," + 100 + ")");
    
     // Define the div for the tooltip
      // var div = g.append("rect")	
      //       .attr("class", "tooltip")				
      //       .style("opacity", 0);

      var color = d3.scaleOrdinal(d3.schemeCategory10);
      var tooltip = d3.select(node).append("g")
            .attr("class", "tooltip")
            .style("display", "none");
    
      tooltip.append("rect")
            // .attr("width", 150)
            // .attr("height", 20)
            .attr("display","flexible")
            .attr("fill", "white")
            .style("opacity", 0.8);

      tooltip.append("text")
            .attr("x", 15)
            .attr("dy", "1.2em")
            .style("text-anchor","left")
            .style("border-radius", 8)
            .attr("font-size", "12px")
            .attr("font-weight", "bold");

     g.append("g") //Another group element to have our x-axis grouped under one group element
        .attr("transform", "translate(0," + height + ")") // We then use the transform attribute to shift our x-axis towards the bottom of the SVG.
        .call(d3.axisBottom(xScale)) //We then insert x-axis on this group element using .call(d3.axisBottom(x)).
        .append("text")
        .attr("y", height - 250)
        .attr("x", width-100)
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text(this.props.attribute);



        g.append("g") //Another group element to have our y-axis grouped under one group element
        .call(d3.axisLeft(yScale).tickFormat(function(d){ // Try with X Scaling too.
            return  d;
        })
        .ticks(10)) //We have also specified the number of ticks we would like our y-axis to have using ticks(10).
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .text("No. of Suicides");

        g.selectAll(".bar") //created dynamic bars with our data using the SVG rectangle element.
        .data(keyValues)
        .enter().append("rect")
        .attr("class", "bar") // try to comment this and see the changes
        .attr("x", function(d) { return xScale(d.key); })  //x scale created earlier and pass the year value from our data.
        .attr("y", function(d) { return yScale(d.value); }) // pass the data value to our y scale and receive the corresponding y value from the y range.
        .attr("width", xScale.bandwidth()) //width of our bars would be determined by the scaleBand() function.
        .attr("height", function(d) { return height - yScale(d.value); })
        .attr("fill", function(d, i) {
          return color(i);
        })
        .on("mouseover", function(data,index) { 
          tooltip.style("display", null); 
          let bar = d3.select(this)
          bar.style("transform", "scale(1.1,1.1)")
              .style("transform-origin", "50% 50%");
        //   let width = bar.attr('width')
        //   let height = bar.attr('height')

        //   let scale = 1.5;

        //   let newWidth = width* scale;
        //   let newHeight = height*scale;

        //   let shift = (newWidth - width)/2

        //   bar.transition()
        //   .style('transform','scale('+scale+')')


        //   g.selectAll('.bar')
        //   .filter((d,i)=> i < index)
        //   .transition()
        //   .style('transform','translateX(-'+shift+'px)')

        //   g.selectAll('.bar')
        //   .filter((d,i)=> i > index)
        //   .transition()
        //   .style('transform','translateX('+shift+'px)')
         })
         .on("mouseout", function(data,index) { 
           tooltip.style("display", "none"); 
           let bar = d3.select(this)
           bar.attr("fill", function() {
            return "" + color(this.id) + "";
           });
           bar.style("transform", "scale(1,1)")
              .style("transform-origin", "bottom");
        //   select(this).transition().style('transform','scale(1)');
        //  g.selectAll('.bar')
        //   .filter(d=>d.key !== data.key)
        //   .transition()
        //   .style('transform','translateX(0)')
        })
        .on("mousemove", function(d) {
            var xPosition = d3.mouse(this)[0]-100;
            var yPosition = d3.mouse(this)[1]+50;
            tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
            tooltip.select("text").text(d.key+ " : " + d.value + "(No. of suicides)");
        }); 

  }

  render() {
    return <svg ref={node => this.node = node} width={1000} height={500}>
    </svg>
  }
}

export default BarChart
