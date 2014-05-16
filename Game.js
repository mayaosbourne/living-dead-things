/**
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet4.png', 'assets/player/marco_sheet4.xml');
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
var monsters;
var monster_index = 0;
var weapon = 0;
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
    // Enable physics for the game
    game.physics.startSystem(Phaser.Physics.P2JS);
 
	jumping = false;
    game.stage.backgroundColor = '#736357';

    // Add input keys
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

    
    var level = 2;
    
    if (level === 1){
    	map = game.add.tilemap('map_1');
    	map.addTilesetImage('stars');
    	map.addTilesetImage('up_cave');
    	map.addTilesetImage('down_cave');
    	map.addTilesetImage('tile_04');
        map.addTilesetImage('tile_07');
    }else if (level === 2){
    	map = game.add.tilemap('map_2');
    	map.addTilesetImage('stars');
    	map.addTilesetImage('cemetary');
        map.addTilesetImage('tile_04');
        map.addTilesetImage('tile_05');
        map.addTilesetImage('tile_06');
        map.addTilesetImage('tile_07');
        map.addTilesetImage('tile_08');
    }

	//'Platform Layer' is the name of a layer inside of Tiled Map Editor
    bg_layer = map.createLayer('BG Layer');
    ouch_layer = map.createLayer('Ouch Layer');
    layer = map.createLayer('Platform Layer');
    deco_layer = map.createLayer('Deco Layer');
    
    layer.resizeWorld();
    layer.enableBody = true;

    if (level === 1){
    	map.setCollisionBetween(0, 1197, true, 'Platform Layer');
        map.setCollisionBetween(1, 1098, true, 'Ouch Layer');
        map.setCollisionBetween(1101, 1665, true, 'Ouch Layer');
    }else if (level === 2){
    	map.setCollisionBetween(0, 1197, true, 'Platform Layer');
        map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
    }
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    //player = game.add.sprite(100, 650, 'player');
    player = game.add.sprite(3600, 650, 'player');
    player.animations.add('shooting', [0, 1, 2, 3], 5, true);
    player.animations.add('running', [4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('idle', [10, 11, 12, 13, 14, 15], 10, true);
    
    //new animations - to be tested
    player.animations.add('run shoot', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    
    hud = game.add.sprite(0, 0, 'hud');
    
    game.load.image('mask', 'assets/lantern.png');
    
    game.physics.enable(player);
    
    hud.fixedToCamera = true;
    
    //  Player physics properties.
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0;
    player.body.gravity.y = 500;
    player.health = 6;
    
    bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(100, 'bullet', 0, false);
	
    game.camera.follow(player);
    
    monster_mj = game.add.sprite(3590, 720, 'monsters');
    

	monster_mj.animations.add('dance', [0, 1, 2, 3, 4, 5, 6, 7], true);
	monster_mj.health = 8;

    game.physics.enable(monster_mj);
    monster_mj.body.gravity.y = 500;
    
    monsters = new Array(10);
    monsters[monster_index] = monster_mj;
    monster_index++;
    
}

var facing_right = true;
var fire_delay = 0;
var ouch_timer = 0;

function update() {
	monster_mj.body.velocity.x = 0;
	if (ouch_timer === 60 || ouch_timer === 0){
		ouch_timer = 0;
	}
    else
    	ouch_timer++;
	
    game.physics.arcade.collide(player, layer);
    if (game.physics.arcade.collide(player, ouch_layer)){
    	if (ouch_timer === 0){
    		console.log(player.health);
    		player.health--;
    		ouch_timer++;
    	}	
    }
    var i = 0;
    while (i < monster_index){
    	if (game.physics.arcade.collide(monsters[i], player)){
    		if (ouch_timer === 0){
        		console.log(player.health);
        		player.health--;
        		ouch_timer++;
        	}		
    	}
    	i++;
    }
    
    handleHealth();
    if (monster_mj.health === 0)
    	monster_mj.kill();
    game.physics.arcade.collide(monster_mj, layer);
    
    bullets.forEachExists(checkBulletCollisions, this);
    monster_mj.animations.play('dance', 1); 
    
    handleInput();
}

var running = false;
var firing = false;

function handleHealth(){
	 if(player.health === 6){
		 
	 }else if(player.health === 5){
		 
	 }else if(player.health === 4){
		 
	 }else if(player.health === 3){
		 
	 }else if(player.health === 2){
		 
	 }else if(player.health === 1){
		 
	 }else if (player.health === 0){
		console.log("Player died");
		player.destroy();
		fire_delay = 21;
	 } 
}

function handleInput(){
	if (fire_delay === 20 || fire_delay === 0)
    	fire_delay = 0;
    else
    	fire_delay++;
    
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
	
	if(fireKey.isDown)
		firing = true;
	else 
		firing = false; 
	if(leftKey.isDown || rightKey.isDown){
		if (leftKey.isDown){
			running = true;
			facing_right = false;
		}else{
			running = true;
	    	facing_right = true;
		}	
	}else 
		running = false;
	
	if (running && firing && !jumping){
		if (fire_delay === 0){
	    	createBullet();
	    	fire_delay++;
	    }
		if (facing_right){
			player.scale.x = 1;
			player.animations.play('run shoot', 10);
			player.anchor.setTo(0.2, 0);
			player.body.velocity.x = 250;
			velocity = player.body.velocity.x;
		}
		else {
			player.scale.x = -1;
			player.animations.play('run shoot', 10);
			player.anchor.setTo(0.2, 0);
			player.body.velocity.x = -250;
			velocity = player.body.velocity.x;
		}	
	}
	else if (running && !jumping && !firing)
    {
		firing = false;
		if (!facing_right){
			player.scale.x = -1;
	    	player.anchor.setTo(0.2, 0);
			player.body.velocity.x = -250;
	    	player.animations.play('running', 10);
	        velocity = player.body.velocity.x;
		}else{
	    	player.scale.x = 1;
	    	player.anchor.setTo(0, 0);
	    	player.body.velocity.x = 250;
	    	player.animations.play('running', 10);
	    	velocity = player.body.velocity.x;	
		}	
    }
	else if (firing && jumping) {
    	if (fire_delay === 0){
    		createBullet();
    		fire_delay++;
    	}
    	if (facing_right) {
    		player.scale.x = 1;
    		player.animations.play('shooting', 15, false);
    	} else {
    		player.scale.x = -1;
    		player.animations.play('shooting', 15, false);
    	}
	}
    else if (firing && !running) {
    	if (fire_delay === 0){
    		createBullet();
    		fire_delay++;
    	}
    	if (facing_right) {
    		player.scale.x = 1;
    		player.animations.play('shooting', 15, false);
    	} else {
    		player.scale.x = -1;
    		player.animations.play('shooting', 15, false);
    	}
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
	}
    else if (!jumping && fire_delay === 0 && !running) {
    	firing = false;
    	if (facing_right) {
    		player.animations.play('idle', 10);
    	} else {
    		player.animations.play('idle', 10);
    	}
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
    }
	
}

function checkBulletCollisions(sprite) {
	if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer))
		sprite.kill();
	if (game.physics.arcade.collide(sprite, monster_mj)){
		monster_mj.health--;
		sprite.kill();
	}
}

function createBullet() {
    if (facing_right === false){
    	var bullet = bullets.getFirstExists(false);
		bullet.reset(player.x - 20, player.y + 15);
		bullet.body.velocity.x = -700;
		bullet.scale.x = -1;
	}else {
		var bullet = bullets.getFirstExists(false);
		bullet.reset(player.x + 20, player.y + 15);
		bullet.body.velocity.x = 700;
		bullet.scale.x = 1;
	}
}


