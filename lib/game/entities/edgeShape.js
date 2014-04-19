	ig.module(
	'game.entities.edgeShape'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityEdgeShape = ig.Box2DEntity.extend({
	size: { x: 55 , y : 20 },
	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	name: "EDGE",
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.animSheet = new ig.AnimationSheet( 'media/floorBlock_55x20y.png' , 55 , 20 );
		this.addAnim( 'idle', 0.1, [0] );
		this.currentAnim = this.anims.idle;

	},

	createBody: function() {
		//build new body definition from prototype
		var bodyDef = new Box2D.Dynamics.b2BodyDef();
		//set values
	    bodyDef.position = new Box2D.Common.Math.b2Vec2(
			(this.pos.x + this.size.x / 2 ) * Box2D.SCALE,
			(this.pos.y + this.size.y / 2 ) * Box2D.SCALE
		); 
	    bodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;    
	    //create body, assign to this class
	    this.body = ig.world.CreateBody(bodyDef);

	    //new fixture definition from prototype
	    var fixture = new Box2D.Dynamics.b2FixtureDef;
	    //set values
		fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();   

		//set up vertex array - array of points
		//grab previous edge for leading co-ord
		var edgeArray = ig.game.getEntitiesByType( EntityEdgeShape ); 
		var oldEdge = {}; 
		if( edgeArray.length ){
			oldEdge = edgeArray[ edgeArray.length - 1 ];
		}
		else{ 
			oldEdge.pos = { x : 0 , y : 0 , }; 
		}

		var verticesArray = [
			new Box2D.Common.Math.b2Vec2( ( oldEdge.pos.x - this.pos.x ) * Box2D.SCALE, ( oldEdge.pos.y - this.pos.y  ) * Box2D.SCALE),
			new Box2D.Common.Math.b2Vec2( 0 * Box2D.SCALE,  0 * Box2D.SCALE)
		];

		fixture.shape.SetAsArray(verticesArray);
	    fixture.density = 1.0;
	    fixture.friction = 1;
	    //create with body as parent 
	    this.fixture = this.body.CreateFixture(fixture);

	},
	
	
	update: function() {

		this.parent();
	}
});

});


