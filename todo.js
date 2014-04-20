------------------------------
//////////////////////////////////
//  HRV TINY WINGS TODO         //
//////////////////////////////////

//- init horizontal stage
//- clean up balloon lifter code
//- re-build dummy breath indicator
	//- include new in,hold,ex,hold cycle
	//- use 6brpm values for now
	//- indicator constantly runs, doesnt require input
	//- place over player
	- fix text wobble
//- clean up breathIndicator so it does not connect to spawning etc
- Feed in dummy heart rate & coherence values
	//- test bpm values by altering bpm var on a timer
	- test coherence values... somehow

//- Dynamic level building
	//- research edge shapes
	//- test building edge shapes
	//- build in ig.game.bpm and ig.game.timeElapsed 
	//- build an edgeShape every x seconds in update
		//- too much performance hit if we do a 1px line every update
		//- either do a longer line more slowly (naive)
		//- or find a way to feed the right world co-ords into edgeShape 
		  //at time of construction
		//- 2 vertices in array
		//- max delay would be perhaps 0.5 seconds 
		//- first vertex is finishing vertex of previous edgeShape
		//- second vertex is new co-ords expressed relative to local co-ords
			//- so y co-ord = ( ig.game.bpm - this.pos.y )
	//- put sprite on floor shapes

		- still not great on performance... needs testing. 	
	//- take dummy bpm values and test level building  

	- sort out proper infinite scrolling
		//- destroy past level points
		//- build future level ahead of player
		//- deal with destroying past points
		//- entities not killing properly
		//- Actually it was about controlling future points
		//- when player reaches end of level (or certain point)
			//- around x = 4000
		//- clear timeElapsed
		//- kill all edgeShapes
		//- move player back to starting point
		- play with level length to get this feeling right. 
		- What is max size of level for good performance?

		- work on a proper framework for tweaking these numbers
			- sample rate
			- bpm to y axis normalisation
			- time to x axis normalisation
			- velocity of moving edgeShapes -x 
			- velocity of player
			- amount of tail to kill on bpm data 

- Player character
	- movement connected to coherence score
	//- tap to bounce
	//- OR: movement connected to breath, tiny wings style. 
		//- in breath floats player up and starts spinning, 
		//- out breath drops player down, spinning continues for out breath duration
		- this should encourage synchrony/RSA! 
	//- put breath indicator over player
- Test with dummy values 

- coherence should increase speed
	- so decrease speed to start with
	//- show coherence just with an onscreen message right now
	- coherence is 0.1 -> 1.0 
	- so just add 1 to it and multiply torque by that? worth a try
	- and good coherence gets you a particle effect

- make proper ground graphic - thin slices

- think about game design around this
	- switches
	- pickups/collectibles
	- puzzles
	- slicing and drawing terrain?



/////////////////////

breathController: function(){
		//set the breathIndicator and initialise times 
		//in: 3, hold: 1, out: 4, hold: 2
		//    3        4       8        10

  		//set timer in ig.game scope
		if( this.breathTimer <= this.breathModel.i ){
			//INHALE
		}
		if( this.breathTimer > this.breathModel.i && this.breathTimer <= this.breathModel.i + this.breathModel.ih ){
			//INHALE HOLD
		}
		if( this.breathTimer > this.breathModel.i + this.breathModel.ih && this.breathTimer <= this.breathModel.i + this.breathModel.ih + this.breathModel.o ){
			//EXHALE
		}
		if( this.breathTimer > this.breathModel.i + this.breathModel.ih + this.breathModel.o && this.breathTimer <= this.breathModel.i + this.breathModel.ih + this.breathModel.o + this.breathModel.oh ){
			//EXHALE HOLD

			//reset timer
		}

	}






//////////////////

//map: 
var map = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]

//- generate a tall level the width of the screen 
- when the camera trap hits the edge of the level
- create a new column 
	- loop through all arrays, simply push in one int 
	- slice out the int at the [0] pos
- 



--------------------


- every loop 
	- loop through all edge shapes
	- translate them on the x axis 
	- if ( pos.x < 0 )
		- kill them 










