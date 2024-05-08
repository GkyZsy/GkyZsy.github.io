    import { Player } from './player.js';
    import { InputHandler } from './input.js';
    import { Background } from './background.js';
    import { FlyingEnemy, ClimbingEnemy, GroundEnemy, GroundEnemy2, GroundEnemy3 } from './enemies.js';
    import { UI } from './UI.js';

    window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx =canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 793;

    class Game{
        constructor(width, height){
            this.width=width;
            this.height=height;
            this.groundMargin = 50;
            this.speed = 0;
            this.maxSpeed = 6;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 100;
            this.enemyTimer = 0;
            this.enemyInterval = 300;
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            this.maxTime = 100000;
            this.lives = 5;
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);
            //handle enemies     
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });
            //handle messages
            this.floatingMessages.forEach((message, index) => {
                message.update();
            });
            //handle particles
            this.particles.forEach((particle, index) => {
                particle.update();
            });
           if(this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
           }
           //handle collision sprites
           this.collisions.forEach((collision, index) => {
            collision.update(deltaTime);
           });
           this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
           this.particles = this.particles.filter(particle => !particle.markedForDeletion);
           this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
           this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }

        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach((message, index) => {
                message.draw(context);
            });
            this.UI.draw(context);
        }
        
        addEnemy(){
            
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if(this.speed > 0 && Math.random() >= 0.5) this.enemies.push(new GroundEnemy3(this)); 

            this.enemies.push(new FlyingEnemy(this)); 
            //this.enemies.push(new GroundEnemy3(this)); 
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);    
        if(!game.gameOver) requestAnimationFrame(animate);
        
    }
    animate(0);

});