import { Sitting, Running, Jumping, Falling, Rolling, Diving, HIT } from "./playerStates.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from './floatingMessages.js'

export class Player{
    constructor(game){
        this.game = game;
        this.width = 80; // 265 //261 // 124.83
        this.height = 80; // 200 //142 // 113.5
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 0.7;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 30;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 3; //7
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new HIT(this.game)];
        this.currentState = null;
    }
    update(input, deltaTime){
        this.checkCollision();
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed=0;
        //horizontal boundaries
        if(this.x < 0) this.x = 0;
        if(this.x + this.width> this.game.width - this.width) this.x = this.game.width - this.width - this.width ;
        //vertical movement
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;
        //vertical boundaries
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
        //sprite animation
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        }
        else{
            this.frameTimer += deltaTime;
        }
        
        
    }
    draw(context){
        if(this.game.debug) context.strokeRect(this.x, this.y , this.width , this.height );
        context.drawImage(this.image, this.frameX * this.width , this.frameY * this.height, this.width, this.height, this.x - 70, this.y - 80 , this.width *2.5, this.height *2.5);

    }
    onGround(){
        return this.y >= this.game.height - this.height - 15 - this.game.groundMargin;
    }
    setState(state, speed){
        /*this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        this.currentState.enter();*/
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed;
        //console.log(state);
        // state'e göre animasyon hızı
        if (state === 4) { // HIT
            this.fps = 200;                 // daha hızlı (istersen 45/50 de deneyebilirsin)
        } else {
            this.fps = 30;                 // normal
        }
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;             // state değişince timer reset (daha temiz geçiş)

        this.currentState.enter(); 
    }
    checkCollision(){
  this.game.enemies.forEach(enemy => {
    //console.log(this.currentState);
    // Varsayılan: oyuncunun kendi kutusu
    let hitX = this.x;
    let hitY = this.y;
    let hitW = this.width;
    let hitH = this.height;

    // Dive attack alanını büyüt
    if (this.currentState === this.states[5]) { // 5 = DIVING
      const padX = 150;      // sağ/sol ekstra alan
      const padTop = 100;    // yukarı az
      const padBottom = 150; // aşağı (impact alanı) daha fazla

      hitX = this.x - padX;
      hitY = this.y - padTop;
      hitW = this.width + padX * 2;
      hitH = this.height + padTop + padBottom;
    }

    if(enemy.x < hitX + hitW &&
       enemy.x + enemy.width > hitX &&
       enemy.y < hitY + hitH &&
       enemy.y + enemy.height > hitY
    ){
      // collision detected
      enemy.markedForDeletion = true;
      this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

      if(this.currentState === this.states[4] || this.currentState === this.states[5]){
        this.game.score++;
        this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
      } else {
        this.setState(6,0);
        this.game.lives--;
        if(this.game.lives <= 0) this.game.gameOver = true;
      }
    }
  });
}

/*OLD COLLISION CODE

checkCollision(){
            this.game.enemies.forEach(enemy => {
            
            if(enemy.x < this.x + this.width &&
               enemy.x + enemy.width > this.x &&
               enemy.y < this.y + this.height &&
               enemy.y + enemy.height > this.y
            ){ //collision detected
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                }
                else{
                    this.setState(6,0);
                    this.game.lives--;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }

            }

        })
    }



*/


}