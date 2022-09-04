import React from 'react';

export default (props) => {

  const form = {
    left: `${props.dot[0]}%`,
    top: `${props.dot[1]}%`
  }

  return (
    <div className="snake-food" id="interesting-food" style={form}></div>
  )
}