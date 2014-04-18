/**
 * 
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('banana', 'seductive.jpg');

}

function create() {

	banana = game.add.sprite(100, 100, 'banana'); 
	
}

function update() {

}
