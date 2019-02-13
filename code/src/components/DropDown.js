import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const Select = (props) => (  
  <div className="dropdown">
    <select
      name={props.name}
      value={props.selectedOption}
      onChange={props.controlFunc}
      className="dropbtn"
      >
      {props.options.map(opt => {
        return (
          <option
            key={opt}
            value={opt}>{opt}</option>
        );
      })}
    </select>
  </div>
);

Select.propTypes = {  
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default Select; 