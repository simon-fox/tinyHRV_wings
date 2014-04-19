ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	//plugins
	'plugins.box2d.game',
	//'plugins.box2d.debug',
	//levels
	'game.levels.stage',
	//entities
	'game.entities.balloon_ropeSegment',
	'game.entities.balloon',
	'game.entities.balloon_anchor',
	'game.entities.playButtonBalloon',
	'game.entities.catProjectile',
	'game.entities.obstacle',
	'game.entities.buddhaProjectile',
	'game.entities.sensor',
	//particles
	'game.entities.rewardParticle',
	//UI classes
	'game.entities.windVector',
	'game.entities.breathCounter',
	'game.entities.breathIndicator',
	'game.entities.breatheText',
	'game.entities.titleScreenBackgroundImage',
	'game.entities.titleImage'
)
.defines(function(){

MyGame = ig.Box2DGame.extend({
	font: new ig.Font( 'media/invasionFont.png' ),
	gravity: 250,
	mouseLast: {x: 0, y: 0},
	mouseOverBody: false,
	mouseOverClass: false,
	mouseJoint: false,
	breathCount: 0,
	breaths: [ {i:3 , o: 3} , {i:3 , o: 4} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3}, {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} , {i:3 , o: 3} ],
	killList: [],
	ropeSegmentCount: 0,
	balloonsArray: [],
	breathIndicator: false,

	init: function() {
		//box2d debug
		this.debugCollisionRects = true;
		//bind keys
		ig.input.bind( ig.KEY.UP_ARROW, 'up');
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down');
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind( ig.KEY.MOUSE1, 'mouseLeft' );
		// Load level
		this.loadLevel( LevelStage );
		//set up contact listener
		this.setContactListener();
		//spawn backdrop
		//ig.game.spawnEntity( EntityTitleScreenBackgroundImage , 0 , 0 );
		ig.game.spawnEntity( EntitySensor , 80 , 10 , { senseFor : 'RED', } );
		ig.game.spawnEntity( EntitySensor , 240 , 10 , { senseFor : 'PURPLE', } );
		ig.game.spawnInNewItem();
		ig.game.sortEntitiesDeferred();
		ig.game.buildBalloonsArray();
	},

	loadLevel: function( level ) {        
	    this.parent( level );
	},
	
	update: function() {
		this.parent();
		this.handleMouseInput();
		this.cleanUpWindVectors();
		this.processKillList();
		//sort balloonsArray zIndex by yPos
		//this.sortZindex();
	},
	
	draw: function() {
		//draw box2d debug
		//this.debugDrawer.draw();

		this.parent();

		//get system dimensions for drawing
		//var x = ig.system.width/2,
		//y = ig.system.height/2;
		//drawing text
		//this.font.draw( "Flowy Boat" , x - 150, y - 280, ig.Font.ALIGN.LEFT );	
	},

	handleMouseInput: function() {
		//grab mouse positions and adjust for b2d
        this.mouseX = (ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE;
    	this.mouseY = (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE;

		//click, state & release functions for mouse click
		if (ig.input.pressed('mouseLeft') && this.breathIndicator == false ) {
			//do collision detection in box3d
			this.getBodyUnderMouse();

			if( this.mouseOverClass.grabbable == true && this.mouseOverClass != false ){
				//spawn a breathIndicator
				this.breathIndicator = ig.game.spawnEntity( EntityBreathIndicator , 0 , 0 );
				//play inflation animation on stored balloon after getBodyUnderMouse()
				if( this.mouseOverClass != false && this.mouseOverClass.isBalloon == true ){
					this.mouseOverClass.currentAnim = this.mouseOverClass.anims.inflate;
					this.mouseOverClass.currentAnim.rewind();
				}
			
				//set the timer and state in breathIndicator 
				this.breathIndicator.state = "IN";
				this.breathIndicator.breathTimer.set( 4 ); //hardcode breath time for now
			}
			
			
        }
        if (ig.input.state('mouseLeft')) {
        	if( this.mouseOverClass.grabbable == true && this.mouseOverClass != false  ){
        		this.createMouseJoint();

        		if( this.breathIndicator.fullBreathTaken == true ){ 
        		this.breathIndicator.state = "HOLDING"
        		}
        	}
        	
        }
        if (ig.input.released('mouseLeft') && this.breathIndicator != false ) {
			if( this.mouseOverClass.grabbable == true  && this.mouseOverClass != false ){
				//kill breathIndicator
        		this.breathIndicator.state = "OUT";
        		this.breathIndicator.killText();
				this.breathIndicator.breathTimer.set( 5 ); //hardcode breath time for now
				//if we've taken a full breath , break the joint on the item
				if( this.breathIndicator.fullBreathTaken == true ){ 
					//spawn in a new item to inflate 
					this.breakJoint(); 
                    ig.game.spawnInNewItem();

				}
	        	//play deflation animation on stored balloon BEFORE destroyMouseJoint()
				if( this.mouseOverClass != false  && this.mouseOverClass.isBalloon == true ){
					this.mouseOverClass.currentAnim = this.mouseOverClass.anims.deflate;
					this.mouseOverClass.currentAnim.rewind();
				}

				this.destroyMouseJoint();
			}
        }
        this.updateMouseJointTarget();
	}, 

	setContactListener: function(){
		this.contactListener = new Box2D.Dynamics.b2ContactListener;
		ig.world.SetContactListener(this.contactListener);
		this.contactListener.BeginContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var fixtureB = contact.GetFixtureB();
			var fixtureBIsInTheList = false;
			var fixtureAIsInTheList = false;
			// INVESTIGATE FIXTURE A
			if ( fixtureA.m_userData != null && fixtureB.m_userData != null ){
				switch(fixtureA.m_userData.name){
					case 'BALLOON':
						//look through stored contacts
						for( var i =  0 ; i < fixtureA.m_userData.contactList.length ; i++ ){
							//is fixtureB there?
							if( fixtureA.m_userData.contactList[i] == fixtureB ){
								fixtureBIsInTheList = true;
							}
						}
						if ( fixtureBIsInTheList == false ){
							fixtureA.m_userData.contactList.push( fixtureB );
						}
						
					break;
					case 'SENSOR':
						if( fixtureB.m_userData.name == 'BALLOON' ){
							//A is SENSOR B is BALLOON
							if( fixtureA.m_userData.senseFor == fixtureB.m_userData.colorName ){
								console.log('Woohoo they match');
								var color = 'PURPLE';
								if( fixtureA.m_userData.senseFor == 'RED' ){
									color = 'RED';
								}
								ig.game.spawnRewardText(color);
							}
						}
					break;
				}
			}
			// INVESTIGATE FIXTURE B
			if ( fixtureB.m_userData != null && fixtureA.m_userData != null ){
				switch(fixtureB.m_userData.name){
					case 'BALLOON':
						//look through stored contacts
						for( var i =  0 ; i < fixtureB.m_userData.contactList.length ; i++ ){
							//is fixtureA there?
							if( fixtureB.m_userData.contactList[i] == fixtureA ){
								fixtureAIsInTheList = true;
							}
						}
						if ( fixtureAIsInTheList == false ){
							fixtureB.m_userData.contactList.push( fixtureA );
						}
						
					break;
					case 'SENSOR':
						if( fixtureA.m_userData.name == 'BALLOON' ){
							//B is SENSOR Ais BALLOON
							if( fixtureB.m_userData.senseFor == fixtureA.m_userData.colorName ){
								console.log('Woohoo they match');
								
								var color = 'PURPLE';
								if( fixtureB.m_userData.senseFor == 'RED' ){
									color = 'RED';
								}
								ig.game.spawnRewardText(color);
							}
						}
					break;
				}
			}
		};

		this.contactListener.EndContact = function(contact){
			var fixtureA = contact.GetFixtureA();
			var fixtureB = contact.GetFixtureB();
			// INVESTIGATE FIXTURE A
			if ( contact.GetFixtureA().m_userData != null && contact.GetFixtureB().m_userData != null ){
				switch(contact.GetFixtureA().m_userData.name){
					case 'BALLOON':
						//look through stored contacts
						if( fixtureA.m_userData.contactList.length ){
							for( var i =  0 ; i < fixtureA.m_userData.contactList.length ; i++ ){
								//is fixtureB there?
								if( fixtureA.m_userData.contactList[i] == fixtureB ){
									//if it is, remove it
									fixtureA.m_userData.contactList.splice( i , 1 );
								}
							}
						}
					break;
				}
			}
			// INVESTIGATE FIXTURE B
			if ( contact.GetFixtureA().m_userData != null && contact.GetFixtureB().m_userData != null ){
				switch(contact.GetFixtureA().m_userData.name){
					case 'BALLOON':
						//look through stored contacts
						if( fixtureB.m_userData.contactList.length ){
							for( var i =  0 ; i < fixtureB.m_userData.contactList.length ; i++ ){
								//is fixtureA there?
								if( fixtureB.m_userData.contactList[i] == fixtureA ){
									//if it is, remove it
									fixtureB.m_userData.contactList.splice( i , 1 );
								}
							}
						}
					break;
				}
			}
		};


	},

	processKillList: function(){
		//loop through killList and destroy all bodies
		if( this.killList.length > 0 ){
			for( var i = 0 ; i < this.killList.length ; i++ ){
				this.killList[i].kill();
			}
			//empty killList 
			this.killList = [];
		}
	},

	cleanUpWindVectors: function(){
		var windVectorArray = ig.game.getEntitiesByType(EntityWindVector);
		if( windVectorArray.length > 1){
			windVectorArray[0].kill();
		}
	},

	buildBalloonsArray: function(){
		for( var i = 0 ; i < ig.game.getEntitiesByType(EntityBalloon).length ; i++ ){
			this.balloonsArray.push( ig.game.getEntitiesByType(EntityBalloon)[i] );
		}
	},

	sortZindex: function(){
		//sort into ascending order - lowest yPos (back of z order) at 0 
		this.balloonsArray.sort(function(o1, o2) {
			return o1.yPos - o2.yPos;
		});
		//give zIndex based on yPos, sails above boat bodies
		for( var i = 0 ; i < this.balloonsArray.length ; i++ ){
			//play button is always at the front
			if( this.balloonsArray[i].name == "PLAYBUTTON"){
				this.balloonsArray[i].zIndex = i + 20;
			}
			else { this.balloonsArray[i].zIndex = i + 10; }
		}
		//sort entities for render order
		ig.game.sortEntitiesDeferred(); 
	},

	getBodyUnderMouse: function(){
		//let's grab a body in box2d
        //Create a new bounding box
        var aabb = new Box2D.Collision.b2AABB();
        //set lower & upper bounds
        aabb.lowerBound.Set( this.mouseX - 0.01, this.mouseY - 0.01 );
        aabb.upperBound.Set( this.mouseX + 0.01, this.mouseY + 0.01 );
        //callback for the query function
        function GetBodyCallBack(fixture){
                //store body
                ig.game.mouseOverClass = fixture.GetUserData();
                ig.game.mouseOverBody = fixture.GetBody();
                console.log(fixture.GetUserData().name + " grabbed and stored");
        }
        ig.world.QueryAABB(GetBodyCallBack,aabb);
	},

	createMouseJoint: function(){
		//is there a body stored? is there a joint already?
        if(this.mouseOverBody != false && this.mouseJoint == false){
                var mouseJointDef = new Box2D.Dynamics.Joints.b2MouseJointDef;
                mouseJointDef.bodyA = ig.world.GetGroundBody();
                mouseJointDef.bodyB = this.mouseOverBody;
                mouseJointDef.maxForce = 1000;
                mouseJointDef.target.Set((ig.input.mouse.x + ig.game.screen.x)*Box2D.SCALE,(ig.input.mouse.y + ig.game.screen.y)*Box2D.SCALE);
                this.mouseJoint = ig.world.CreateJoint(mouseJointDef);
        }
	},

	destroyMouseJoint: function(){
		if(this.mouseOverBody != false){
            //clear stored body
            //happens in breathIndicator.cleanUpAfterBreathIsFinished();
            ig.game.mouseOverBody = false;
            ig.game.mouseOverClass = false;
        }
        if(this.mouseJoint != false){
            //destroy mouse joint
            ig.world.DestroyJoint(this.mouseJoint);
            //clear stored body
            this.mouseJoint = false;
        }
	},

	updateMouseJointTarget: function(){
		//if we have a mouse joint, keep setting the target
        if(this.mouseJoint != false){
                var target = new Box2D.Common.Math.b2Vec2((ig.input.mouse.x + ig.game.screen.x) * Box2D.SCALE , (ig.input.mouse.y + ig.game.screen.y) * Box2D.SCALE);
                this.mouseJoint.SetTarget(target);
        }
	},

	spawnInNewItem: function(){
		for( var i = 0 ; i < ig.game.entities.length ; i++ ){
			ig.game.entities[i].newest = false;
		}

		//spawn in new item 
		ig.game.spawnEntity( EntityBalloon , 86 , 640 );


		

	},

	breakJoint: function(){
                     //find the rope joint to destroy
                    //var n = ig.game.mouseOverClass.jointList.length - 9;
                    //ig.world.DestroyJoint( ig.game.mouseOverClass.jointList[n] );
                    
                    //kill all ropeSegments
                    var ropeSegmentsArray = ig.game.getEntitiesByType( EntityBalloon_ropeSegment );
                    for( var i = 0 ; i < ropeSegmentsArray.length ; i++ ){
                        if( ropeSegmentsArray[i].anchorChain == true ){
                        	ropeSegmentsArray[i].kill();
                        }
                    }
                    ig.game.ropeSegmentCount = ig.game.getEntitiesByType( EntityBalloon_ropeSegment ).length;
                    
    },

    spawnRewardText: function( color ){
    	if( color == 'RED' ){
    		ig.game.spawnEntity( EntityRewardParticle , 30 , 50 );
    	}
    	else{
    		ig.game.spawnEntity( EntityRewardParticle , 170 , 50 );	
    	}
    },

	rotate: function(pointX, pointY, rectWidth, rectHeight, angle) {
	  // convert angle to radians
	  //angle = angle * Math.PI / 180.0
	  // calculate center of rectangle
	  var centerX = rectWidth / 2.0;
	  var centerY = rectHeight / 2.0;
	  // get coordinates relative to center
	  var dx = pointX - centerX;
	  var dy = pointY - centerY;
	  // calculate angle and distance
	  var a = Math.atan2(dy, dx);
	  var dist = Math.sqrt(dx * dx + dy * dy);
	  // calculate new angle
	  var a2 = a + angle;
	  // calculate new coordinates
	  var dx2 = Math.cos(a2) * dist;
	  var dy2 = Math.sin(a2) * dist;
	  // return coordinates relative to top left corner
	  return { newX: dx2 + centerX, newY: dy2 + centerY };
	}

});

var c = document.createElement('canvas');
c.id = 'canvas';
document.body.appendChild(c);

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 568, 1 );

});
