import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import PieChart from './PieChart';
import * as d3 from 'd3';

const Chart = (props) => {
    const switched = props.switched;
    //d3.selectAll("svg").remove();
    debugger;
    if (switched) {
      return <PieChart hoverElement={props.hover} onHover={props.onHover}  
      data={props.data} size={[props.screenWidth/2, props.screenHeight/2]} 
      attribute={props.attribute}/>;
    }
    return <BarChart hoverElement={props.hover} onHover={props.onHover}  
    data={props.data} size={[props.screenWidth/2, props.screenHeight/2]} 
    attribute={props.attribute}/>;
  }

  Chart.propTypes = {  
    hover: PropTypes.string,
    data: PropTypes.array,
    attribute: PropTypes.string,
    onHover: PropTypes.func,
    screenHeight: PropTypes.number,
    screenWidth: PropTypes.number,
    switched:PropTypes.bool
  };

  export default Chart;