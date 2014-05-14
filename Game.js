/**
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet3.png', 'assets/player/marco_sheet3.xml');
	//game.load.atlasXML ('monsters', 'assets/monsters/mj_standing.png', 'assets/monsters/mj_monster.xml');
	game.load.atlasXML ('monsters', 'assets/monsters/mj_dance.png', 'assets/monsters/mj_monster.xml');
	game.load.image('bullet', 'assets/player/bullet.png');
	//game.load.image('ground', 'assets/seductive.jpg');
	
    //game.load.image('stand', 'assets/player/standing.png');
    //game.load.spritesheet('player', 'assets/player/marco_sheet.png', 47, 40);
	
	//Load the tilemap file
    game.load.tilemap('map', 'level_2.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_1', 'level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_2', 'level_2.json', null, Phaser.Tilemap.TILED_JSON);
	//Load the spritesheet for the tilemap
    game.load.image('up_cave', 'assets/tilesets/up_cave.png');
    game.load.image('down_cave', 'assets/tilesets/down_cave.png');
    game.load.image('stars', 'assets/tilesets/stars.png');
    game.load.image('cemetary', 'assets/tilesets/cemetary.png');
    game.load.image('tile_01', 'assets/tilesets/tile_01.png');
    game.load.image('tile_04', 'assets/tilesets/tile_04.png');
    game.load.image('tile_05', 'assets/tilesets/tile_05.png');
    game.load.image('tile_06', 'assets/tilesets/tile_06.png');
    game.load.image('tile_07', 'assets/tilesets/tile_07.png');
    game.load.image('tile_08', 'assets/tilesets/tile_08.png');
	game.load.image('hud', 'assets/hud.png');
    
}

var hud;
var player;
var bullet;
var fire;
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

	map = game.add.tilemap('map_1');
	map = game.add.tilemap('map_2');

	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
	
	map.addTilesetImage('stars');
	
	// Level 1 tile sets
	map.addTilesetImage('up_cave');
    map.addTilesetImage('down_cave');
    map.addTilesetImage('tile_04');
    map.addTilesetImage('tile_07');
	
	/*
	This is the level 2 tile set list
	map.addTilesetImage('cemetary');
    map.addTilesetImage('tile_01');
    map.addTilesetImage('tile_05');
    map.addTilesetImage('tile_06');
    map.addTilesetImage('tile_07');
    map.addTilesetImage('tile_08');
    /*/
    
	//'Platform Layer' is the name of a layer inside of Tiled Map Editor
    bg_layer = map.createLayer('BG Layer');
    ouch_layer = map.createLayer('Ouch Layer');
    layer = map.createLayer('Platform Layer');
    deco_layer = map.createLayer('Deco Layer');
    
    layer.resizeWorld();
    layer.enableBody = true;

    /*
     * Level two collision checks. 
     * 
     * map.setCollisionBetween(0, 1197, true, 'Platform Layer');
     * map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
     */
    map.setCollisionBetween(0, 1197, true, 'Platform Layer');
    map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    player = game.add.sprite(100, 650, 'player');
    player.animations.add('run left', [0, 1, 2, 3, 4, 5], 10, true);
    player.animations.add('running', [6, 7, 8, 9, 10, 11], 10, true);
    player.animations.add('idle', [12, 13, 14, 15, 16, 17], 10, true);
    player.animations.add('shooting', [18, 19, 20, 21], 5, true);
    player.animations.add('shoot left', [22, 23, 24, 25], 10, true);
    player.animations.add('idle left', [26, 27, 28, 29, 30, 31], 10, true);
    
    hud = game.add.sprite(0, 0, 'hud');
    
    game.load.image('mask', 'assets/lantern.png');
    
    game.physics.enable(player);
    
    hud.fixedToCamera = true;
    
    //  Player physics properties.
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0;
    player.body.gravity.y = 500;
    
    bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'bullet', 0, false);
	
    game.camera.follow(player);
    
    monster_mj = game.add.sprite(3575, 675, 'monsters');

	monster_mj.animations.add('dance', [0, 1, 2, 3, 4, 5, 6, 7], true);

    game.physics.enable(monster_mj);
}

var facing_right = true;
var fire_delay = 0;

function update() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(player, ouch_layer);
    game.physics.arcade.collide(bullets, layer);
    game.physics.arcade.collide(bullets, ouch_layer);
    game.physics.arcade.collide(monster_mj, layer);
    
    var animation = player.animations.getAnimation('shooting');
    
    if (fire_delay === 20 || fire_delay === 0)
    	fire_delay = 0;
    else
    	fire_delay++;
    
	monster_mj.animations.play('dance', 1); 
    
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
		player.scale.x = -1;
    	player.anchor.setTo(0.2, 0);
		player.body.velocity.x = -250;
    	player.animations.play('running', 10);
        velocity = player.body.velocity.x;
    }
    else if (rightKey.isDown && jumping === false)
    {
    	facing_right = true;
    	player.scale.x = 1;
    	player.anchor.setTo(0, 0);
    	player.body.velocity.x = 250;
    	player.animations.play('running', 10);
    	velocity = player.body.velocity.x;
    }
    else if (jumping === false && fire_delay === 0) {
    	if (facing_right) {
    		player.animations.play('idle', 10);
    	} else {
    		player.animations.play('idle', 10);
    	}
    	
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
    }
	if (fireKey.isDown) {
    	if (fire_delay === 0){
    		createBullet();
    		fire_delay++;
    	}
    	if (facing_right) {
    		player.animations.play('shooting', 15, false);
    	} else {
    		player.animations.play('shooting', 15, false);
    	}

	}
	
	function createBullet() {
	    if (facing_right === false){
	    	var bullet = bullets.getFirstExists(false);
    		bullet.reset(player.x - 20, player.y + 15);
    		bullet.body.velocity.x = -500;
    		bullet.scale.x = -1;
	   
        	bullet.body.bounce.x = 1.2;
    	}else {
    		var bullet = bullets.getFirstExists(false);
    		bullet.reset(player.x + 20, player.y + 15);
    		bullet.body.velocity.x = 500;
        	bullet.body.bounce.x = 1.2;
    	}
	}
	
	

}