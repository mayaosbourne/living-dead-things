/**
 * 
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('banana', 'seductive.jpg');
	
	//Load the tilemap file
    game.load.tilemap('myGame', 'test_map.json', null, Phaser.Tilemap.TILED_JSON);
    
	//Load the spritesheet for the tilemap
    game.load.image('tiles1', 'assets/tilesets/tile_04.png');
    
}

function create() {

	map = game.add.tilemap('myGame');
	
	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
    map.addTilesetImage('main', 'tiles1');
    
	//'Grass 1' is the name of a layer inside of Tiled Map Editor
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    
	banana = game.add.sprite(100, 100, 'banana'); 
	
}

function update() {

}
