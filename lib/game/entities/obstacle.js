ig.module(
	'game.entities.obstacle'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityObstacle = ig.Box2DEntity.extend({
	size: {x: 140, y:140},
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "OBSTACLE",
	state: "ON",
	radius: 35,
	dampingRatio: 0.5,
	frequencyHz: 12,
	zIndex: 10,
	jointList: [],
	upForce: 0,
	contactList: [],
	selfContacts: 0,
	grabbable: true,

	init: function( x, y, settings ) {

		//establish a random animSheet
		var randNum = Math.ceil( Math.random() * 2 );
		switch( randNum ){
			case 1:
				this.obstacleType = "WOODCUBE";
				this.size = {x: 140, y:140};
				this.upForce = -600;
				this.animSheet = new ig.AnimationSheet( 'media/woodenObstacle.png' , 140 , 140 );
			break;
			case 2:
				this.obstacleType = "WOODLINE";
				this.size = {x: 140, y:70};
				this.upForce = -300;
				this.animSheet = new ig.AnimationSheet( 'media/woodenObstacle140x70.png' , 140 , 70 );
			break;
		}

		this.addAnim( 'idle' , 0.1 , [0] );
		this.currentAnim = this.anims.idle;
		
		//call parent
		this.parent( x, y, settings );
	},

	createBody: function() {
		//build new body definition from prototype
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		//set values
	    bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x ) * Box2D.SCALE,
			(this.pos.y ) * Box2D.SCALE
		); 
	    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;    
	    //create body, assign to this class
	    this.body = ig.world.CreateBody(bodyDef);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		fixture.shape.SetAsBox(
			this.size.x / 2 * Box2D.SCALE,
			this.size.y / 2 * Box2D.SCALE
		);
		fixture.density = 0.5;
	    fixture.restitution = 0.2;
	    fixture.friction = 1;

	    //set userData
	    fixture.userData = this;

	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);
	    //set body properties
	    this.body.SetLinearDamping(1);
	    this.body.SetAngularDamping(1);
    	

	},

	update: function() { 
		//apply constant upward force
		this.body.ApplyForce( new Box2D.Common.Math.b2Vec2(0,this.upForce), this.body.GetPosition() );
		this.yPos = this.body.GetPosition().y;
		this.parent();
	},

	kill: function(){
		//should spawn some debris particles here

		this.parent();

	}

});

});