/**
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet3.png', 'assets/player/marco_sheet3.xml');
	game.load.atlasXML ('monsters', 'assets/monsters/mj_standing.png', 'assets/monsters/mj_monster.xml');
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
    game.load.image('tile_07', 'assets/tilesets/tile_07.png');
    
}

var sprite;
var player;
var jumping;
var velocity;
var monster_mj;
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
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

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
    layer.enableBody = true;

    map.setCollisionBetween(70, 97, true, 'Platform Layer');
    map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
 
    // Here we create the ground.
    //var ground = platforms.create(0, game.world.height - 64, 'Platform Layer');
 
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    //ground.scale.setTo(3, 3);
 
    //  This stops it from falling away when you jump on it
    //ground.body.immovable = true;
    
    player = game.add.sprite(100, 0, 'player');
    player.animations.add('run left', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('run right', [6, 7, 8, 9, 10, 11], 10, true);
    player.animations.add('idle right', [12, 13, 14, 15, 16, 17], 10, true);
    player.animations.add('shoot right', [18, 19, 20, 21], 5, true);
    player.animations.add('shoot left', [22, 23, 24, 25], 10, true);
    player.animations.add('idle left', [26, 27, 28, 29, 30, 31], 10, true);

    game.physics.enable(player);
    
    //  Player physics properties. 
    player.body.bounce.y = 0.0;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
	
    game.camera.follow(player);
    
    monster_mj = game.add.sprite(3575, 675, 'monsters');
    monster_mj.animations.add('idle', [0, 1], true);
    monster_mj.animations.play('idle', 5);
    game.physics.enable(monster_mj);
}

var facing_right = true;

function update() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, ouch_layer);
    game.physics.arcade.collide(monster_mj, layer);
    monster_mj.animations.play('idle', 5);
    //Fixed!! Please do not mess with these for now.
    //If you need them changed for testing, please
    //ask Tall Aaron for help. 
    
	if (jumpKey.isDown && jumping === false)
    {
    	jumping = true;
        player.body.velocity.y = -250;
        player.body.velocity.x = velocity;
    }
	if (player.body.onFloor()){
    	jumping = false;
    }else{
    	player.body.velocity.x = velocity;
    }
	if (leftKey.isDown && jumping === false)
    {
		facing_right = false;
		player.body.velocity.x = -250;
    	player.animations.play('run left', 10);
        velocity = player.body.velocity.x;
    }
    else if (rightKey.isDown && jumping === false)
    {
    	facing_right = true;
    	player.body.velocity.x = 250;
    	player.animations.play('run right', 10);
    	velocity = player.body.velocity.x;
    }
    else if (fireKey.isDown){
		
    	if (facing_right) {
    		player.animations.play('shoot right', 15);
    	} else {
    		player.animations.play('shoot left', 15);
    	}

	}
    else if (jumping === false) {
    	if (facing_right) {
    		player.animations.play('idle right', 10);
    	} else {
    		player.animations.play('idle left', 10);
    	}
    	
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
    }
	
	

}
