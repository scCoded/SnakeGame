import React, { Component } from 'react';
import Snake from './Snake';
import Food from './Food';
import InterestingFood from './InterestingFood';

document.body.style.backgroundColor = '##75816B';

function getRandomCoordinates() {
  let min = 1;
  let max = 94;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y =  Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
}

const initialState = {
  food: getRandomCoordinates(),
  interestingFood: getRandomCoordinates(),
  isInterestingFoodVisible: false,
  interestingFoodType: "",
  multiplier: 2,
  immune: false,
  speed: 80,
  direction: 'RIGHT',
  snakeBody: [
    [0, 0],
    [2, 0]
  ],
}

class App extends Component {

  state = initialState;

  componentDidMount() {
    setInterval(this.moveSnake, this.state.speed);
    document.onkeydown = this.onKeyDown;
  }

  componentDidUpdate(prevProps, prevState) {
    this.collisionWithBorders();
    this.collisionWithSelf();
    this.checkIfEaten();
    this.checkIfEatenInterestingFood(prevProps, prevState);
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
        head = [head[0] + 1, head[1]]; //x,y coord, so x is changed to move by one unit (3% to the right), while y stays the same.
        break;
      case 'LEFT':
        head = [head[0] - 1, head[1]]; //x,y coord, so x is changed to move one by negative unit (3% to the left), while y stays the same.
        break;
      case 'DOWN':
        head = [head[0], head[1] + 1];  //x,y coord, so x is the same while y moves by one unit (3% downwards)
        break;
      case 'UP':
        head = [head[0], head[1] - 1]; //x,y coord, so x is the same while y moves by one negative unit (3% upwards)
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
    if (head[0] >= 96 || head[1] >= 96 || head[0] < 0 || head[1] < 0) {
      this.onGameOver();
    }
  }

  collisionWithSelf() { //a collision with self is defined as the the coords of the head of the snake being equal to the coordinates of any other part of the snake
    if (!this.state.immune) {
      let snake = [...this.state.snakeBody]; 
      let head = snake[snake.length - 1];
      snake.pop();
      snake.forEach(dot => {  //each part of snake tested against head by going through each body part (aka dot) in the snakeBody array
        if (head[0] === dot[0] && head[1] === dot[1]) {
          this.onGameOver();  
        }
      })
    }
  }

  checkIfEaten() {
    let head = this.state.snakeBody[this.state.snakeBody.length - 1];
    let food = this.state.food;
    if (Math.abs(head[0] - food[0]) <= 1 && Math.abs(head[1] - food[1]) <= 1) {
      this.setState({ food: getRandomCoordinates() }); //if coord of head is within 1% of the coord of food, then food is eaten.
      this.createTextPopup("+ " + this.state.multiplier + " score");
      this.increaseSnake(this.state.multiplier);
      this.increaseSpeed();
    }
  }

  checkIfEatenInterestingFood(prevProps, prevState) {
    //superFood - gives rainbow colours and multiplier effect x 5, max speed, for 10 seconds
    //mysteryFood - can give a good or bad effect
    // plus points to length & score
    // slow
    // minus points to length & score
    // immune status to collision with self
    let interestingFood = this.state.interestingFood;
    let head = this.state.snakeBody[this.state.snakeBody.length - 1];
    if (this.state.isInterestingFoodVisible && Math.abs(head[0] - interestingFood[0]) <= 1 && Math.abs(head[1] - interestingFood[1]) <= 1) {
      switch (this.state.interestingFoodType) {
        case 'mystery-food':
          let effect = ['add-score', 'minus-score', 'immune', 'slow'];
          let selectedEffect = effect[Math.floor(Math.random() * 4)];
          switch (selectedEffect) {
            case 'add-score':
              this.increaseSnake(this.state.multiplier * 2);
              this.createTextPopup("Positive growth effect (10 seconds)!");
              break;
            case 'minus-score':
              this.decreaseSnake(this.state.multiplier * 2);
              this.createTextPopup("Negative growth effect (10 seconds)!");
              break;
              //popup badfruit;
            case 'immune':
              this.setImmune(prevProps, prevState);
              this.createTextPopup("Immune to self collision status (10 seconds)!");
              break;
            case 'slow':
              this.setSlow(prevProps, prevState);
              this.createTextPopup("Slowed effect (10 seconds)!");
              break;
          }
        break;
        case 'super-food':
          this.setSuperEffect(prevState);
          this.createTextPopup("Food gives 6 points and extra speed (10 seconds)!");
          break;
      }
    }
  }
  
  setImmune(prevState) {
    if (prevState.immune !== true) {
      this.setState({
        immune: true,
        isInterestingFoodVisible: false
      }, () => {
        setTimeout(this.removeImmune, 10000);
      });
    }
  }

  removeImmune = () => {
    this.setState({immune: false});
  }

  setSlow(prevState) {
    if (prevState.speed !== 500) {
      this.setState({
        speed: 500,
        isInterestingFoodVisible: false
      }, () => {
        setTimeout(this.removeSlow, 10000);
      });
    }
  }
  
  removeSlow = () => {
    this.setState({
      speed: 80,
    });
  }

  setSuperEffect(prevState) {
    if (prevState.multiplier !== 6 && prevState.speed !== 0) {
      document.querySelectorAll('.snake-dot').forEach((el) => el.classList.add("super"));
      this.setState({
        multiplier: 6,
        speed: 0,
        isInterestingFoodVisible: false
      }, () => {
        setTimeout(this.removeSuperEffect, 10000);
      });
    }
  }

  removeSuperEffect = () => {
    document.querySelectorAll('.snake-dot').forEach((el) => el.classList.remove("super"));
    this.setState({
      multiplier: 2,
      speed: 80
    });
  }
  
  //lazerBeamFood - gives lazer powers during boss battle against mirror snake.
    //mirror snake - is identical copy of current users snake (slightly slower), ways to defeat via lazer hit or by catching it's tail.
      //what it does is either steal user food, try to eat user snake.

  increaseSnake(multiplier) {
    let newSnake = [...this.state.snakeBody];
    for (let i = 0; i < multiplier; i++) {
      newSnake.unshift([]);
    }
    this.setState({ snakeBody: newSnake }, () => {
      this.checkLevelUp();
    });
  }

  decreaseSnake(multiplier) {
    if (this.state.snakeBody.length > multiplier + 1) {
      let newSnake = [...this.state.snakeBody];
      for (let i = 0; i < multiplier; i++) {
        newSnake.unshift([]);
      }
      this.setState({ snakeBody: newSnake }, () => {
        let level = Math.ceil(this.state.snakeBody.length / 5);
        if ([5, 10, 15, 20, 25, 30].includes(this.state.snakeBody.length) )
          this.createTextPopup("Level Up! - " + level);
        this.checkLevelUp();
      });
    }
  }

  checkLevelUp() {
    if (Math.ceil(this.state.snakeBody.length / 5) % 10 === 0)
    this.createTextPopup("Boss Battle - todo");
    
    if ((this.state.snakeBody.length) % 4 === 0)
      this.spawnInterestingFood();
  }

  spawnInterestingFood() {
    let choices = ['super-food', 'mystery-food'];
    let selectedInterestingFood = choices[Math.floor(Math.random() * 2)];
    document.querySelectorAll('#interesting-food').forEach((el) => el.classList.remove('super-food'));
    document.querySelectorAll('#interesting-food').forEach((el) => el.remove('mystery-food'));

    this.setState({
      isInterestingFoodVisible: true,
      interestingFood: getRandomCoordinates(),
      interestingFoodType: selectedInterestingFood
    }, () => {
      document.querySelectorAll('#interesting-food').forEach((el) => el.classList.add(selectedInterestingFood));
      setTimeout(this.despawnInterestingFood, 10000);
    });
  }

  despawnInterestingFood = () => {
    if (document.querySelector('#interesting-food') !== null) {
      this.setState({
        isInterestingFoodVisible: false,
      });
    } 
  }

  increaseSpeed() {
    if (this.state.speed > 10) {
      this.setState({ speed: this.state.speed - 10 });
    }
  }

  onGameOver() {
    alert(`Game Over. Your final score is : ${this.state.snakeBody.length}!`);
    this.setState(initialState);
  }

  createTextPopup(text) {
    var content = document.createTextNode(text);
    document.getElementById("span").appendChild(content);
    setTimeout(this.removeTextPopup, 1500); 
  }

  removeTextPopup = () => {
    var el = document.getElementById("span");
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  render() {
    return (
      <div id="grid" className="grid">
        <p className="textScore">Score : {this.state.snakeBody.length}</p>
        <p className="textScore">Level : {Math.ceil(this.state.snakeBody.length / 5)}</p>
        <div id="scoreUpdates"><span id="span"></span></div>
        <Snake snakeBody = {this.state.snakeBody}/>
        <Food dot = {this.state.food}/>
        {
        this.state.isInterestingFoodVisible ? 
        <InterestingFood dot = {this.state.interestingFood}/> : null
        }
      </div>
    );
  }
}

export default App;