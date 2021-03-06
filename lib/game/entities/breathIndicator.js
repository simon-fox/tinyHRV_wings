ig.module(
        'game.entities.breathIndicator'
)
.requires(
        'impact.entity'
)
.defines(function(){
        
        EntityBreathIndicator = ig.Entity.extend({
                checkAgainst: ig.Entity.TYPE.NONE,
                collides: ig.Entity.COLLIDES.NEVER,
                gravityFactor: 0,
                name: "box2dfalse",
                power: 0,
                zIndex: 10,
                radius: 0,
                containingCircleRadius: 60,
                travelSpeed: 0,
                state: "NEUTRAL",
                spawned: false,
                fullBreathTaken: false,
                fillStyle: "rgba(255, 255, 255, 0.8)",

                init: function( x, y, settings ){
                    this.timer = new ig.Timer();
                    this.travelTimer = new ig.Timer();
                    this.breathTimer = new ig.Timer();
                    
                    this.parent( x, y, settings );
                },
                
                update: function(){
                    //set draw pos
                    this.originX = ig.system.getDrawPos( ( ig.game.player.pos.x + (ig.game.player.size.x / 2) ) - ig.game.screen.x );
                    this.originY = ig.system.getDrawPos( ( ig.game.player.pos.y + (ig.game.player.size.y / 2) ) - ig.game.screen.y );

                    var textPos = { x : 0 , y : 0 , }

                    //states set in ig.game.handleMouseInput
                    switch( this.state ){
                        case "NETURAL": 

                        break;
                        case "IN": 
                            ig.game.breathIndicator.workOutTravelSpeed();
                            //spawn text
                            if( this.spawned == false ){
                                this.text = ig.game.spawnEntity( EntityBreatheText , textPos.x , textPos.y );
                                this.spawned = true;
                            }
                            //every 100th of a second, manual change this.radius
                            if( ig.game.breathIndicator.travelTimer.delta() >= 0.01){
                                //check if we've reached the max size
                                if ( ig.game.breathIndicator.radius < ig.game.breathIndicator.containingCircleRadius ){
                                    ig.game.breathIndicator.radius += ig.game.breathIndicator.travelSpeed;
                                }
                                else { 
                                    ig.game.breathIndicator.radius = ig.game.breathIndicator.containingCircleRadius 
                                    this.killText();
                                    this.fullBreathTaken = true;
                                }
                                ig.game.breathIndicator.travelTimer.reset();
                            }
                        break;
                        case "HOLDING":
                            //spawn text
                            if( this.spawned == false ){
                                this.text = ig.game.spawnEntity( EntityBreatheText , textPos.x , textPos.y );
                                this.spawned = true;
                            }
                        break;
                        case "OUT": 
                            ig.game.breathIndicator.workOutTravelSpeed();
                            //spawn text
                            if( this.spawned == false ){
                                this.text = ig.game.spawnEntity( EntityBreatheText , textPos.x , textPos.y );
                                this.spawned = true;
                            }
                            //every 100th of a second, manual change this.radius
                            if( ig.game.breathIndicator.travelTimer.delta() >= 0.01){
                                //check if we've reached the min size
                                if ( ig.game.breathIndicator.radius > 0 ){
                                    ig.game.breathIndicator.radius -= ig.game.breathIndicator.travelSpeed;
                                }
                                else { 
                                    ig.game.breathIndicator.cleanUpAfterBreathIsFinished();
                                }
                                if( ig.game.breathIndicator.travelTimer ){
                                    ig.game.breathIndicator.travelTimer.reset();
                                }
                            }
                        break;
                    }

                    this.parent();
                },

                draw: function(){
                    this.parent();

                    //grab the canvas
                    var ctx = ig.system.context;
                    
                    //draw the circle to be filled
                    ctx.strokeStyle = this.fillStyle;  
                    ctx.beginPath();
                    ctx.moveTo( this.originX + this.containingCircleRadius , this.originY );
                    ctx.arc( this.originX , this.originY, this.containingCircleRadius * ig.system.scale,0, Math.PI * 2 );
                    ctx.lineWidth = 4;
                    ctx.stroke();
                    ctx.closePath();
                    
                    //draw the circle to show accumulated power
                    ctx.fillStyle = this.fillStyle;
                    ctx.beginPath();
                    ctx.moveTo( this.originX , this.originY );
                    if( this.radius >= 0 ){
                     ctx.arc( this.originX , this.originY , this.radius * ig.system.scale,0, Math.PI * 2 );
                    }
                    else{
                     ctx.arc( this.originX , this.originY , 0 * ig.system.scale,0, Math.PI * 2 );   
                    }
                    ctx.fill();
                    ctx.closePath();
                    
                },

                killText: function(){
                    //this is called in update function here and in ig.game.handleMouseInput();
                    if( this.text != null ){ this.text.kill(); this.spawned = false; }
                },

                workOutTravelSpeed: function(){
                    //S = D / T
                    //get px distance we must travel every 100th of a second. 
                    var posNeg = null;
                    if( this.breathTimer.delta() <= 0){ var posNeg = -1; } else{ var posNeg = 1; }
                    if( this.state == "IN"){
                        this.travelSpeed = ( this.containingCircleRadius / ( posNeg * this.breathTimer.delta() ) / 100 );
                    }
                    else{
                        this.travelSpeed = ( this.containingCircleRadius / ( posNeg * this.breathTimer.delta() ) / 100 );
                    }
                    //constrain travel speed to sensible threshold
                    if( this.travelSpeed >= 2 ){ this.travelSpeed = 2; }
                },

                cleanUpAfterBreathIsFinished: function(){
                    //make sure filled circle has vanished
                    ig.game.breathIndicator.radius = 0; 
                    //kill the breathIndicator, clean up main.js pointer
                    ig.game.breathIndicator.kill();
                    ig.game.breathIndicator = false;
                    //kill the breathText
                    this.killText();                   
                },


                kill: function(){
                    this.parent();
                }

        });
});