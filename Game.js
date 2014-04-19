/**
 * 
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

	//game.load.image('banana', 'seductive.jpg');
	
	//Load the tilemap file
    game.load.tilemap('myGame', 'test_map.json', null, Phaser.Tilemap.TILED_JSON);
    var img = new Image();
    img.onload = function() {
        canvas.drawImage(img, 0, 0);
        originalImageData = canvas.getImageData(0,0,width, height)); //chrome will not fail
    }
    img.crossOrigin = 'http://profile.ak.fbcdn.net/crossdomain.xml';//crossdomain xml file, this is facebook example
    img.src = 'assets/tilesets/tile_04.png';
	//Load the spritesheet for the tilemap
    game.load.image('tiles1', img.onload().Location);
    
}

function create() {

	map = game.add.tilemap('myGame');
	
	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
    map.addTilesetImage('main', 'tiles1');
    
	//'Grass 1' is the name of a layer inside of Tiled Map Editor
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();
    
	//banana = game.add.sprite(100, 100, 'banana'); 
	
}

function update() {

}
