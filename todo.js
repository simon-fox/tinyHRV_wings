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
			- polling rate
				- Separate sampling and polling
				- sampling is what the Polar does with the pulse wave
				- it needs to do it 100s of times a second (0.01 or so)
				- Polling is what we do with the BPM data the polar generates
				- It only needs to happen somewhere between 2 and 4 times a second
				- We may have a problem when we poll twice a second because we might 
				  receive the same heart rate twice in a row when that is essentially inaccurate
				- SO, the questions is: Does the CC library send us data ONLY on a set rate ( once every 0.5 seconds )
				- or, does it send us data every time a new BPM/IBI is calculated?
					- for our purposes BPM and IBI are interchangeable 
				- When we generate new edge shapes we need to add some logic
					- has a new IBI/BPM been generated?
					- if NOT - then make a best guess about what the next point may be
						- Possible approaches: 
							- project the existing gradient OR
							- Email OROWA to ask him about exponential rate of change calculation 
								- exponential rate of change: 
								- bpm: 100
								       		diff: -20
								       80 			diff: 5
								       		diff: -15
								       65			diff: 10 -> this is the rate of change of the rate of change
								       		diff: -5
								       60
								       		diff: -5
								       55
								            diff: -5 - this is the rate of change
								       50

								- so if there is no new piece of data after 50 bpm - the last point
								- and the previous rate of change is -5
								- the previous rate of change of rate of change is 0
								- so you would assume the rate of change remains constant
								- and the best guess for the next BPM is 45
								- we assume that the rate of change of rate of change remains constant 
								  from one point to the next - play with this assumption if inaccurate 


					- if so, use the new piece of data
			- bpm to y axis normalisation
				- free to tweak as gameplay demands
			- time to x axis normalisation
				- free to tweak as gameplay demands 
			- velocity of moving edgeShapes -x 
			- velocity of player
			- amount of tail to kill on bpm data 

- Player character
	- movement connected to coherence score
	//- tap to bounce
	//- OR: movement connected to breath, tiny wings style. 
		//- in breath floats player up and starts spinning, 
		//- out breath drops player down, spinning continues for out breath duration
		//- this should encourage synchrony/RSA! 
	//- put breath indicator over player
	//- give the player a score
	- write the score to screen
- Test with dummy values 

- coherence should increase speed
	- so decrease speed to start with
	//- show coherence just with an onscreen message right now
	- coherence is 0.1 -> 1.0 
	- so just add 1 to it and multiply torque by that? worth a try
	- and good coherence gets you a particle effect

//- turn off coherence multiplier for test

//- award points for staying close to the front of the wave
	//- getPosition on the edgeEntities[ .length ]; 
	//- same on player
	//- if edgeEntities.pos.x - player.pos.x <= someValue 
	//- points!!!
	- scoring should generate a particle effect
	- BI color should augment according to distance from leading edge
		- map color change directly to distance. 

//- make proper ground graphic - thin slices

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










