import React from 'react';

export default (props) => {
  return (
    <div>
      { props.snakeBody.map((dot, i, list) => {
        let last = i + 1 === list.length;
        const form = {
          left: `${dot[0]}%`,
          top: `${dot[1]}%`
        }
        return (
          <div className={ last ? "snake-dot head": "snake-dot"} key={i} style={form}></div>
        )
      })}
    </div>
  )
}