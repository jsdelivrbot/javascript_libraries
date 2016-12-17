/**
 * Created by Loic France on 11/11/2016.
 */
{
//######################################################################################################################
//######################################################## tools #######################################################
//######################################################################################################################

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - - InputManager - - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
/**
 * @callback utils.tools.InputManager.keyboardCallback
 * @param {utils.tools.InputManager.Key|number} keyCode
 * @param {utils.tools.InputManager.KeyState|number} keyState
 * @returns {void|boolean} prevent default behavior
 */
/**
 * @callback utils.tools.InputManager.mouseCallback
 * @param {utils.tools.InputManager.MouseEvent} event
 * @param {utils.tools.InputManager.MouseButton} button
 * @param {utils.geometry2d.Vec2} position
 * @returns {void|boolean} prevent default behavior.
 */
/**
 * @callback utils.tools.InputManager.focusCallback
 * @param {boolean} hasFocus
 */
/**
 * @classdesc a class managing keyboard and mouse events, related to a particular HTMLElement
 * @class
 * @memberOf utils.tools
 */
class InputManager{
	/**
	 * @constructor
	 * @param {HTMLElement}element
	 */
	constructor(element) {
		this.element = element;
		let keyState = new Uint8Array(256);
		for (let i = keyState.length-1; i >= 0; i--) {
			keyState[i] = InputManager.KeyState.UP;
		}
		let keyboardCallbacks = [];
//--------------------------------------------------- private methods --------------------------------------------------
		const onKeyUp = evt => {
			if (!keyState[evt.keyCode]) {
				keyState[evt.keyCode] = InputManager.KeyState.UP;
				let len = keyboardCallbacks.length;
				for (let i = 0; i < len; i++)
					if (keyboardCallbacks[i](evt.keyCode, InputManager.KeyState.UP)) evt.preventDefault();
			}
		};
		const onKeyDown = evt => {
			if (keyState[evt.keyCode]) {
				keyState[evt.keyCode] = InputManager.KeyState.DOWN;
				let len = keyboardCallbacks.length;
				for (let i = 0; i < len; i++)
					if (keyboardCallbacks[i](evt.keyCode, InputManager.KeyState.DOWN)) evt.preventDefault();
			}
		};
		const fixMouseWhich = evt => {
			if(!evt.which && evt.button) {
				evt.which =
					((evt.button % 8 - evt.button % 4)==4) ? InputManager.MouseButton.MOUSE_MIDDLE :
						((evt.button % 4 - evt.button % 2)==2) ? InputManager.MouseButton.MOUSE_RIGHT :
							((evt.button % 2				 )==1) ? InputManager.MouseButton.MOUSE_LEFT :
								InputManager.MouseButton.MOUSE_UNKNOWN;
			}
		};
		const getVec = function(evt){
			return new Vec2(evt.pageX - this.element.offsetLeft, evt.pageY - this.element.offsetTop); };
//--------------------------------------------------- public methods ---------------------------------------------------
// * * * * * * * * * * * * * * * * * * * * * * * * * keyboard methods * * * * * * * * * * * * * * * * * * * * * * * * *
		/**
		 * enable or disable the keyboard listener in capturing on bubbling mode, depending <!--
		 * -->on the 2nd parameter value
		 * @function
		 * @name utils.tools.InputManager#enableKeyboardListener
		 * @param {boolean} enable
		 * @param {boolean} [capturingMode=true]
		 */
		this.enableKeyboardListener = function(enable, capturingMode=true) {
			if(enable) {
				this.element.addEventListener('keydown', onKeyDown, capturingMode);
				this.element.addEventListener('keyup', onKeyUp, capturingMode);
			} else {
				this.element.removeEventListener('keydown', onKeyDown);
				this.element.removeEventListener('keyup', onKeyUp);
			}
		};
		/**
		 * adds a keyboard events callback. don't forget to launch the capture of keyboard events by calling <!--
		 * -->{@link utils.tools.InputManager#enableKeyboardListener} method
		 * @function
		 * @name utils.tools.InputManager#addKeyCallback
		 * @param {utils.tools.InputManager.keyboardCallback} callback
		 */
		this.addKeyCallback = (callback)=> {
			keyboardCallbacks.push(callback);
		};
		/**
		 * removes a keyboard events callback.
		 * @function
		 * @name utils.tools.InputManager#removeKeyCallback
		 * @param {utils.tools.InputManager.keyboardCallback} callback
		 */
		this.removeKeyCallback = (callback)=> {
			keyboardCallbacks.remove(callback);
		};
		/**
		 * returns the state of the key
		 * @function
		 * @name utils.tools.InputManager#getKeyState
		 * @param {number} keyCode
		 * @returns {utils.tools.InputManager.KeyState} key state : one of <!--
		 * -->{@link utils.tools.InputManager.KeyState.UP|UP} and <!--
		 * -->{@link utils.tools.InputManager.KeyState.DOWN|DOWN}
		 */
		this.getKeyState = keyCode=> keyState[keyCode];
		// * * * * * * * * * * * * * * * * * * * * * * * * * *mouse methods * * * * * * * * * * * * * * * * * * * * * * * * * *
		/**
		 * @function
		 * @name utils.tools.InputManager#setMouseEventsCallback
		 * @param {utils.tools.InputManager.mouseCallback}callback
		 */
		this.setMouseEventsCallback = function(callback) {
			if(callback) {
				this.element.onclick = evt => {
					fixMouseWhich(evt);
					return callback(InputManager.MouseEvent.MOUSE_CLICK, evt.which, getVec(evt));
				};
				this.element.onmousedown = evt => {
					fixMouseWhich(evt);
					return callback(InputManager.MouseEvent.MOUSE_DOWN, evt.which, getVec(evt));
				};
				this.element.onmouseup = evt => {
					fixMouseWhich(evt);
					return callback(InputManager.MouseEvent.MOUSE_UP, evt.which, getVec(evt));
				};
				this.element.ondblclick = evt => {
					fixMouseWhich(evt);
					return callback(InputManager.MouseEvent.MOUSE_DBCLICK, evt.which, getVec(evt));
				};
				this.element.onmousemove = function (evt) {
					fixMouseWhich(evt);
					callback(InputManager.MouseEvent.MOUSE_MOVE, evt.which, getVec(evt));
				};
				this.element.onmouseover = function (evt) {
					fixMouseWhich(evt);
					callback(InputManager.MouseEvent.MOUSE_ENTER, evt.which, getVec(evt));
				};
				this.element.onmouseout = function (evt) {
					fixMouseWhich(evt);
					callback(InputManager.MouseEvent.MOUSE_EXIT, evt.which, getVec(evt));
				};
			} else {
				this.element.onclick = null; this.element.onmousedown = null; this.element.onmouseup = null;
				this.element.ondblclick = null;
				this.element.onmousemove = null; this.element.onmouseover = null; this.element.onmouseout = null;
			}
		};
// * * * * * * * * * * * * * * * * * * * * * *focus, pointer lock, fullScreen * * * * * * * * * * * * * * * * * * * * *
		/**
		 * @function
		 * @name utils.tools.InputManager#setFocusCallback
		 * @param {utils.tools.InputManager.focusCallback} callback
		 */
		this.setFocusCallback = (callback)=> {
			if(callback) {
				this.element.onfocus = _ => callback(true);
				this.element.onblur = _ => callback(false);
			} else {
				this.element.onfocus = null;
				this.element.onblur = null;
			}
		};
		/**
		 * requests pointer lock
		 * @function
		 * @name utils.tools.InputManager#pointerLock
		 * @param eventListener
		 */
		this.pointerLock = (eventListener) => {
			if(eventListener) {
				if(eventListener.pointerLockChange) {
					document.addEventListener('pointerlockchange', eventListener.pointerLockChange, false);
					document.addEventListener('mozpointerlockchange', eventListener.pointerLockChange, false);
					document.addEventListener('webkitpointerlockchange', eventListener.pointerLockChange, false);
				}
				if(eventListener.pointerLockError) {
					document.addEventListener('pointerlockerror', eventListener.pointerLockError, false);
					document.addEventListener('mozpointerlockerror', eventListener.pointerLockError, false);
					document.addEventListener('webkitpointerlockerror', eventListener.pointerLockError, false);
				}
			}
			if(document.webkitFullscreenElement === this.element ||
				document.mozFullscreenElement === this.element ||
				document.fullscreenElement === this.element) {
				this.element.requestPointerLock = this.element.requestPointerLock ||
					this.element.mozRequestPointerLock ||
					this.element.webkitRequestPointerLock;
				this.element.requestPointerLock();
			}
		};
		/**
		 * requests full screen
		 * @function
		 * @name utils.tools.InputManager#fullScreen
		 * @param callback
		 */
		this.fullScreen = (callback)=> {
			element.requestFullscreen = element.requestFullscreen ||
				element.mozRequestFullscreen ||
				element.mozRequestFullScreen || // Le caractère 'S' majuscule de l'ancienne API.
				element.webkitRequestFullscreen;
			element.requestFullscreen();
			if (callback) {
				document.addEventListener('fullscreenchange', callback, false);
				document.addEventListener('mozfullscreenchange', callback, false);
				document.addEventListener('webkitfullscreenchange', callback, false);
			}
		};
	}
}
/**
 * @readonly
 * @enum {number}
 */
InputManager.Key = {
	'BACKSPACE': 8, 'TAB': 9, 'ENTER': 13, 'CAPS': 16,
	'CTRL': 17,  'ALT': 18,  'CAPS_LOCK': 20,  'ESCAPE': 27,  'SPACE': 32, 'PAGE_UP': 33,
	'PAGE_DOWN': 34, 'END': 35, 'BEGINNING': 36, 'LEFT': 37, 'UP': 38, 'RIGHT': 39,
	'DOWN': 40, 'PRINT_SCR': 44, 'INSERT': 45, 'DELETE': 46, 'ZERO': 48, 'ONE': 49,
	'TWO': 50, 'THREE': 51, 'FOUR': 52, 'FIVE': 53, 'SIX': 54, 'SEVEN': 55, 'EIGHT': 56,
	'NINE': 57, 'A': 65, 'B': 66, 'C': 67, 'D': 68, 'E': 69, 'F': 70, 'G': 71,
	'H': 72, 'I': 73, 'J': 74, 'K': 75, 'L': 76, 'M': 77, 'N': 78, 'O': 79,
	'P': 80, 'Q': 81, 'R': 82, 'S': 83, 'T': 84, 'U': 85, 'V': 86, 'W': 87,
	'X': 88, 'Y': 89, 'Z': 90, 'NUM_0': 96, 'NUM_1': 97, 'NUM_2': 98, 'NUM_3': 99,
	'NUM_4': 100, 'NUM_5': 101, 'NUM_6': 102, 'NUM_7': 103, 'NUM_8': 104, 'NUM_9': 105,
	'F1': 112, 'F2': 113, 'F3': 114, 'F4': 115, 'F5': 116, 'F6': 117, 'F7': 118,
	'F8': 119, 'F9': 120, 'F10': 121, 'F11': 122, 'F12': 123, 'NUM_LOCK': 144,
	'FN': 255,
};
/**
 * @memberOf utils.tools.InputManager
 * @readonly
 * @enum {number}
 */
InputManager.KeyState = {
	'UP': 0, 'DOWN': 1,
};
/**
 * @memberOf utils.tools.InputManager
 * @readonly
 * @enum {number}
 */
InputManager.MouseEvent = {
	'MOUSE_UP': 0, 'MOUSE_DOWN': 1, 'MOUSE_CLICK': 2, 'MOUSE_DBCLICK': 3,
	'MOUSE_EXIT': 4, 'MOUSE_ENTER': 5, 'MOUSE_MOVE': 6
};
/**
 * @memberOf utils.tools.InputManager
 * @readonly
 * @enum {number}
 */
InputManager.MouseButton = { 'MOUSE_UNKNOWN': 0, 'MOUSE_LEFT': 1, 'MOUSE_MIDDLE': 2, 'MOUSE_RIGHT': 3 };
//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - - - -KeyMap- - - - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
/**
 * @callback utils.tools.KeyMap.keyMapCallback
 * @param {*} action associated to the event's key
 * @param {utils.tools.InputManager.KeyState} keyState
 * @returns {void|boolean} prevent default key behavior
 */
/**
 * @memberOf utils.tools
 * @class
 * @classdesc a useful class to use with {@link utils.tools.InputManager|InputManager} class to make <!--
 * -->easy-to-use keymaps. call {@link utils.tools.KeyMap#apply|apply} method to use it, <!--
 * -->{@link utils.tools.KeyMap#setAction|setAction} to add mappings, and <!--
 * -->{@link utils.tools.KeyMap#setCallback|setCallback} to add a callback method called when event occur on <!--
 * -->selected keys.
 */
class KeyMap {
	/**
	 * @constructor
	 */
	constructor() {
		let actions = new Array(256);
		let cb = undefined;
//--------------------------------------------------- private methods --------------------------------------------------
		const callback = (keyCode, keyState)=> {
			if (callback) {
				let a = this.getAction(keyCode);
				return (a && callback(a, keyState)) || false;
			}
		};
//--------------------------------------------------- public methods ---------------------------------------------------
		/**
		 * @function
		 * @name utils.tools.KeyMap#setAction
		 * @param {utils.tools.InputManager.Key|utils.tools.InputManager.Key[]|number|number[]} keyCode
		 * @param {*} action
		 */
		this.setAction = (keyCode, action)=> {
			if(keyCode.length) {
				for(let i=0; i<keyCode.length; i++) {
					this.setAction(keyCode[i], action);
				}
			}
			else {
				if(action === null || action === undefined) {
					if(actions[keyCode] !== undefined) actions[keyCode] = undefined;
				} else actions[keyCode] = action;
			}
		};
		/**
		 * @function
		 * @name utils.tools.KeyMap#getAction
		 * @param {utils.tools.InputManager.Key|number} keyCode
		 * @returns {*} action associated to the key
		 */
		this.getAction = keyCode => {
			return actions[keyCode];
		};
		/**
		 * returns whether or not at least one key associated to the specified action is pressed
		 * @function
		 * @name utils.tools.KeyMap#isKeyDown
		 * @param {utils.tools.InputManager} inputManager
		 * @param {*} action
		 * @returns {boolean} true if at least one key associated to the specified action is pressed
		 */
		this.isKeyDown = (inputManager, action) => {
			let code=-1;
			do {
				code = actions.indexOf(action, code+1);
				if(code!= -1)
					if(inputManager.getKeyState(code) == utils.tools.InputManager.KeyState.DOWN) return true;
			} while(code!=-1);
			return false;
		};
		/**
		 * returns the set of keys associated with the specified action.
		 * @function
		 * @name utils.tools.KeyMap#getKeys
		 * @param {*} action
		 * @returns {utils.tools.InputManager.Key[]|number[]} key codes
		 */
		this.getKeys = action => {
			let codes = [], i = actions.indexOf(action);
			while(i != -1) { codes.push(i); i = actions.indexOf(action, i+1); }
			return codes;
		};
		/**
		 * sets the callback function which will be called when a useful keyboard event happen.
		 * @function
		 * @name utils.tools.KeyMap#setCallback
		 * @param callback
		 */
		this.setCallback = callback => { cb = callback; };
		/**
		 * allow the instance to catch keyboard events by adding a callback function using the parameter's <!--
		 * -->{@link utils.tools.InputManager#addKeyCallback|addKeyCallback} method.
		 * @function
		 * @name utils.tools.KeyMap#enable
		 * @param {utils.tools.InputManager} inputManager
		 */
		this.enable = function(inputManager) {
			inputManager.addKeyCallback(callback);
		};
		/**
		 * removes the callback function from the keyboard listener of the parameter.
		 * @function
		 * @name utils.tools.KeyMap#disable
		 * @param {utils.tools.InputManager} inputManager
		 */
		this.disable = function(inputManager) {
			inputManager.removeKeyCallback(callback);
		};
	}
}

//______________________________________________________________________________________________________________________
// - - - - - - - - - - - - - - - - - - - - - - - - - - - graphics - - - - - - - - - - - - - - - - - - - - - - - - - - -
//**********************************************************************************************************************
let G;
let LayoutGravity = G = {
	LEFT: 1, TOP: 2, RIGHT: 4, BOTTOM: 8, CENTER: 16,
	getRect: (gravity, availableRect, width, height, marginX=0, marginY=marginX)=> {
		availableRect = availableRect.clone().addMarginsXY(-marginX, -marginY);
		if (!(gravity & G.CENTER)) {
			if (gravity) {
				if (!(gravity & G.LEFT) && !(gravity & G.RIGHT)) gravity |= G.LEFT;
				if (!(gravity & G.TOP) && (gravity & G.BOTTOM)) gravity |= G.TOP;
			} else gravity = G.LEFT | G.TOP;
		}
		var left = NaN, top = NaN, right = NaN, bottom = NaN;
		if (gravity & G.CENTER) {
			let w = (availableRect.width - width)/2, h = (availableRect.h.height-height)/2;
			left = availableRect.left + w; right = availableRect.right - w;
			top = availableRect.top + h; bottom = availableRect.bottom - h;
		}
		if (gravity & G.LEFT !== 0) left = availableRect.left;
		if (gravity & G.TOP !== 0) top = availableRect.top;
		if (gravity & G.RIGHT !== 0) right = availableRect.right;
		if (gravity & G.BOTTOM !== 0) bottom = availableRect.bottom;
		if (isNaN(left)) left = right - width;
		else if (isNaN(right)) right = left + width;
		if (isNaN(top)) top = bottom - height;
		else if (isNaN(bottom)) bottom = top + height;
		return new Rect(left, top, right, bottom);
	},
	getHorizontalGravity: function (g, defaultG = null) {
		return (g & G.LEFT) ? G.LEFT : (g & G.RIGHT) ? G.RIGHT :
			(g & G.CENTER) ? G.CENTER :
				defaultG ? defaultG : G.LEFT;
	},
	getVerticalGravity: function (g, defaultG = null) {
		return (g & G.TOP) ? G.TOP : (g & G.BOTTOM) ? G.BOTTOM :
			(g & G.CENTER) ? G.CENTER :
				defaultG ? defaultG : G.TOP;
	}
}
//######################################################################################################################
//################################################ library concatenation ###############################################
//######################################################################################################################
/**
 * @typedef {Object} rgb
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */
/**
 * @typedef {Object} hsv
 * @property {number} h
 * @property {number} s
 * @property {number} v
 */
/**
 * contains utils library : geometry and tools
 * @namespace utils
 */
window.utils = {
//######################################################################################################################
//############################################## tools' additional methods #############################################
//######################################################################################################################
	/**
	 * @memberOf utils
	 * @namespace tools
	 */
	tools: {
		InputManager,
		KeyMap,
		/**
		 * creates a mix of a superclass and several mixins to make a class extend a class and implements mixins.
		 * @memberOf utils.tools
		 * @example
		 * class A {
		 * 	   constructor(x) {
		 * 	       this.x = x;
		 * 	   }
		 * 	   hello() {
		 * 	   	   alert('hello ' + this.x);
		 * 	   }
		 * };
		 * var B = {
		 * 	   mix: function(_class){
		 * 	       _class.prototype.hello = function() {
		 * 	       		alert('Hi ' + this.x + '!');
		 * 	       }
		 * 	   }
		 * };
		 * var C = {
		 * 	   mix: function(_class) {
		 * 	       let hello_super = utils.tools.override(_class, 'hello', function() {
		 * 	           hello_super.call(this);
		 * 	           alert('how are you ?);
		 * 	       });
		 * 	   }
		 * };
		 * class D extends utils.tools.mix(A, B, C) {
		 *     constructor(x) {
		 * 		   super(x);
		 *	   }
		 *	   hello() {
		 *	       super.hello();
		 *	       alert('It's been so long, ' + x);
		 *	   }
		 * }
		 *
		 * var d = new D('John');
		 * d.hello(); // alert('Hi John !'); alert('how are you ?'); alert('It\'s been so long, John');
		 * @param {class} superclass
		 * @param {{mix:function(class)}} mixins
		 * @returns {C}
		 */
		mix: (superclass, ...mixins) => {
			class C extends superclass {
			}
			let len = mixins.length, i = -1;
			while (++i < len) mixins[i].mix(C);
			return C;
		},
		/**
		 * puts all properties of src in out. if override is false or not set, if a property, <!--
		 * -->of src already exist in the parameter out, they are not overridden.
		 * @memberOf utils.tools
		 * @param {object} out
		 * @param {object} src
		 * @param {boolean} [override=false]
		 */
		merge: (out, src, override = false) => {
			for (let p in src) if (override || !out.hasOwnProperty(p)) out[p] = src[p];
		},
		/**
		 * adds all properties of the parameter to the window object. if a property of obj already exists, <!--
		 * -->an error message is printed in the console.
		 * @memberOf utils.tools
		 * @param {object} obj
		 */
		globalize: (obj) => {
			for (let p in obj) {
				if (window.hasOwnProperty(p)) console.error('the property ' + p + ' already exists in global space.');
				else window[p] = obj[p];
			}
		},
		/**
		 * a filter to use with Array.prototype.filter function, by binding the first argument <!--
		 * -->to the array elements you want to keep.
		 * @memberOf utils.tools
		 * @example [1,2,3,4].filter(utils.tools.intersectionFilter.bind(undefined, [1,4,5,6])); //[1,4]
		 * @param {Array} array
		 * @param {object} x
		 */
		intersectionFilter: (array, x) => array.indexOf(x) != -1,
		/**
		 * a filter to use with Array.prototype.filter function, by binding the first argument <!--
		 * -->to the array of element you want to exclude.
		 * @memberOf utils.tools
		 * @example [1,2,3,4].filter(utils.tools.exclusionFilter.bind(undefined, [1,4,5,6])); //[2,3]
		 * @param {Array} array
		 * @param {object} x
		 */
		exclusionFilter: (array, x) => array.indexOf(x) == -1,
		/**
		 * a filter to use with Array.prototype.filter function, by binding the first argument <!--
		 * -->to the class you want your objects to be instances of.
		 * @memberOf utils.tools
		 * @param {class} _class
		 * @param {object} x
		 */
		instanceFilter : (_class, x) => x instanceof _class,
		/**
		 * generates a random 24 bits color
		 * @memberOf utils.tools
		 * @param {number} number of bits this color will be on (32 or 24)
		 * @returns {string}
		 */
		randomColor: (bits=24) => '#'+Math.round(Math.random() * (1<<bits)).toString(16),
		/**
		 * overrides a function of a class by the specified function, and returns the old function.
		 * @memberOf utils.tools
		 * @param {class} _class
		 * @param {string} funcName
		 * @param {function} newFunc
		 * @returns {function}
		 */
		override: (_class, funcName, newFunc) => {
			let _super = _class.prototype[funcName];
			_class.prototype[funcName] = newFunc;
			return _super;
		},
		/**
		 * gets a string returned by a specified url by calling the callback function with the returned <!--
		 * -->text as argument.
		 * @memberOf utils.tools
		 * @param {string} url
		 * @param {function(string)} callback
		 */
		getStringFromUrl: (url, callback) => {
			let client = new XMLHttpRequest();
			client.open('GET', url);
			client.onreadystatechange = _ => callback(client.responseText);
			client.send();
		},
		/**
		 * convert hsv color to rgb
		 * @memberOf utils.tools
		 * @param {number} h - integer in [0;359]
		 * @param {number} s - integer in [0;255]
		 * @param {number} v - integer in [0;255]
		 * @returns {rgb}
		 */
		HSVtoRGB: (h, s, v)=> {
			let i = Math.floor(h * 6),
				f = h * 6 - i,
				p = Math.round((v * (1 - s))*255),
				q = Math.round((v * (1 - f * s))*255),
				t = Math.round((v * (1 - (1 - f) * s))*255);
			v = Math.round(v*255);
			switch (i % 6) {
				case 0: return {r: v, g: t, b: p};
				case 1: return {r: q, g: v, b: p};
				case 2: return {r: p, g: v, b: t};
				case 3: return {r: p, g: q, b: v};
				case 4: return {r: t, g: p, b: v};
				case 5: return {r: v, g: p, b: q};
				default : return {r: 0, g: 0, b: 0};
			}
		},
		/**
		 * convert rgb color to hsv
		 * @memberOf utils.tools
		 * @param {number} r - integer in [0;359]
		 * @param {number} g - integer in [0;255]
		 * @param {number} b - integer in [0;255]
		 * @returns {hsv}
		 */
		RBGtoHSV : (r, g, b)=> {
			let max = Math.max(r, g, b), min = Math.min(r, g, b),
				d = max - min,
				s = (max === 0 ? 0 : d / max),
				v = max / 255;

			switch (max) {
				case min: return {h: 0, s: s, v: v};
				case r: return { h: ((g - b) + d * (g < b ? 6: 0))/(6*d), s: s, v: v};
				case g: return { h: ((b - r) + d * 2)/(6*d), s: s, v: v};
				case b: return { h: ((r - g) + d * 4)/(6*d), s: s, v: v};
				default : return {h: 0, s: 0, s: 0};
			}
		},
		/**
		 * convert rgb color to hexadecimal string formated color
		 * @memberOf utils.tools
		 * @param {number} r
		 * @param {number} g
		 * @param {number} b
		 * @returns {string}
		 */
		RGBToHex : (r, g, b)=> (r>15?'#':'#0')+((r<<16)+(g<<8)+b).toString(16),

		LayoutGravity
	}
};

//######################################################################################################################
//######################################### additional methods to base objects #########################################
//######################################################################################################################

utils.tools.merge(console, {
	/**
	 * equivalent of <code>console.error(new Error(msg).stack);</code>
	 * @param {*} msg
	 */
	stack : (msg) => console.error(new Error(msg).stack),
	/**
	 * equivalent of <code>console.stack(\`deprecated : ${msg}\`)</code>
	 * @param {*} msg
	 */
	deprecated : (msg) => console.stack(`deprecated : ${msg}`),
	/**
	 * prints the 2d array in the console, where every cell in a line is separated by the separation <!--
	 * -->character and every line is separated by line breaks
	 * @param {Array.<Array.<*>>} mat
	 * @param {string} sepChar
	 */
	log2dMatrix : (mat, sepChar=',')=> {
		for(let i=0; i<mat.length; i++) {
			if(mat[i].join) console.log(mat[i].join(sepChar));
			else console.log(mat[i]);
		}
	}
});
utils.tools.merge(window,  {
	'TYPE_UNDEFINED' : 'undefined',
	'TYPE_OBJECT'    :  'object',
	'TYPE_BOOLEAN'   :  'boolean',
	'TYPE_NUMBER'    :  'number',
	'TYPE_STRING'    :  'string',
	'TYPE_FUNCTION'  :  'function',
});
utils.tools.merge(CanvasRenderingContext2D.prototype, {
	/**
	 * draws the text on the canvas with the specified gravity and add line breaks to make sure the text is clamped
	 * in the specified rectangle
	 * @param {string} text
	 * @param {utils.geometry2d.Rect} rect
	 * @param {number} lineHeight
	 * @param {number} textGravity
	 * @param {boolean} [fill=true]
	 * @param {boolean} [stroke=!fill]
	 */
	wrapText: function(text, rect, lineHeight, textGravity, fill=true, stroke=!fill) {
		let paragraphs = text.split('\n'),
			parLen = paragraphs.length,
			lines = [], line,
			linesX = [], lineX = 0,
			words, len,
			testLine,
			metrics,
			width = 0,
			rectWidth = rect.width,
			n, y;
		for (let i = 0; i < parLen; i++) {
			words = paragraphs[i].split(' ');
			len = words.length;
			if (!len) {
				lines.push(paragraphs[i]);
				linesX.push(0);
				continue;
			}
			line = words[0];
			for (n = 1; n < len; n++) {
				testLine = line + ' ' + words[n];
				metrics = this.measureText(testLine);
				width = metrics.width;
				if (width > rectWidth && n > 0) {
					lineX = rect.left;
					if (!(textGravity & Gravity.LEFT)) {
						if (textGravity & Gravity.RIGHT) lineX += this.measureText(line).width - width;
						else if (textGravity & Gravity.CENTER) lineX += (this.measureText(line).width - width) / 2;
					}
					lines.push(line);
					line = words[n];
					linesX.push(lineX);
				}
				else {
					line = testLine;
				}
			}
			lineX = rect.left;
			if (!(textGravity & Gravity.LEFT)) {
				metrics = this.measureText(line);
				width = metrics.width;
				if (textGravity & Gravity.RIGHT) lineX += rectWidth - width;
				else if (textGravity & Gravity.CENTER) lineX += (rectWidth - width) / 2;
			}
			lines.push(line);
			linesX.push(lineX);
		}
		len = lines.length;
		y = rect.top + lineHeight;
		if (!(textGravity & Gravity.TOP)) {
			if (textGravity & Gravity.BOTTOM) y = rect.bottom - lineHeight * (len - 1);
			else if (textGravity & Gravity.CENTER) y += (rect.height - lineHeight * len) / 2;
		}
		for (n = 0; n < len; n++) {
			if (fill)   this.fillText(lines[n], linesX[n], y);
			if (stroke) this.strokeText(lines[n], linesX[n], y);
			y += lineHeight;
		}
	}
});
}
