import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';

document.body.style.backgroundColor = '##75816B';

function getRandomCoordinates(){
  let min = 1;
  let max = 94;
  let x = Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  let y =  Math.floor((Math.random()*(max-min+1)+min)/2)*2;
  return [x,y]
}

const initialState = {
  food: getRandomCoordinates(),
  speed: 100,
  direction: 'RIGHT',
  snakeBody: [
    [0,0],
    [2,0]
  ]
}

class App extends Component {

  state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate() {
    this.collisionWithBorders();
    this.collisionWithSelf();
    this.checkIfEaten();
  }

  onKeyDown = (e) => {
    e = e || window.event;
    switch (e.keyCode) {
      case 38:
        this.setState({direction: 'UP'});
        break;
      case 40:
        this.setState({direction: 'DOWN'});
        break;
      case 37:
        this.setState({direction: 'LEFT'});
        break;
      case 39:
        this.setState({direction: 'RIGHT'});
        break;
    }
  }

  moveSnake = () => {
    let dots = [...this.state.snakeBody]; //dot refers to each element in snakeBody array.
    let head = dots[dots.length - 1];  //head of snake is the first dot in the snakeBody array...

    switch (this.state.direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]]; //x,y coord, so x is changed to move by one unit (3% to the right), while y stays the same.

        break;
      case 'LEFT':
        head = [head[0] - 2, head[1]]; //x,y coord, so x is changed to move one by negative unit (3% to the left), while y stays the same.

        break;
      case 'DOWN':
        head = [head[0], head[1] + 2];  //x,y coord, so x is the same while y moves by one unit(3% downwards)

        break;
      case 'UP':
        head = [head[0], head[1] - 2]; //x,y coord, so x is the same while y moves by one negative unit(3% upwards)
        break;
    }
    dots.push(head);   //this saves the new head.
    dots.shift();   //use this in order to remove 1st item of the snakeBody array , as we need to remove the current tail.

    this.setState({ //state saved
      snakeBody: dots
    })
  }

  collisionWithBorders() {  //the collision with borders defines a collision as when the coordinates of the head of the snake being equal to or exceeding the coordinates of the border lines
    let head = this.state.snakeBody[this.state.snakeBody.length - 1];
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  collisionWithSelf() { //a collision with self is defined as the the coords of the head of the snake being equal to the coordinates of any other part of the snake
    let snake = [...this.state.snakeBody]; 
    let head = snake[snake.length - 1];
    snake.pop();
    snake.forEach(dot => {  //each part of snake tested against head by going through each body part (aka dot) in the snakeBody array
      if (head[0] == dot[0] && head[1] == dot[1]) {
        this.onGameOver();  
      }
    })
  }

  checkIfEaten() {
    let head = this.state.snakeBody[this.state.snakeBody.length - 1];
    let food = this.state.food;
    if (head[0] == food[0] && head[1] == food[1]) {
      this.setState({
        food: getRandomCoordinates()    //if coord of head is equal to the coord of food then food is eaten.
      })
      this.increaseSnake();
      this.increaseSpeed();
    }
  }

  increaseSnake() {
    let newSnake = [...this.state.snakeBody];
    newSnake.unshift([])
    this.setState({
      snakeBody: newSnake
    })
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({
        speed: this.state.speed - 10
      })
    }
  }

  onGameOver() {
    alert(`Game Over. Your final score is : ${this.state.snakeBody.length}!`);
    this.setState(initialState)
  }

  render() {
    return (
      <div className="grid">
        <p class="textScore">Score : {this.state.snakeBody.length}</p>
        <Snake snakeBody={this.state.snakeBody}/>
        <Food dot={this.state.food}/>
      </div>
      

    );
  }
}

export default App;