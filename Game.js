/**
 * 
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

	game.load.image('banana', 'seductive.jpg');
	
	//Load the tilemap file
    game.load.tilemap('myGame', 'level_1.json', null, Phaser.Tilemap.TILED_JSON);
    
	//Load the spritesheet for the tilemap
    game.load.image('tiles1', 'assets/tilesets/down_cave.png');
    game.load.image('tiles2', 'assets/tilesets/right_cave.png');
    game.load.image('tiles3', 'assets/tilesets/up_cave.png');
    game.load.image('tiles4', 'assets/tilesets/stars.png');
    game.load.image('tiles5', 'assets/tilesets/tile_01.png');
    game.load.image('tiles6', 'assets/tilesets/tile_02.png');
    game.load.image('tiles7', 'assets/tilesets/tile_03.png');
    game.load.image('tiles8', 'assets/tilesets/tile_04.png');
    game.load.image('tiles10', 'assets/tilesets/tile_05.png');
    game.load.image('tiles11', 'assets/tilesets/tile_06.png');
    game.load.image('tiles12', 'assets/tilesets/tile_07.png');
    game.load.image('tiles13', 'assets/tilesets/tile_08.png');
    
}

function create() {

	map = game.add.tilemap('myGame');
	
	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
    map.addTilesetImage('main', 'tiles1');
    map.addTilesetImage('main1', 'tiles2');
    map.addTilesetImage('main2', 'tiles3');
    map.addTilesetImage('main3', 'tiles4');
    map.addTilesetImage('main4', 'tiles5');
    map.addTilesetImage('main5', 'tiles6');
    map.addTilesetImage('main6', 'tiles7');
    map.addTilesetImage('main7', 'tiles8');
    map.addTilesetImage('main8', 'tiles9');
    map.addTilesetImage('main9', 'tiles10');
    map.addTilesetImage('main10', 'tiles11');
    map.addTilesetImage('main11', 'tiles12');
    map.addTilesetImage('main12', 'tiles13');
    
	//'Grass 1' is the name of a layer inside of Tiled Map Editor
    layer = map.createLayer('Tile Layer 1');
    layer2 = map.createLayer('Tile Layer 2');
    layer3 = map.createLayer('Tile Layer 3');
    layer4 = map.createLayer('Object Layer 1');
    layer.resizeWorld();
    
	banana = game.add.sprite(100, 100, 'banana'); 
	
}

function update() {

}
