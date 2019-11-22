import React from 'react';

export default (props) => {
  return (
    <div>
      {props.snakeBody.map((dot, i) => {
        const form = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`
        }
        return (
          <div className="snake-dot" key={i} style={form}></div>
        )
      })}
    </div>
  )
}