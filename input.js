export class InputHandler{
    constructor(game){
        this.game = game;
        this.keys = [];
        var audio = document.getElementById("music");
        audio.volume = 0.01;
        window.addEventListener('keydown', e => {
            if((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft'  ||
                e.key === 'ArrowRight' ||
                e.key === ' '
                ) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } else if (e.key === 'd') this.game.debug = !this.game.debug;

            else if(e.key === 'm'){
                        if (audio.paused) {
                        audio.play(); // If paused, play the audio
                        } else {
                        audio.pause(); // If playing, pause the audio
                        }
            } else if(e.key === '-'){
                if(audio.volume !== 0)    audio.volume -= 0.001; //console.log(audio.volume);
            } else if(e.key === '+'){
                if(audio.volume !== 0.01 && audio.volume + 0.001 < 0.01) { audio.volume += 0.001; }
                else if(audio.volume !== 0.01 && audio.volume + 0.001 > 0.01){ audio.volume = 0.01; }
                   
               
                
                
            }


            //console.log(e.key, this.keys);
             
        });
        window.addEventListener('keyup', e => {
            if(e.key === 'ArrowDown' || 
               e.key === 'ArrowUp'   ||
               e.key === 'ArrowLeft'  ||
               e.key === 'ArrowRight' ||
               e.key === ' '     ){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
           //console.log(e.key, this.keys);
        });
    }

}
