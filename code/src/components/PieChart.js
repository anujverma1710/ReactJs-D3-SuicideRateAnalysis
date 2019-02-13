import React, { Component } from 'react'
import '../App.css';
import * as d3 from 'd3';
// import { max, sum } from 'd3-array'
// import { select, event, mouse } from 'd3-selection'


class PieChart extends Component {
    constructor(props){
        super(props);
    
        this.getYValues=this.getYValues.bind(this);
        this.getXValues=this.getXValues.bind(this);
        this.groupByData=this.groupByData.bind(this);
        this.createPieChart = this.createPieChart.bind(this);
        this.onHover=this.onHover.bind(this);
        this.getTotalSum=this.getTotalSum.bind(this);
        this.state = {
          data:[]
        }
      }

      componentDidMount() {
        this.createPieChart()
      }
    
      componentDidUpdate() {
        this.createPieChart()
      }
      onHover(d) {
        this.setState({ hover: d.value })
      }
      groupByData(items) {
        let temp = [],prev=[];
        let sortedItems = items.sort((a,b) => (a.attribute > b.attribute) ? 1 : ((b.attribute > a.attribute) ? -1 : 0))
        sortedItems.map((d)=>{
          if ( d.attribute !== prev ) {
            temp.push({key :d.attribute,value: parseInt(d.suicides,10), percentage:0});
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
      getTotalSum(keyValues){
        let sum = 0;

        keyValues.map((kv)=>{
            sum= sum + kv.value;
        })
        return sum;
      }
      createPieChart() {
        const node = this.node
        let width = 900;
        let height = 400; 
        let radius = Math.min(width, height) / 2;
        debugger;
        console.log(this.props.data);
        let keyValues = this.groupByData(this.props.data);
        let total = this.getTotalSum(keyValues);
        keyValues.map((data)=>{
            data.percentage = data.value/total * 100;
        })
        let xValues = this.getXValues(keyValues);
        let yValues = this.getYValues(keyValues);
        debugger;
        let xScale = d3.scaleBand().domain(xValues).range([0, width]).padding(0.4);
        const dataMax = d3.max(yValues)
        const yScale = d3.scaleLinear()
         .domain([0, dataMax])
         .range([height, 0])

         d3.select(node).selectAll("svg > *").remove();

         var div = d3.select("body").append("div").attr("class", "toolTip");
         var color = d3.scaleOrdinal(d3.schemeCategory10);
         
         var arc = d3.arc()
                    .outerRadius(radius - 10)
                     .innerRadius(radius - 70);

        var pie = d3.pie()
                     .sort(null)
	                 .startAngle(1.1*Math.PI)
                        .endAngle(3.1*Math.PI)
                        .value(function(d) { return d.value; });

        var svg = d3.select(node).append("svg")
            .attr("width", width)
             .attr("height", height)
            .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var g = svg.selectAll(".arc")
                .data(pie(keyValues))
                .enter().append("g")
                .attr("class", "arc");

                 g.append("path")
	            .style("fill", function(d) { return color(d.data.key); })
                .transition().delay(function(d,i) {
	                return i * 500; }).duration(500)
	            .attrTween('d', function(d) {
	                    var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
		                return function(t) {
			            d.endAngle = i(t); 
			            return arc(d)
			            }
		                }); 
        g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
	  .transition()
	  .delay(1000)
      .text(function(d) { return d.data.key; });

	d3.selectAll("path").on("mousemove", function(d) {
	    div.style("left", d3.event.pageX+10+"px");
		div.style("top", d3.event.pageY-25+"px");
		div.style("display", "inline-block");
        div.html((d.data.key)+"<br>"+(d.data.value) + "<br>"+(d.data.percentage) + "%");
    });
	  
    d3.selectAll("path").on("mouseout", function(d){
            div.style("display", "none");
        });
    
      }
    
      render() {
        return <svg ref={node => this.node = node} width={1000} height={500}>
        </svg>
      }
}


export default PieChart;