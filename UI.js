export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Pixelify Sans';
        this.livesImage = document.getElementById('lives');
    }
    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = "#b026ff";
        //score
        context.fillText('Score: '+ this.game.score, 20, 50);
        //timer
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);
        //lives
        for(let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i + 25, 95, 25 ,25);
        }
        //game over messages
         
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > 50 && this.game.lives !== 0) {
                context.fillText('Creatures are repulsed!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('For now...', this.game.width * 0.5, this.game.height * 0.5 + 20);

            } else if(this.game.score < 50 && this.game.lives !== 0) {
                context.fillText('NO!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Not enough creatures were defeated.', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else  {
                context.fillText('NO!', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('You have fallen.', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            
        } 
        context.restore();
    }
}