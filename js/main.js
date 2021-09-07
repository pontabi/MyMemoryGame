'use strict';

{
  class MainBoard {
    constructor() {
      this.main_board = document.getElementById('main_board');
      this.ul = this.main_board.querySelector('ul');
      this.li = [];
      this.size = this.applySize();
      this.main_board.style.width = 50 * this.size + 1 * (this.size - 1) + 'px';
      for(let i = 0; i < this.size ** 2; i++) {
        this.li[i] = document.createElement('li');
        this.ul.appendChild(this.li[i]);
      }
    }
    
    getLi(index) {
      return this.li[index];
    }
    
    getLis() {
      return this.li;
    }

    getSize() {
      return this.size;
    }

    applySize() {
      const sizes = document.getElementsByName('size');
      let number = 0;
      sizes.forEach(size => {
        if(size.checked) {
          number = Number(size.value);
        }
      });
      return number;
    }

    setBoad() {
      while(this.ul.firstChild) {
        this.ul.removeChild(this.ul.firstChild);
      }
      this.li = [];
      this.size = this.applySize();
      this.main_board.style.width = 50 * this.size + 1 * (this.size - 1) + 'px';
      for(let i = 0; i < this.size ** 2; i++) {
        this.li[i] = document.createElement('li');
        this.ul.appendChild(this.li[i]);
      }
    }
  }
  
  class Game {
    constructor(main_board) {
      this.main_board = main_board;
      this.count = 1;
      this.lightedBox = [];
      this.isPlaying = false;
      this.times = this.applyTimes();
      const btn = document.getElementById('btn');
      btn.addEventListener('click', () => {
        this.startGame();
      });
    }
    
    startGame() {
      if(this.isPlaying) {
        return;
      }
      this.main_board.setBoad();
      this.reset();
      this.lightUp(this.times);
    }
    
    lightUp(times) {
      const index = Math.floor(Math.random() * this.main_board.getSize() ** 2);
      this.lightedBox.push(index);
      this.main_board.getLi(index).classList.add('lighted');
      const timeoutId = setTimeout(() => {
        this.main_board.getLi(index).classList.remove('lighted');
        this.count++;
        this.lightUp(times);
      }, 1000); 
      if(times <= this.count) {
        clearTimeout(timeoutId);
        setTimeout(() => {
          this.main_board.getLi(index).classList.remove('lighted');
        }, 1000);
        new Answer(this, main_board);
      }
      
    }
    
    toggleIsPlaying() {
      this.isPlaying = !this.isPlaying;
    }
    
    reset() {
      btn.classList.add('inactive');
      this.toggleIsPlaying();
      const result = document.getElementById('result');
      result.classList.remove('appear');
      this.count = 1;
      this.lightedBox = [];
      this.times = this.applyTimes();
    }
    
    getLightedBox() {
      return this.lightedBox;
    }

    applyTimes() {
      const times = document.getElementsByName('times');
      let number = 0;
      times.forEach(time => {
        if(time.checked) {
          number = Number(time.value);
        }
      });
      return number;
    }

    getTimes() {
      return this.times;
    }
    
  }

  class Answer {
    constructor(game, main_board) {
      this.game = game;
      this.main_board = main_board;
      this.currentNum = 0;
      this.startAnswer();
    }

    startAnswer() {
      this.main_board.getLis().forEach((li, index) => {
        li.addEventListener('click', () => {
          this.checkAnswer(index);
        });
      });
    }

    checkAnswer(index) {
      if(this.game.lightedBox[this.currentNum] === index) {
        this.main_board.getLis().forEach(li => {
          li.classList.remove('wrong');
        });
        this.currentNum++;
        if(this.currentNum > this.game.getTimes() - 1) {
          const result = document.getElementById('result');
          result.classList.add('appear');
          this.game.toggleIsPlaying();
          btn.classList.remove('inactive');
        }
        return;
      }else {
        this.main_board.getLi(index).classList.add('wrong');
        return;
      }
    }
  }
  const main_board = new MainBoard();
  new Game(main_board);
}