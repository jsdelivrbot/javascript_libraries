window.onload = function() {
	'use strict';
//______________________________________________________________________________
// - - - - - - - - - - - - - - -Initialization part- - - - - - - - - - - - - - -
//******************************************************************************
	window.geometry2d = utils.geometry2d;
	window.tools = utils.tools;

	window.GM = new game.GameManager();
	let canvas = document.getElementById('game_canvas');
	canvas.style.cursor = 'crosshair';
	GM.gameMap = new game.GameMap(canvas, new geometry2d.Rect(0, 0, 1240, 720));
	GM.gameMap.useAutoResize(true);
	let obj = new game.ParticleEmitter(GM.gameMap.visibleRect.center, 1600);
	GM.addObject(obj);
	GM.start();
};
