/**
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet.png', 'assets/player/marco_sheet.xml');
	
	//game.load.image('ground', 'assets/seductive.jpg');
	
    //game.load.image('stand', 'assets/player/standing.png');
    //game.load.spritesheet('player', 'assets/player/marco_sheet.png', 47, 40);
	
	//Load the tilemap file
    game.load.tilemap('map', 'level_1.json', null, Phaser.Tilemap.TILED_JSON);
	//Load the spritesheet for the tilemap
    game.load.image('tile_04', 'assets/tilesets/tile_04.png');
    game.load.image('stars', 'assets/tilesets/stars.png');
    game.load.image('up_cave', 'assets/tilesets/up_cave.png');
    game.load.image('down_cave', 'assets/tilesets/down_cave.png');
    game.load.image('tile_07', 'assets/tilesets/tile_07.png')
    
}

var sprite;
var player;
var jumping;
var velocity;

var platforms;
var upKey;
var downKey;
var fireKey;

function create() {
	
    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.P2JS);
 

	jumping = false;
    game.stage.backgroundColor = '#736357';

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

	map = game.add.tilemap('map');
	
	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
    map.addTilesetImage('tile_04');
    map.addTilesetImage('stars');
    map.addTilesetImage('up_cave');
    map.addTilesetImage('down_cave');
    map.addTilesetImage('tile_07');
    
	//'Platform Layer' is the name of a layer inside of Tiled Map Editor
    bg_layer = map.createLayer('BG Layer');
    ouch_layer = map.createLayer('Ouch Layer');
    layer = map.createLayer('Platform Layer');
    deco_layer = map.createLayer('Deco Layer');
    
    layer.resizeWorld();

    
    map.setCollisionBetween(70, 97, true, 'Platform Layer');



    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
 
    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, layer);
 
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(3, 3);
 
    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;
    
    player = game.add.sprite(100, 700, 'player');
    player.animations.add('run left', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('run right', [6, 7, 8, 9, 10, 11], 10, true);
    player.animations.add('idle', [12, 13, 14, 15, 16, 17], true);
    
    player.animations.play('idle', 10);

    game.physics.arcade.enable(player);
    
    //  Player physics properties. 
    player.body.bounce.y = 0.0;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
	
    game.camera.follow(player);
}

function update() {

//  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, layer);
	if (jumpKey.isDown)
    {
    	jumping = true;
        player.body.velocity.y = -250;
    }
	if (player.body.touching.down){
    	jumping = false;
    }else{
    	player.body.velocity.x = velocity;
    }
	if (leftKey.isDown)
    {
		player.x -= 2;
    	player.animations.play('run left', 10);
        velocity = player.body.velocity.x;
    }
    else if (rightKey.isDown)
    {
    	player.x += 2;
    	player.animations.play('run right', 10);
    	velocity = player.body.velocity.x;
    }
    else {
    	player.animations.play('idle', 10, true);
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
    }

	if (fireKey.isDown){
		//play shooting animation.
	}

}
