import React, { Component } from 'react';
import './App.css';
import Chart  from './components/Chart';
import * as d3 from 'd3';
import {csv} from 'd3-request';
import Select from './components/DropDown';
import Switch from 'react-switch';

const colorScale = d3.scaleThreshold().domain([5,10,20,30]).range(["#75739F", "#5EAFC6", "#41A368", "#93C464"])
let dataFromCSV = []

class App extends Component {

  constructor(props){
		super(props);
		this.onResize = this.onResize.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onBrush = this.onBrush.bind(this)
    this.fetchData = this.fetchData.bind(this)
    this.updateData = this.updateData.bind(this);
    this.onChangeAttribute = this.onChangeAttribute.bind(this);
    this.getFilteredData=this.getFilteredData.bind(this);
    this.toggleSwitch = this.toggleSwitch.bind(this);
    this.state = { 
        screenWidth: 1000, 
        screenHeight: 500, 
        hover: "none", 
        brushExtent: [0,40] , 
        data:[], 
        attribute:"country",
        columns:[],
        switched:false
       }
  }
  

  componentWillMount(){
    this.fetchData(this);
  }

  fetchData(suicideData){
    let obj = suicideData;
    csv('./data/SuicideRateData.csv', function(error,data){
      if (error) {
        throw error;
      }  
      debugger;
      console.log(data);
      let index = data.columns.indexOf("suicides_no");
      if (index > -1) {
        data.columns.splice(index, 1);
      }
      let col = data.columns;
      console.log(col);
      dataFromCSV = data;
      let filteredData = obj.getFilteredData(data,obj.state.attribute);
      obj.setState({
        columns : col,
        data:filteredData
      });
    })
  }
  getFilteredData(data, attribute){
      debugger;
      switch(attribute){
        case "country": console.log(data.map((d)=> { return { attribute: d.country, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.country, suicides :d.suicides_no } });

        case "year": console.log(data.map((d)=> { return { attribute: d.year, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.year, suicides :d.suicides_no } });

        case "sex": console.log(data.map((d)=> { return { attribute: d.sex, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.sex, suicides :d.suicides_no } });

        case "age": console.log(data.map((d)=> { return { attribute: d.age, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.age, suicides :d.suicides_no } });

        case "population": console.log(data.map((d)=> { return { attribute: d.population, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.population, suicides :d.suicides_no } });

        case "suicides_100k_pop": console.log(data.map((d)=> { return { attribute: d.suicides_100k_pop, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.suicides_100k_pop, suicides :d.suicides_no } });

        case "country_year": console.log(data.map((d)=> { return { attribute: d.country_year, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.country_year, suicides :d.suicides_no } });

        case "HDI_for_year": console.log(data.map((d)=> { return { attribute: d.HDI_for_year, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.HDI_for_year, suicides :d.suicides_no } });

        case "gdp_for_year": console.log(data.map((d)=> { return { attribute: d.gdp_for_year, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.gdp_for_year, suicides :d.suicides_no } });

        case "gdp_per_capita": console.log(data.map((d)=> { return { attribute: d.gdp_per_capita, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.gdp_per_capita, suicides :d.suicides_no } });

        case "generation": console.log(data.map((d)=> { return { attribute: d.generation, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.generation, suicides :d.suicides_no } });
        
        default: console.log(data.map((d)=> { return { attribute: d.country, suicides :d.suicides_no } }))
        return data.map((d)=> { return { attribute: d.country, suicides :d.suicides_no } });
      }
  }
  updateData(data) {
    this.setState({data: data}); 
  }

  onChangeAttribute(event){
    debugger;
    
    let filteredData = this.getFilteredData(dataFromCSV,event.target.value);
    this.setState({
      attribute : event.target.value,
      data:filteredData
		})
  }

  toggleSwitch(){
    let switchState = this.state.switched;
    this.setState(
       {switched: !switchState}
    );
  }

  onResize() {
    this.setState({ screenWidth: 1200, screenHeight: 1000 })
  }

  onHover(d) {
    this.setState({ hover: d.id })
  }

  onBrush(d) {
    this.setState({ brushExtent: d })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Suicide Rates Overview 1985 to 2016</h1>
          <h3>Compares socio-economic info with suicide rates by year and country</h3>
        </header>
        <label htmlFor="normal-switch" style={{paddingLeft : 600}}>
            <span>Pie Chart : </span>
            <Switch
              onChange={this.toggleSwitch}
              checked={this.state.switched}
              id="normal-switch"
              />
        </label>
        <label htmlFor="attribute-dropdown" style={{paddingLeft:200}}>
            <span>Change Attribute : </span>
        <Select name="attribute" selectedOption={this.state.attribute}
			    controlFunc={this.onChangeAttribute.bind(this)} options={this.state.columns} 
          id="attribute-dropdown"/>
          </label>
        <Chart hoverElement={this.state.hover} onHover={this.onHover} switched={this.state.switched}
          data={this.state.data} size={[this.state.screenWidth/2, this.state.screenHeight/2]} attribute={this.state.attribute}/>
      </div>
    );
  }
}

export default App;
