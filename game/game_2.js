/**
 * Created by rfrance on 11/24/2016.
 */
{
	let Vec2 = utils.geometry2d.Vec2,
		Rect = utils.geometry2d.Rect,
		Circle = utils.geometry2d.Circle,
		randomColor = utils.tools.randomColor;
//######################################################################################################################
//####################################################### Object #######################################################
//######################################################################################################################
	/**
	 * @memberOf game
	 * @class
	 * @classdesc the base class of all game objects. contains only seven optional attributes : <!--
	 * -->position, speed, accel (for the acceleration), angle, rotationSpeed, collider and renderer, <!--
	 * -->which are not present at the creation, but can be set using setters and direct access. <!--
	 * -->You better should create subclasses of this base class where all needed attributes are created <!--
	 * -->in the constructor.
	 * There are also three attributes that are defined in the prototype because they are generally common <!--
	 * -->to all instances of a class (but you can redefine it in for one object if you want) :
	 * - the {@link game.Object#renderLayer|renderLayer}, used to define the drawing priority,
	 * - the {@link game.Object#bodyLayer|bodyLayer}, used to define the layer of the object for collision <!--
	 * -->detection. has no impact on other things such as frame or drawing priority.
	 * - the {@link game.Object#collisionLayers|collisionLayers}, used to define the layers this object <!--
	 * -->can collide in.
	 */
	game.Object = class {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Vec2} [position=null]
		 * @param {utils.geometry2d.Vec2} [speed=null]
		 * @param {utils.geometry2d.Vec2} [accel=null]
		 */
		constructor(position = null, speed = null, accel = null) {
			if(position) {
				/**
				 * @name game.Object#position
				 * @type {utils.geometry2d.Vec2}
				 */
				this.position = position.clone();
				if(speed) {
					/**
					 * @name game.Object#speed
					 * @type {utils.geometry2d.Vec2}
					 */
					this.speed = speed.clone();
					if(accel) {
						/**
						 * @name game.Object#accel
						 * @type {utils.geometry2d.Vec2}
						 */
						this.accel = accel.clone();
			}   }   }
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - -transform methods - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
//-------------------------------------------------------position-------------------------------------------------------
		/**
		 * returns the position of the object, or {@link utils.geometry2d.Vec2.ZERO|Vec2.ZERO} <!--
		 * -->if the attribute does not exist.
		 * @returns {Vec2}
		 */
		getPosition() {
			return this.position || Vec2.ZERO;
		}
		/**
		 * returns a copy of the position of the object
		 * @returns {utils.geometry2d.Vec2|Vec2}
		 */
		copyPosition() {
			return this.getPosition().clone();
		}
		/**
		 * sets the position of the object to the specified one if the attribute exists, creates it otherwise
		 * @param {utils.geometry2d.Vec2} pos
		 * @returns {game.Object} <code>this</code>
		 */
		setPosition(pos) {
			return this.setPositionXY(pos.x, pos.y);
		}
		/**
		 * sets the position of the object to the specified coordinates if the attribute exists, <!--
		 * -->creates it otherwise
		 * @param {number} x
		 * @param {number} y
		 * @returns {game.Object} <code>this</code>
		 */
		setPositionXY(x, y) {
			if(this.position) this.position.setXY(x, y);
			else this.position = new Vec2(x, y);
			return this;
		}

//---------------------------------------------------------speed--------------------------------------------------------
		/**
		 * returns the speed of the object, or {@link utils.geometry2d.Vec2.ZERO|Vec2.ZERO} <!--
		 * -->if the attribute does not exist.
		 * @returns {utils.geometry2d.Vec2}
		 */
		getSpeed() {
			return this.speed || Vec2.ZERO;
		}
		/**
		 * returns a copy of the speed of the object
		 * @returns {utils.geometry2d.Vec2}
		 */
		copySpeed() {
			return this.getSpeed().clone();
		}
		/**
		 * sets the speed of the object to the specified one if the attribute exists, creates it otherwise
		 * @param {utils.geometry2d.Vec2} spd
		 * @returns {game.Object} <code>this</code>
		 */
		setSpeed(spd) {
			return this.setSpeedXY(spd.x, spd.y);
		}
		/**
		 * sets the speed coordinates of the object to the specified values if the attribute exists, <!--
		 * -->creates it otherwise
		 * @param {number} x
		 * @param {number} y
		 * @returns {game.Object}<code>this</code>
		 */
		setSpeedXY(x, y) {
			if (this.speed) this.speed.setXY(x, y);
			else this.speed = new Vec2(x,y);
			return this;
		}

//-----------------------------------------------------acceleration-----------------------------------------------------
		/**
		 * returns the acceleration of the object, or {@link utils.geometry2d.Vec2.ZERO|Vec2.ZERO} <!--
		 * -->if the attrbute does not exist.
		 * @returns {Vec2|utils.geometry2d.Vec2}
		 */
		getAcceleration() {
			return this.accel || Vec2.ZERO;
		}
		/**
		 * returns a copy of the acceleration of the object.
		 * @returns {utils.geometry2d.Vec2|Vec2}
		 */
		copyAcceleration() {
			return this.getAcceleration().clone();
		}
		/**
		 * sets the acceleration of the object to the specified one if the attribute exists, useless otherwise
		 * @param {utils.geometry2d.Vec2} acc
		 * @returns {game.Object} <code>this</code>
		 */
		setAcceleration(acc) {
			this.setAccelerationXY(acc.x, acc.y);
			return this;
		}
		/**
		 * sets the acceleration coordinates of the object to the specified values if the attribute exists, <!--
		 * -->useless otherwise
		 * @param {number} x
		 * @param {number} y
		 */
		setAccelerationXY(x, y) {
			if (this.accel) this.accel.setXY(x, y);
			else this.accel = new Vec2(x,y);
			return this;
		}

//-------------------------------------------------------rotation-------------------------------------------------------
		/**
		 * returns the rotation speed (in radians per second) of the object if it exists, or 0.
		 * @returns {number}
		 */
		getRotationSpeed() {
			return this.rotationSpeed || 0;
		}
		/**
		 * set the rotation speed of the object to the specified value in radians per seconds.
		 * @param radPerSec
		 */
		setRotationSpeed(radPerSec) {
			this.rotationSpeed = radPerSec;
		}
		/**
		 * rotate the object according to the specified angle in radians
		 * @param {number} radians
		 * @returns {game.Object} <code>this</code>
		 */
		rotate(radians) {
			if (this.renderer) this.renderer.rotate(radians);
			if (this.collider) this.collider.rotate(radians);
			return this;
		}

//-------------------------------------------------high-level transforms------------------------------------------------
		/**
		 * moves the object of the specified translation.
		 * @param {utils.geometry2d.Vec2} delta
		 * @returns {game.Object} <code>this</code>
		 */
		move(delta) {
			return this.moveXY(delta.x, delta.y);
		}
		/**
		 * moves the object according to the specified translation coordinates
		 * @param {number} x
		 * @param {number} y
		 * @returns {game.Object} <code>this</code>
		 */
		moveXY(x, y) {
			this.getPosition().addXY(x, y);
			return this;
		}
		/**
		 * increase the object's speed according to the parameter
		 * @param deltaSpd
		 * @returns {game.Object} <code>this</code>
		 */
		accelerate(deltaSpd) {
			return this.accelerateXY(deltaSpd.x, deltaSpd.y);
		}
		/**
		 * increase the object's speed according to the parameters
		 * @param {number} x
		 * @param {number} y
		 * @returns {game.Object} <code>this</code>
		 */
		accelerateXY(x, y) {
			this.getSpeed().addXY(x, y);
			return this;
		}
		/**
		 * change the object size by multiplying it's dimensions by the given factor
		 * @param {number} factor
		 * @returns {game.Object} <code>this</code>
		 */
		scale(factor) {
			if (this.renderer) this.renderer.scale(factor);
			if (this.collider) this.collider.scale(factor);
			return this;
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - -Rect & Radius getters - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		/**
		 * returns the Rect containing the object, ie the collider and the renderer if they exists, <!--
		 * -->and the position point.
		 * @returns {utils.geometry2d.Rect}
		 */
		getRect() {
			return Rect.getUnion([this.getRenderRect(), this.getColliderRect()]);
		}
		/**
		 * returns the Rect containing the object's renderer, or at least the position.
		 * @returns {utils.geometry2d.Rect}
		 */
		getRenderRect() {
			return this.renderer ? this.renderer.setPosition(this.getPosition()).getRect()
									: Rect.createFromPoint(this.getPosition());
		}
		/**
		 * returns the Rect containing the object's collider, or at least the position.
		 * @returns {utils.geometry2d.Rect}
		 */
		getColliderRect() {
			return this.collider ? this.collider.setPosition(this.getPosition()).getRect()
									: Rect.createFromPoint(this.getPosition());
		}
		/**
		 * returns the radius of the object, ie the maximum between the radius of the collider and the one of the <!--
		 * -->renderer if they exists, or 0.
		 * @returns {number}
		 */
		getRadius() {
			return Math.max(this.getRenderRadius(), this.getColliderRadius());
		}
		/**
		 * returns the radius of the renderer or 0 if it doesn't exist.
		 * @returns {number}
		 */
		getRenderRadius() {
			return this.renderer ? this.renderer.getRadius() : 0;
		}
		/**
		 * returns the radius of the collider or 0 if it doesn't exist.
		 * @returns {number}
		 */
		getColliderRadius() {
			return this.collider ? this.collider.getRadius() : 0;
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - -frame methods - - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		/**
		 * called once every frame by the game manager
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		onFrame(gameManager, dT) {
			this.moveOnFrame(gameManager, dT);
			this.accelerateOnFrame(gameManager, dT);
			this.rotateOnFrame(gameManager, dT);
		}
		/**
		 * called by the {@link game.Object#onFrame|onFrame} method. moves according speed.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		moveOnFrame(gameManager, dT) {
			let spd = this.getSpeed();
			if (!spd.isZero()) this.move(spd.clone().mul(dT));
		}
		/**
		 * called by the {@link game.Object#onFrame|onFrame} method. increase speed according acceleration.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		accelerateOnFrame(gameManager, dT) {
			let acc = this.getAcceleration();
			if (!acc.isZero()) this.accelerate(acc.clone().mul(dT));
		}
		/**
		 * called by the {@link game.Object#onFrame|onFrame} method. rotate according to rotation speed if exists.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		rotateOnFrame(gameManager, dT) {
			if (this.rotationSpeed) this.rotate(this.rotationSpeed * dT);
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - -collision methods - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		/**
		 * sets the <code>collider</code> attribute of the object.
		 * @param {game.ObjectCollider} collider
		 */
		setCollider( collider ) {
			this.collider = collider;
		}
		/**
		 * tells if the object is able to collide with the specified object, or if the object can collide <!--
		 * -->with any object if the parameter is null
		 * @param {?game.Object} [object=null]
		 * @returns {boolean}
		 */
		canCollide(object = null) {
			return this.collider!==undefined;
		}
		/**
		 * called at the beginning of the collision part of a frame, after the game manager has called <!--
		 * -->the onFrame method for all objects. This method is only called for objects with a <!--
		 * -->{@link game.Object#bodyLayer|bodyLayer} greater or equal to 0.
		 */
		prepareCollision() {
			this.collider.prepareCollision(this.getPosition());
		}
		/**
		 * returns true if the instances collides with the parameter object. This method is called after <!--
		 * the {@link game.Object#canCollide|canCollide} method and before the onCollision method, for both objects
		 * @param {game.Object} obj
		 * @returns {boolean}
		 */
		collides(obj) {
			return this.collider.collides(obj.collider);
		}
		/**
		 * called by the game manager on the collision with the specified object.
		 * @param {game.GameManager}gameManager
		 * @param {game.Object} object
		 */
		onCollision(gameManager, object) {
		}
		/**
		 * returns true if this object can collide with objects which are in the specified layer.
		 * @param {number} layer
		 * @returns {boolean}
		 */
		isInCollisionLayer(layer) {
			return this.collisionLayers.indexOf(layer) >= 0;
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - -render methods- - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		/**
		 * sets the <code>renderer</code> attribute of the object.
		 * @param {game.ObjectRenderer} renderer
		 */
		setRenderer( renderer ) {
			this.renderer = renderer;
		}
		/**
		 * called by the game map to draw the object on the canvas
		 * @param {CanvasRenderingContext2D}context2d
		 */
		render(context2d) {
			if (this.renderer) {
				this.renderer.setPosition(this.getPosition()).render(context2d);
			}
		}
		/**
		 * call this function if you want to draw debug informations on the canvas. draws the collider.
		 * @param {CanvasRenderingContext2D}context2d
		 */
		renderDebug(context2d) {
			if (this.collider) this.collider.render(context2d);
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - -death methods - - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		/**
		 * kills the object and removes it from the game before the next frame. The <!--
		 * -->{@link game.Object#onDeath|onDeath} method is then called
		 * @param gameManager
		 */
		kill(gameManager) {
			gameManager.removeObject(this);
		}
		/**
		 * called by the game manager the moment the object is removed from the game.
		 * @param gameManager
		 */
		onDeath(gameManager) {
		}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - -position checkers - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
		//noinspection JSSuspiciousNameCombination
		/**
		 * returns whether or not the object is outside the specified rectangle.
		 * @param {utils.geometry2d.Rect} rect
		 * @param {number} [marginX=0]
		 * @param {number} [marginY=marginX]
		 * @returns {boolean}
		 */
		isOutOfRect(rect, marginX = 0, marginY = marginX) {
			let r = this.getRect().addMarginsXY(marginX, marginY);
			return (rect.left > r.right || rect.right < r.left || rect.top > r.bottom || rect.bottom < r.top );
		}

		//noinspection JSSuspiciousNameCombination (for marginX = marginY)
		/**
		 * maintains the object inside the specified rectangle. you can call this method inside the <!--
		 * -->{@link game.Object#moveOnFrame} method, for example, to make sure the object <!--
		 * -->does not go out of a rectangle.
		 * This function returns the vector used to move the object inside the rectangle.
		 * @param {utils.geometry2d.Rect|Rect} rect
		 * @param {number} marginX
		 * @param {number} marginY
		 * @returns {utils.geometry2d.Vec2}
		 */
		maintainInRect(rect, marginX = 0, marginY = marginX) {
			rect = rect.clone().addMarginsXY(-marginX, -marginY);
			let objRect = this.getRect(),
				delta = new Vec2(
					rect.left > objRect.left ? rect.left - objRect.left :
					rect.right < objRect.right ? rect.right - objRect.right :
					0,
					rect.top > objRect.top ? rect.top - objRect.top :
					rect.bottom < objRect.bottom ? rect.bottom - objRect.bottom :
					0);
			if (!delta.isZero()) {
				this.moveXY(delta.x, delta.y);
			}
			return delta;
		}
	};
//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - static methods (filters) - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
	/**
	 * a filter used by the game manager by binding the first argument to a<!--
	 * -->rendering layer to get all objects of the same render layer. Feel free to use this filter.
	 * @static
	 * @param {number} layer
	 * @param {game.Object} obj
	 * @returns {boolean}
	 */
	game.Object.renderLayerFilter = (layer, obj) => obj.renderLayer == layer;
	/**
	 * a filter used by the game manager by binding the first argument to layers to get all objects <!--
	 * -->with a {@link game.Object#bodyLayer|bodyLayer} inside one of those layers. Feel free to use this filter.
	 * @static
	 * @param {number[]}layers
	 * @param {game.Object} obj
	 * @returns {boolean}
	 */
	game.Object.bodyLayerFilter = (layers, obj) => layers.indexOf(obj.bodyLayer) >= 0;
	/**
	 * a filter used by the game manager by binding the first argument to a layer to get all objects <!--
	 * -->able to intersect with an object having its {@link game.Object#bodyLayer|bodyLayer} equal to this layer. <!--
	 * -->Feel free to use this filter.
	 * @static
	 * @param {number} layer
	 * @param {game.Object} obj
	 * @returns {boolean}
	 */
	game.Object.collisionLayersFilter = (layer, obj) => obj.collisionLayers.indexOf(layer) >= 0;
	/**
	 * a filter used by the game manager to get all objects able to collide, i.e. with a <!--
	 * -->{@link game.Object#bodyLayer|bodyLayer} >= 0. Feel free to use this filter.
	 * @static
	 * @param {game.Object} obj
	 * @returns {boolean}
	 */
	game.Object.canCollideFilter = (obj) => obj.bodyLayer >= 0 && obj.canCollide();

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - -attributes with default value - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
	/**
	 * the render layer of this object. As it is generally common to all objects of the same class, <!--
	 * -->this attribute is generally defined in the prototype of the class, but you can do it anywhere you want <!--
	 * -->for your objects. The default value is {@link game.RenderLayer.OBJ1};
	 * This attributes is used to define an order for the objects to be drawn on the screen, and must be part of <!--
	 * -->the {@link game.RenderLayer} enumeration, or an other number if you handle it in your own game map.
	 * @name game.Object#renderLayer
	 * @type {game.RenderLayer|number}
	 */
	game.Object.prototype.renderLayer = game.RenderLayer.OBJ1;
	/**
	 * the body layer of this object. As it is generally common to all objects of the same class, <!--
	 * -->this attribute is generally defined in the prototype of the class, but you can do it anywhere you want <!--
	 * -->for your objects.
	 * This number defines where the body of the object is located. If an other object want to be able <!--
	 * -->to collide with it, it must have the same number in its {@link game.Object#collisionLayers} array.
	 * @name game.Object#bodyLayer
	 * @type {number}
	 */
	game.Object.prototype.bodyLayer = 0;
	/**
	 * the collision layers of this object. As it is generally common to all objects of the same class, <!--
	 * -->this attribute is generally defined in the prototype of the class, but you can do it anywhere you want <!--
	 * -->for your objects.
	 * This array defines which objects this object can collide with. To collide with an object, <!--
	 * -->this array must contain the {@link game.Object#bodyLayer|bodyLayer} value.
	 * @name game.Object#collisionLayers
	 * @type {number[]}
	 */
	game.Object.prototype.collisionLayers = [0];

//######################################################################################################################
//################################################### ObjectCollider ###################################################
//######################################################################################################################
	/**
	 * @class
	 * @memberOf game
	 * @abstract
	 * @classdesc the base class of object colliders. Colliders are used to handle collision detection of objects.
	 */
	game.ObjectCollider = class {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Rect} rect
		 */
		constructor(rect) {
			/**
			 * @name game.ObjectCollider#rect
			 * @type {utils.geometry2d.Rect}
			 */
			this.rect = rect.clone();
		}
		/**
		 * sets the collider position to the specified one
		 * @param {utils.geometry2d.Vec2} pos
		 * @returns {game.ObjectCollider} <code>this</code>
		 */
		setPosition(pos) {
			this.rect.setCenter(pos); return this;
		}
		/**
		 * rotates the collider with the specified angle in radians.
		 * Automatically called when the {@link game.Object#rotate|rotate} method of the associated object is called.
		 * @param {number} radians
		 */
		rotate(radians) {
		}
		/**
		 * scales the collider with the specified factor.
		 * Automatically called when the {@link game.Object#scale|scale} method of the associated object is called.
		 * @param {number} factor
		 */
		scale(factor) {
		}
		/**
		 * returns the radius of the collider, i.e the maximum distance from the center to any point of the collider.
		 * @returns {number}
		 */
		getRadius() {
			return 0;
		}
		/**
		 * returns the {@link game.ObjectCollider#rect} attribute of the collider
		 * @returns {utils.geometry2d.Rect}
		 */
		getRect() {
			return this.rect;
		}
		/**
		 * returns whether or not this collider can be considered as colliding with the specified collider
		 * is it is inside. Otherwise, the colliders will need to intersect for the <!--
		 * -->{@link game.ObjectCollider#collides|collides} method to return true.
		 * @param {game.ObjectCollider} collider
		 * @returns {boolean}
		 */
		collidesInside(collider) {
			return false;
		}
		/**
		 * prepare the collision detection by acquiring necessary variables, such as the the <!--
		 * -->{@link game.ObjectCollider#rect|rect} attribute.
		 * @param {utils.geometry2d.Vec2} position
		 */
		prepareCollision(position) {
			this.setPosition(position);
		}
		/**
		 * tells the collider that the collision detection is over for this object on this frame.
		 */
		finishCollision() {
		}
		/**
		 * returns true if the two colliders are colliding.
		 * @param {game.ObjectCollider} collider
		 * @returns {boolean}
		 */
		collides(collider) {
			return false;
		}
		/**
		 * draw the collider on the canvas for debug purpose.
		 * @param context2d
		 */
		render(context2d) {
			this.rect.draw(context2d);
		}
	};
//######################################################################################################################
//################################################ ShapedObjectCollider ################################################
//######################################################################################################################
	/**
	 * @class
	 * @augments game.ObjectCollider
	 * @memberOf game
	 * @classdesc an implementation of the {@link game.ObjectCollider|ObjectCollider} using a <!--
	 * -->{@link utils.geometry2d.Shape} instance for collision detection.
	 */
	game.ShapedObjectCollider = class extends game.ObjectCollider {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Shape} shape
		 */
		constructor(shape) {
			super(shape.getRect());
			/**
			 * @name game.ShapedObjectCollider#shape}
			 * @type {utils.geometry2d.shapes}
			 */
			this.shape = shape.clone();
		}

		/**
		 * sets the position of the collider.
		 * @param {utils.geometry2d.Vec2} pos
		 * @returns {game.ShapedObjectCollider} <code>this</code>
		 */
		setPosition(pos) {
			this.shape.setCenter(pos); return super.setPosition(pos);
		}

		/**
		 * rotates the {@link game.ShapedObjectCollider#shape}.
		 * @param {number} radians
		 */
		rotate(radians) {
			this.shape.rotate(radians);
		}

		/**
		 * scales the {@link game.ShapedObjectCollider#shape}.
		 * @param {number} factor
		 */
		scale(factor) {
			this.shape.scale(factor);
		}

		/**
		 * returns the {@link game.ShapedObjectCollider#shape}.
		 * @returns {utils.geometry2d.Shape}
		 */
		getShape() {
			return this.shape;
		}

		/**
		 * sets the {@link game.ShapedObjectCollider#shape} to a copy of the argument.
		 * @param {utils.geometry2d.Shape} shape
		 */
		setShape(shape) {
			this.shape = shape.clone();
		}

		/**
		 * returns true if the two colliders are colliding.
		 * @param {game.ObjectCollider} collider
		 * @returns {boolean}
		 */
		collides(collider) {
			return collider.shape && collider.rect.overlap(this.rect) &&
				(this.collidesInside(collider) && collider.shape.contains(this.shape.center)) ||
				(collider.collidesInside(this) && this.shape.contains(collider.shape.center)) ||
				this.shape.intersect(collider.shape);
		}

		/**
		 * returns the {@link game.ObjectCollider#rect|rect} attribute of the collider after setting the <!--
		 * -->{@link game.ObjectCollider#rect|rect} to the return value of the <!--
		 * -->{@link game.ShapedObjectCollider#shape|shape}'s {@link utils.geometry2d.Shape#getRect|getRect} method.
		 * @returns {utils.geometry2d.Rect}
		 */
		getRect() {
			return this.rect.setRect(this.shape.getRect());
		}

		/**
		 * returns the radius of the collider, i.e the maximum distance from the center to any point of the collider.
		 * @returns {number}
		 */
		getRadius() {
			return this.shape.getRadius();
		}

		/**
		 * draws the rect and the shape on the canvas.
		 * @param {CanvasRenderingContext2D} context2d
		 */
		render(context2d) {
			super.render(context2d);
			this.shape.draw(context2d);
		}
	};

//######################################################################################################################
//################################################### ObjectRenderer ###################################################
//######################################################################################################################
	/**
	 * @class
	 * @memberOf game
	 * @abstract
	 * @classdesc the base class of object renderers. Renderers are used to handle collision detection of objects.
	 */
	game.ObjectRenderer = class {
		constructor() {
		}
		/**
		 * sets the position of the renderer.
		 * @param {utils.geometry2d.Vec2} pos
		 * @returns {game.ObjectRenderer} <code>this</code>
		 */
		setPosition(pos) {
			return this;
		}

		/**
		 * rotates the renderer by the specified angle in radians
		 * @param {number} radians
		 */
		rotate(radians) {
		}

		/**
		 * multiplies the dimensions of the renderer by the specified factor
		 * @param factor
		 */
		scale(factor) {
		}

		/**
		 * draw the renderer on the canvas at the specified position if set and not null
		 * @param {CanvasRenderingContext2D} context2d
		 * @param {utils.geometry2d.Vec2} position
		 */
		render(context2d, position = null) {
		}

		/**
		 * creates and returns a {@link utils.geometry2d.Rect|Rect} that fits the renderer.
		 * @returns {utils.geometry2d.Rect}
		 */
		getRect() {
			return null;
		}

		getRadius() {
			return 0;
		}
	};
//######################################################################################################################
//################################################ ShapedObjectRenderer ################################################
//######################################################################################################################
	/**
	 * @class
	 * @augments game.ObjectRenderer
	 * @memberOf game
	 * @classdesc an implementation of the {@link game.ObjectRenderer|ObjectRenderer} using a <!--
	 * -->{@link utils.geometry2d.Shape} instance and a color for drawings.
	 */
	game.ShapedObjectRenderer = class {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Shape}shape
		 * @param {string} color
		 */
		constructor(shape, color = '#FFF') {
			/**
			 * @name game.ShapedObjectRenderer#shape
			 * @type {utils.geometry2d.Shape}
			 */
			this.shape = shape.clone();
			/**
			 * @name game.ShapedObjectRenderer#color
			 * @type {string}
			 */
			this.color = color;
		}

		/**
		 * sets the renderer's shape center to the specified position
		 * @param {utils.geometry2d.Vec2} pos
		 * @returns {game.ShapedObjectRenderer} <code>this</code>
		 */
		setPosition(pos) {
			this.shape.setCenter(pos);
			return this;
		}

		/**
		 * rotates the shape of the renderer by the specified angle in radians.
		 * @param {number} radians
		 */
		rotate(radians) {
			this.shape.rotate(radians);
		}

		/**
		 * multiplies the dimensions of the shape by the specified factor.
		 * @param {number} factor
		 */
		scale(factor) {
			this.shape.scale(factor);
		}

		/**
		 * returns the {@link game.ShapedObjectRenderer#color|color} attribute of the renderer.
		 * @returns {string}
		 */
		getColor() {
			return this.color;
		}

		/**
		 * sets the {@link game.ShapedObjectRenderer#color|color} attribute of the renderer to the specified value.
		 * @param {string} color
		 */
		setColor(color) {
			this.color = color;
		}

		/**
		 * returns the {@link game.ShapedObjectRenderer#shape|shape} attribute of the renderer.
		 * @returns {utils.geometry2d.Shape}
		 */
		getShape() {
			return this.shape;
		}

		/**
		 * sets the {@link game.ShapedObjectRenderer#shape|shape} attribute of the renderer to a copy of the <!--
		 * -->specified shape.
		 * @param {utils.geometry2d.Shape} shape
		 */
		setShape(shape) {
			this.shape = shape.clone();
		}

		/**
		 * draws the shape on the canvas with the specified color.
		 * @param {CanvasRenderingContext2D} context2d
		 */
		render(context2d) {
			if (this.fill) context2d.fillStyle = this.color;
			if (this.stroke) context2d.strokeStyle = this.color;
			this.shape.draw(context2d, this.fill, this.stroke);
		}

		/**
		 * returns a {@link utils.geometry2d.Rect|Rect} instance fitting the <!--
		 * -->{@link game.ShapedObjectRenderer#shape|shape} attribute of the renderer.
		 * @returns {utils.geometry2d.Rect}
		 */
		getRect() {
			return this.shape.getRect();
		}

		/**
		 * returns the maximum distance of the center to a point of the renderer.
		 * @returns {number}
		 */
		getRadius() {
			return this.shape.getRadius();
		}
	};
	/**
	 * whether or not the renderer should fill the shape. as it is common to all instances of the class, <!--
	 * -->this attribute is generally defined in the prototype of the class, but you can do it anywhere you want <!--
	 * -->for your renderers.
	 * @name game.ShapedObjectRenderer#fill
	 * @type {boolean}
	 */
	game.ShapedObjectRenderer.prototype.fill = true;
	/**
	 * whether or not the renderer should stroke the shape. as it is common to all instances of the class, <!--
	 * -->this attribute is generally defined in the prototype of the class, but you can do it anywhere you want <!--
	 * -->for your renderers.
	 * @name game.ShapedObjectRenderer#stroke
	 * @type {boolean}
	 */
	game.ShapedObjectRenderer.prototype.stroke = false;

//######################################################################################################################
//################################################## objectProperties ##################################################
//######################################################################################################################
	/**
	 * contains mixins to create objects with useful properties such as {@link game.objectProperties.health|health}<!--
	 * -->, {@link game.objectProperties.energy|energy}, {@link game.objectProperties.tag|tag}, ...
	 * @namespace
	 * @memberOf game
	 * @property health
	 * @property energy
	 * @property tag
	 */
	game.objectProperties = {
		/**
		 * provides health methods and properties to create objects such as enemies, players, <!--
		 * -->destructible objects, ...
		 * adds the <code>health</code> attribute to the object, with a default value of 0 added <!--
		 * -->as a prototype property, and a <code>maxHealth</code> optional attribute <!--
		 * -->(not created by default, but used in method if it exists).
		 * also adds getters and setters for those two attributes, and two other methods : <!--
		 * --><code>{@link game.objectProperties.health.heal|heal}</code> and <!--
		 * --><code>{@link game.objectProperties.health.receiveDamages|receiveDamages}</code>
		 * @memberOf game.objectProperties
		 * @mixin
		 */
		health: {
			health: 0,
			/**
			 * sets the value of the <code>health</code> attribute of the object to the specified value, <!--
			 * -->without checking it
			 * @param {number} value
			 */
			setHealth : function( value ) {
				this.health = value;
			},
			/**
			 * sets the value of the <code>maxHealth</code> attribute, <!--
			 * -->the maximum health this object can have.
			 * @param {number} value
			 */
			setMaxHealth : function( value ) {
				this.maxHealth = value;
			},
			/**
			 * adds the parameter value to the <code>health</code> and makes sure the <code>maxHealth</code> <!--
			 * -->value is not exceeded.
			 * @param {number} value
			 */
			heal : function( value ) {
				if(this.maxHealth !== undefined && this.health+value > this.maxHealth) {
					value = this.maxHealth;
				}
				else value += this.health;
				this.setHealth(value);
			},
			/**
			 * removes the specified <code>damages</code> from the <code>health</code>, <!--
			 * -->and if the value goes below 0,sets it to 0 and kills the object.
			 * @param {game.GameManager} gameManager
			 * @param {number} damages
			 */
			receiveDamages : function( gameManager, damages ) {
				if(damages > this.health) {
					this.setHealth(0);
					this.kill(gameManager);
				}
				else this.setHealth(this.health-damages);
			},
			/**
			 * returns the value of the <code>health</code> attribute. default is 0.
			 * @returns {number}
			 */
			getHealth : function() {
				return this.health;
			},
			/**
			 * returns the value of the <code>maxHealth</code> attribute, or undefined if not set.
			 * @returns {number}
			 */
			getMaxHealth : function() {
				return this.maxHealth;
			}
		},
		/**
		 * provides energy methods and properties.
		 * adds the <code>energy</code> attribute to the object, with a default value of 0 added <!--
		 * -->as a prototype property, and a <code>maxEnergy</code> optional attribute <!--
		 * -->(not created by default, but used in method if it exists).
		 * also adds getters and setters for those two attributes, and two other methods : <!--
		 * --><code>{@link game.objectProperties.energy.recoverEnergy|recoverEnergy}</code> and <!--
		 * --><code>{@link game.objectProperties.energy.useEnergy|useEnergy}</code>
		 * @memberOf game.objectProperties
		 * @mixin
		 */
		energy: {
			energy : 0,
			/**
			 * sets the value of the <code>energy</code> attribute to the specified value.
			 * @param {number} value
			 */
			setEnergy : function( value ) {
				this.energy = value;
			},
			/**
			 * sets the value of the <code>maxEnergy</code> attribute to the specified value.
			 * @param {number} value
			 */
			setMaxEnergy : function( value ) {
				this.maxEnergy = value;
			},
			/**
			 * adds the specified amount of energy to the player, and make sure the total amount <!--
			 * -->does not exceed the maximum allowed
			 * @param {number} value
			 */
			recoverEnergy : function( value ) {
				if(this.maxEnergy !== undefined && this.energy+value > this.maxEnergy) {
					value = this.maxEnergy
				}
				else value += this.energy;
				this.setEnergy(value);
			},
			/**
			 * removes the specified value from the player's <code>energy</code> attribute if it has enough <!--
			 * -->and returns true if the amount has been taken from the object's <code>energy</code>
			 * @param {number} value
			 * @returns {boolean}
			 */
			useEnergy : function( value ) {
				if(value > this.energy) return false;
				else {
					this.energy -= value;
					return true;
				}
			},
			/**
			 * returns the value of the <code>energy</code> attribute. default is 0.
			 * @returns {number}
			 */
			getEnergy : function() {
				return this.energy;
			},
			/**
			 * returns the value of the <code>maxEnergy</code> attribute, or undefined if not set.
			 * @returns {number}
			 */
			getMaxEnergy : function() {
				return this.maxEnergy;
			}
		},
		/**
		 * provides tag methods and property.
		 * when needed, adds a <code>tags</code> attribute that will contain all future tags associated with the object.
		 * adds the following methods :
		 * - <code>{@link game.objectProperties.tag.addTag|addTag}</code> that adds the specified tag to the <!--
		 * -->current ones. creates the <code>tags</code> attribute if needed,
		 * - <code>{@link game.objectProperties.tag.hasTag|hasTag}</code> that checks if the object has <!--
		 * -->the specified tag,
		 * - <code>{@link game.objectProperties.tag#getTags|getTags}</code> that returns the <code>tags</code> <!--
		 * -->attribute,
		 * - <code>{@link game.objectProperties.tag#isTagged|isTagged}</code> that returns true if the object <!--
		 * -->has at least one tag,
		 * - <code>{@link game.objectProperties.tag#clearTags|clearTags}</code> that clears all tags of the object <!--
		 * -->by re-creating the <code>tags</code> attribute.
		 *
		 * You can also use some function such as <code>{@link game.objectProperties.tag_canHaveTag}</code> and <!--
		 * --><code>{@link game.objectProperties.tag_hasTag}</code>, that you can use as a filter for objects,  and <!--
		 * --><code>{@link game.objectProperties.tag_getAllObjectsWithTag}.
		 * @memberOf game.objectProperties
		 * @property {Array|undefined} tags
		 * @mixin
		 */
		tag: {
			/**
			 * adds the specified tag to the object. If the object had no tag, the attribute <code>tags</code> <!--
			 * -->is created.
			 * @param {*} tag
			 */
			addTag: function( tag ) {
				if(!this.tags) this.tags = [tag];
				else this.tags.push(tag);
			},
			/**
			 * returns true if the object has the specified tag.
			 * @param {*} tag
			 * @returns {boolean}
			 */
			hasTag: function( tag ) {
				return this.tags !== undefined && this.tags.indexOf(tag) != -1;
			},
			/**
			 * returns the <code>tags</code> attribute, containing all tags added to the objects
			 * @returns {Array<*>}
			 */
			getTags: function() {
				return this.tags;
			},
			/**
			 * returns true if the object has at least one tag.
			 * @returns {boolean}
			 */
			isTagged: function() {
				return this.tags != undefined && this.tags.length > 0;
			},
			/**
			 * removes all tags of from the object by setting the <code>tags> attribute to an empty array
			 */
			clearTags: function() {
				this.tags = [];
			}
		},
		/**
		 * returns true if the object implements the {@link game.objectProperties.tag|tag} mixin.
		 * Can be used as a filter.
		 * @param {game.Object} obj
		 * @returns {boolean}
		 */
		tag_canHaveTag: obj=>obj.hasTag !== undefined,
		/**
		 * returns true if the object implements the {@link game.objectProperties.tag|tag} mixin, <!--
		 * -->and has the specified tag. can be used as a filter to get all objects with a tag by binding the <!--
		 * -->first argument to the filtered tag
		 * @param {*} tag
		 * @param {game.Object} obj
		 * @returns {boolean}
		 */
		tag_hasTag: (tag, obj)=> obj.hasTag && obj.hasTag(tag),
		/**
		 * returns all objects in the game with the specified tag
		 * @param {game.GameManager} gameManager
		 * @param {*} tag
		 * @returns {game.Object[]}
		 */
		tag_getAllObjectsWithTag: (gameManager, tag=null)=> {
			if(tag) return gameManager.getObjects(game.objectProperties.tag.hasTag.bind(undefined, tag));
			else return gameManager.getObjects(game.objectProperties.canHaveTag);
		},
	};

//######################################################################################################################
//###################################################### particles #####################################################
//######################################################################################################################
	/**
	 * @class
	 * @memberOf game
	 * @augments game.Object
	 */
	game.Particle = class extends game.Object {
		/**
		 * @constructor
		 * @param {number} lifeTime
		 * @param {utils.geometry2d.Shape} shape
		 * @param {string} color
		 */
		constructor(lifeTime, shape, color) {
			if(!shape) {
				console.log(shape);
			}
			super(shape.center);
			this.shape = shape;
			this.color = color;
			this.lifeTime = lifeTime;
		}
		rotate( radians ) { this.shape.rotate(radians); }
		scale( factor ) { this.shape.scale(factor); }
		getPosition() { return this.shape.center; }
		moveXY(x, y) { this.shape.moveXY(x, y); return this; }

		getRect() { return this.shape.getRect(); }
		getRenderRect() { return this.shape.getRect(); }
		render(ctx) {
			(ctx.fillStyle != this.color) && (ctx.fillStyle = this.color);
			this.shape.draw(ctx, true);
		}
		onFrame( gameManager, dT ) {
			super.onFrame(gameManager, dT);
			if (this.isOutOfRect(gameManager.gameMap.visibleRect) || this.lifeTime <= 0) {
				this.lifeTime = 0; this.kill(gameManager);
			}
			else this.lifeTime -= dT;
		}
	};
	game.Particle.prototype.bodyLayer = -1;
	game.Particle.prototype.renderLayer = game.RenderLayer.PARTICLES;

	let particleColorSort = (a,b)=> a.color > b.color ? 1 : -1;
	/**
	 * @callback game.particleGenerator
	 * @param {number} lifeTime
	 * @param {utils.geometry2d.Vec2} initialPosition
	 * @param {number} angle
	 * @param {number} speed
	 * @returns {game.Particle}
	 */
	/**
	 * @class
	 * @memberOf game
	 * @augments game.Object
	 * @classdesc a type of object used to continuously generate particles
	 */
	game.ParticleEmitter = class extends game.Object {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Vec2} position
		 * @param {number} rate
		 * @param {number} max
		 */
		constructor( position, rate, max=0 ) {
			super(position);
			/**
			 * number of particles created in one second.
			 * @name game.ParticleEmitter#rate
			 * @type {number}
			 */
			this.rate = rate;
			/**
			 * number of particles emitted. equal to -1 if the emitter is paused, this value is equal to -1.
			 * When the emitter is restarted, this value is set to 0.
			 * @name game.ParticleEmitter#emited
			 * @type {number}
			 */
			this.emited = 0;
			/**
			 * maximum number of particles this emitter can create in its lifetime. When this number is reached, <!--
			 * -->the emitter stops creating particles and when no particles are living anymore, the emitter kills itself.
			 * If this value is equal to 0, the maximum is disabled : the emitter will continuously create particles <!--
			 * -->until the game is over.
			 * @name game.ParticleEmitter#max
			 * @type {number}
			 */
			this.max = max;
			/**
			 * a list of all living particles in the game. Used to perform actions such as <!--
			 * -->speed damping or size damping.
			 * @name game.ParticleEmitter#emitedParticles
			 * @type {game.Particle[]}
			 */
			this.emitedParticles = [];
		}
		/**
		 * restarts the particle emission by setting the <code>{@link game.ParticleEmitter#emited}</code> attribute to 0.
		 */
		restart() { this.emited = 0; }
		/**
		 * stops the particle emission by setting the <code>{@link game.ParticleEmitter#emited}</code> attribute to 0.
		 */
		stop() { this.emited = -1; }
		/**
		 * returns true if the emitter is creating particles every frame (i.e if it hasn't been stopped <!--
		 * -->and if the maximum hasn't been reached).
		 * @returns {boolean}
		 */
		isRunning() { return this.emited >= 0 && (max ==0 || this.emited < max); }
		/**
		 * sets the maximum and minimum emission angles to the specified values.
		 * @param {number} min
		 * @param {number} max
		 */
		setAngles( min, max=min ) {
			this.setMinAngle(min);
			this.setMaxAngle(max);
		}
		/**
		 * sets the minimum emission angle to the specified value.
		 * @param {number} min
		 */
		setMinAngle(min) { this.minAngle = min; }
		/**
		 * sets the maximum emission angle to the specified value.
		 * @param {number} max
		 */
		setMaxAngle(max) { this.maxAngle = max; }
		/**
		 * returns the minimum emission angle.
		 * @return {number}
		 */
		getMinAngle() { return this.minAngle; }
		/**
		 * returns the maximum emission angle.
		 * @return {number}
		 */
		getMaxAngle() { return this.maxAngle; }
		/**
		 * sets the distance from the emitter center the particles are created at.
		 * @param {number} emitDistance
		 */
		setEmitDistance( emitDistance ) { this.emitDistance = emitDistance; }
		/**
		 * returns the distance from the emitter center the particles are created at.
		 * @returns {number}
		 */
		getEmitDistance() { return this.emitDistance; }
		/**
		 * sets the number of particles created per second
		 * @param {number} rate
		 */
		setEmitRate( rate ) { this.rate = rate; }
		/**
		 * returns the number of particles created per second
		 * @returns {number}
		 */
		getEmitRate() { return this.rate; }
		/**
		 * sets the minimum and maximum lifetime of the particles created. <!--
		 * -->The actual lifetime of the particles will be a random value between the maximum and the minimum.
		 * @param {number} min
		 * @param {number} [max=min] if max &lt; min, then max = min.
		 */
		setParticlesLifeTime( min, max=min ) {
			this.setMinLifeTime(min);
			this.setMaxLifeTime(max<min ? min : max);
		}
		/**
		 * sets the minimum lifetime of the particles created.
		 * @param {number} mlt
		 */
		setParticlesMinLifeTime( mlt ) { this.minLifeTime = mlt; }
		/**
		 * sets the maximum lifetime of the particles created.
		 * @param {number} mlt. no check is performed to make sure the maximum is above or equal to the maximum.
		 */
		setParticlesMaxLifeTime( mlt ) { this.maxLifeTime = mlt; }
		/**
		 * returns the minimum lifetime of the particles created.
		 * @returns {number}
		 */
		getParticlesMinLifeTime() { return this.minLifeTime; }
		/**
		 * returns the maximum lifetime of the particles created.
		 * @returns {number}
		 */
		getParticlesMaxLifeTime() { return this.maxLifeTime; }
		/**
		 * sets the speed damping factor.
		 * @param {number} factor
		 */
		setSpeedDampFactor( factor ) { this.speedDampFactor = factor; }
		/**
		 * returns the speed damping factor.
		 * @returns {number}
		 */
		getSpeedDampFactor() { return this.speedDampFactor; }
		/**
		 * sets the size reduce factor
		 * @param {number} factor
		 */
		setSizeReduceFactor( factor ) { this.reduceSizeFactor = factor; }
		/**
		 * returns the size reduce factor
		 * @returns {number}
		 */
		getSizeReduceFactor() { return this.reduceSizeFactor ; }
		/**
		 * rotates the emitter, changing the min and max angles
		 * @param {number} radians
		 */
		rotate( radians ) {
			super.rotate(radians);
			this.minAngle += radians;
			this.maxAngle += radians;
		}
		/**
		 * returns the particleGenerator that generates all particles
		 * @returns {game.particleGenerator}
		 */
		getParticleGenerator() { return this.particleGenerator; }
		/**
		 * sets the particle generator of the particle emitter.
		 * @param {game.particleGenerator} generator
		 */
		setParticleGenerator( generator ) { this.particleGenerator = generator; }
		/**
		 * returns whether or not this objects can collide with other objects. Particles emitters do not collide.
		 * @param {game.Object} object
		 * @returns {boolean} false
		 */
		canCollide( object ) { return false; }
		/**
		 * create a particle using the particle generator.
		 * @param {number} lifeTime
		 * @param {utils.geometry2d.Vec2} position
		 * @param {number} angle
		 * @param {number} speed
		 * @returns {game.Particle}
		 */
		createParticle( lifeTime, position, angle, speed ) {
			let p = this.particleGenerator(lifeTime, position, angle, speed);
			if(p) {
				if(speed) {
					let unit = Vec2.createFromAngle(angle);
					this.emitDistance && p.move(unit.clone().mul(this.emitDistance));
					p.speed = unit.mul(speed);
				} else if(this.emitDistance) {
					p.move(Vec2.createFromAngle(angle, this.emitDistance));
				}
			} return p;
		}
		/**
		 * create the specified number of particles using random values for lifeTime, position, angle and speed
		 * @param {number} number
		 * @returns {game.Particle[]}
		 */
		createParticles( number ) {
			let lt/*lifeTime*/, spd/*speed*/, a/*angle*/, pos=this.getPosition(),
				res = new Array(number), p, i=0;
			while(i<number) {
				lt = this.maxLifeTime==this.minLifeTime ?
					this.minLifeTime :
					Math.random()*(this.maxLifeTime-this.minLifeTime)+this.minLifeTime;
				spd = this.maxSpeed==this.minSpeed ?
					this.minSpeed :
				    Math.random()*(this.maxSpeed-this.minSpeed)+this.minSpeed;
				a = this.maxAngle==this.minAngle ?
					this.minAngle :
					Math.random()*(this.maxAngle-this.minAngle)+this.minAngle;
				p = this.createParticle(lt, pos, a, spd);
				if(p) res[i++] = p;
				else { res.length--; number--; }
			}
			return res;
		}
		/**
		 * method called by the object itself when all particles are generated and dead.
		 * kills the emitter
		 * @param {game.GameManager} gameManager
		 */
		onFinished( gameManager ) {
			this.kill(gameManager);
		}
		/**
		 * called every frame by the game manager. creates the needed particles and add them to the game, <!--
		 * -->change their size and speed, ...
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		onFrame( gameManager, dT ) {
			super.onFrame(gameManager, dT);
			let len=this.emitedParticles.length,
				speedFactor = Math.max(0, 1-this.speedDampFactor*dT),
				sizeFactor = Math.max(0, 1-this.reduceSizeFactor*dT), p;
			if(len) {
				let i=len;
				while(i--) { p = this.emitedParticles[i];
					if(p.lifeTime <= 0) this.emitedParticles.splice(i, 1);
					//the particle is already dead
					else {
						(speedFactor !== 1) && p.speed &&
							p.speed.mul(speedFactor);
						(sizeFactor !== 1) &&
							p.scale(sizeFactor);
					}
				}
				if(this.particlePositionRelative && !this.getSpeed().isZero()) {
					let d = this.speed.clone().mul(dT);
					i=len;
					while(i--) this.emitedParticles[i].move(d);
				}
			} else this.max && (this.emited >= this.max) &&
				this.onFinished(gameManager);

			if(this.emited > -1 && (!this.max || this.emited < this.max)) {
				let next = this.emited + dT*this.rate;
				this.max && (next> this.max) &&
					(next = this.max);
				p = this.createParticles(Math.floor(next - Math.floor(this.emited)));
				this.emited = next;
				Array.prototype.push.apply(this.emitedParticles, p);
				// make drawing faster for big arrays of particles by avoiding unneeded color changes
				p.sort(particleColorSort);
				gameManager.addObjects(p, false);
			}
		}
		static standardGenerator( lifeTime, initialPosition, angle, speed ){
			let sv = 0.5+(speed-this.minSpeed)/(2*(this.maxSpeed-this.minSpeed)),
				rgb = utils.tools.HSVtoRGB(angle/Circle.PI2, sv, sv),
				shape = new utils.geometry2d.Point(initialPosition);
			if(!shape){
				console.log("error : shape is null");
			} else return new game.Particle(lifeTime, shape,
				utils.tools.RGBToHex(rgb.r, rgb.g, rgb.b));
		}
	};
	//default attributes :
	/** @name game.ParticleEmitter#minLifeTime
	 *  @type {number} */
	game.ParticleEmitter.prototype.minLifeTime = 0.75;
	/** @name game.ParticleEmitter#maxLifeTime
	 *  @type {number} */
	game.ParticleEmitter.prototype.maxLifeTime = 1.5;
	/** @name game.ParticleEmitter#minAngle
	 *  @type {number} */
	game.ParticleEmitter.prototype.minAngle = 0;
	/** @name game.ParticleEmitter#maxAngle
	 *  @type {number} */
	game.ParticleEmitter.prototype.maxAngle = Circle.PI2;
	/** @name game.ParticleEmitter#minSpeed
	 *  @type {number} */
	game.ParticleEmitter.prototype.minSpeed = 300;
	/** @name game.ParticleEmitter#maxSpeed
	 *  @type {number} */
	game.ParticleEmitter.prototype.maxSpeed = 400;
	/** @name game.ParticleEmitter#speedDampFactor
	 *  @type {number} */
	game.ParticleEmitter.prototype.speedDampFactor = 2.5;
	/** @name game.ParticleEmitter#reduceSizeFactor
	 *  @type {number} */
	game.ParticleEmitter.prototype.reduceSizeFactor = 1.2;
	/** @name game.ParticleEmitter#emitDistance
	 *  @type {number} */
	game.ParticleEmitter.prototype.emitDistance = 0;
	/** @name game.ParticleEmitter#particleGenerator
	 *  @type {game.particleGenerator} */
	game.ParticleEmitter.prototype.particleGenerator = game.ParticleEmitter.standardGenerator;
	// particlesEmitters are not rendered ...
	game.ParticleEmitter.prototype.renderLayer = game.RenderLayer.NONE;
	// ... and do not collide.
	game.ParticleEmitter.prototype.bodyLayer = -1;
	game.ParticleEmitter.prototype.collisionLayersLayers = [-1];

	/**
	 * @class
	 * @augments game.ParticleEmitter
	 * @memberOf game
	 * @classdesc a type of particle emitter that generates all of its particles in one frame to simulate an explosion
	 */
	game.ParticleExplosion = class extends game.ParticleEmitter {
		constructor( position, number ) {
			super(position, number*1000, number);
		}
	};
	game.ParticleExplosion.prototype.minLifeTime = 0.1;
	game.ParticleExplosion.prototype.maxLifeTime = 0.5;
	game.ParticleExplosion.prototype.minSpeed = 500;
	game.ParticleExplosion.prototype.maxSpeed = 1500;
	game.ParticleExplosion.prototype.speedDampFactor = 2;
	game.ParticleExplosion.prototype.reduceSizeFactor = 3;

//######################################################################################################################
//####################################################### bullets ######################################################
//######################################################################################################################
	/**
	 * @class
	 * @memberOf game
	 * @augments game.Object
	 * @classdesc a simple object defining a bullet, i.e an object that deals damages to the first object <!--
	 * -->it touches (if the object can receive damages), and die when it happens.
	 */
	game.Bullet = class extends game.Object {
		/**
		 * @constructor
		 * @param {game.Object} launcher
		 * @param {utils.geometry2d.Vec2} position
		 * @param {utils.geometry2d.Vec2} speed
		 * @param {number} damages
		 * @param {number} [lifeTime=0]
		 */
		constructor(launcher, position, speed, damages, lifeTime=0) {
			super(position, speed);
			/**
			 * @name game.Bullet#damages
			 * @type {number}
			 */
			this.damages = damages;
			if(lifeTime)
				/**
				 * @name game.Bullet#lifeTime
				 * @type {number}
				 */
				this.lifeTime = lifeTime;
			/**
			 * @name game.Bullet#launcher
			 * @type {game.Object}
			 */
			this.launcher = launcher;

		}
		/**
		 * sets the launcher of the bullet
		 * @param {game.Object} object
		 */
		setLauncher( object ) { this.launcher = object; }

		/**
		 * returns the launcher of the bullet
		 * @returns {game.Object}
		 */
		getLauncher() { return this.launcher; }
		/**
		 * sets the damages dealt by the bullet on the impact
		 * @param {number} value
		 */
		setDamages( value ) { this.damages = value; }
		/**
		 * returns the damages dealt by the bullet on the impact
		 * @returns {number}
		 */
		getDamages() { return this.damages; }
		/**
		 * called by the game manager every frame. moves the bullet.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		onFrame( gameManager, dT ) {
			super.onFrame(gameManager, dT);
			if(this.lifeTime !== undefined) {
				if(this.lifeTime <=0) this.kill();
				this.lifeTime -= dT;
			}
		}
		/**
		 * called once a frame. moves the bullet according to its speed. if the bullet goes out <!--
		 * -->of the game rectangle, is is destroyed.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		moveOnFrame( gameManager, dT ) {
			super.moveOnFrame(gameManager, dT);
			if(this.isOutOfMap(gameManager.getMap().getGameRect())) {
				this.kill(gameManager);
			}
		}
		/**
		 * tells if the bullet can collide withe the specified object. returns true if the object is not its launcher
		 * @param {game.Object} object
		 * @returns {boolean}
		 */
		canCollide( object ) { return object !== this.launcher; }

		/**
		 * called when the collision is confirmed between the bullet and the specified object
		 * @param {game.GameManager} gameManager
		 * @param {game.Object} object
		 */
		onCollision( gameManager, object ) {
			if(this.damages && object.receiveDamages) {
				object.receiveDamages(gameManager, this.damages);
				this.damages = 0;
			}
			this.kill(gamemanager);
		}
	};
	game.Bullet.defaultShape = utils.geometry2d.Polygon.Absolute(Vec2.createVec2Array([
		-10,2,   5,2,   7,1,   8,0,   7,1,   5,-2,   -10,-2
	]));
	game.Bullet.prototype.renderLayer = game.RenderLayer.OBJ3;
	/**
	 * @class
	 * @memberOf game
	 * @augments game.ShapedObjectCollider
	 * @classdesc the collider to use with bullets. the difference with a standard shaped collider is that <!--
	 * -->it can collide when it is inside an object but not touching the outline. it allows bullets to go faster <!--
	 * -->than normal objects even if they are small, because the collision will happen event if the the object moves <!--
	 * -->too fast to intersect with the outline of the opposite object's collider.
	 */
	game.BulletCollider = class extends game.ShapedObjectCollider {
		/**
		 * @constructor
		 * @param {utils.geometry2d.Shape} shape
		 */
		constructor(shape) {
			super(shape);
		}
		/**
		 * returns true because bullets collide when they are inside other objects.
		 * @param {game.ObjectCollider} collider
		 * @returns {boolean}
		 */
		collidesInside( collider ) { return true; }
	};
	let getSteeringForce = ( objPos,maxSpd,maxForce,currentSpd,targetPos )=>
		Vec2.translation(objPos, targetPos).setMagnitude(maxSpd)
	.remove(currentSpeed).clampMagnitude(0, maxForce);// maxSpeed=0, steerForce=0, getTarget=0

	/**
	 * @class
	 * @memberOf game
	 * @augments game.Bullet
	 * @classdesc a type of bullet that has a homing property : it searches for the best target to avoid <!--
	 * -->direction changes, and changes it's direction to touch it.
	 */
	game.HomingBullet = class extends game.Bullet {
		/**
		 * @constructor
		 * @param {game.Object} launcher
		 * @param {number} damages
		 * @param {utils.geometry2d.Vec2} position
		 * @param {utils.geometry2d.Vec2} speed
		 * @param {number} lifeTime
		 * @param {number} steerForce
		 * @param {number} maxAngle
		 */
		constructor(launcher, damages, position, speed, lifeTime, steerForce, maxAngle) {
			super(launcher, position, speed, damages, lifeTime);
			/**
			 * @name game.HomingBullet#steerForce
			 * @type {number}
			 */
			this.steerForce = steerForce;
			/**
			 * @name game.HomingBullet#maxSpeed
			 * @type {number}
			 */
			this.maxSpeed = speed.magnitude;
			/**
			 * @name game.HomingBullet#maxAngle
			 * @type {number}
			 */
			this.maxAngle = maxAngle;
			this.angle = 0;
			this.setAccelerationXY(0,0);
		}
		/**
		 * return the maximum speed the bullet can reach depending on the distance to the target.
		 * @param {number} distance
		 * @returns {number}
		 */
		getMaxSpeed( distance ) {
			return this.maxSpeed*(1-Math.sqrt(this.maxSpeed/(150*distance)));
		}
		/**
		 * a method for private use only. returns the appropriate steer force the bullet have to use <!--
		 * -->to aim to its target, depending on its maximum speed and the distance to its target.
		 * @param {number} maxSpeed - result  of the {@link game.HomingBullet#getMaxSpeed|getMaxSpeed} method.
		 * @param {number} distance
		 * @returns {number}
		 */
		getSteerForce( maxSpeed, distance) {
			return this.steerForce*(maxSpeed/Math.pow(distance, 1.2));
		}
		/**
		 * method for private use only. returns the target position to aim to, or null if no target was found.
		 * @param {game.GameManager} gameManager
		 * @returns {?utils.geometry2d.Vec2}
		 */
		getTargetPosition( gameManager ) {
			let res, angle,
				maxAngle = this.maxAngle,
				pos = this.getPosition(),
				dist = 0,
				targets = gameManager.getObjects(game.Object.collisionLayersFilter.bind(undefined, this.bodyLayer)),
				i = targets.length;
			while(i--) {
				if(targets[i] !== this.launcher) {
					angle = (Vec2.translation(pos, targets[i].getPosition()).angle-this.radians) % (Math.PI*2);
					if(angle > Math.PI) angle = Circle.PI2-angle;
					if(angle < maxAngle) {
						maxAngle = angle;
						res = targets[i];
			}   }   }
			return res? res.getPosition() : null;
		}

		/**
		 * called every frame by the game manager. does the usual frame work, calculate the target position, <!--
		 * -->and set the acceleration to hit it. makes sure the speed do not exceed the maximum.
		 * @param {game.GameManager} gameManager
		 * @param {number} dT
		 */
		onFrame( gameManager, dT ) {
			let t = this.getTargetPosition(gameManager);
			if(t) {
				let p = this.getPosition(), accel = Vec2.translation(p, t),
					d = accel.magnitude, ms = this.getMaxSpeed(dist), steer = this.getSteerForce(ms, d);
				accel.magnitude = steer;
				accel.add(Game.objects.properties.Homing.getSteeringForce(
					pos, maxSpeed, steer,
					this.getSpeed(), target)).magnitude = steer;
				this.setAcceleration(accel);
				super.onFrame(gameManager, dT);
				this.setSpeed(this.getSpeed().clampMagnitude(0, maxSpeed));
			} else {
				this.setAccelerationXY(0,0);
				super.onFrame(gameManager, dT);
			}
			this.setRadians(this.getSpeed().angle);
		}
	}
}
