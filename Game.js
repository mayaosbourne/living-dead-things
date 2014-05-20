/**
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet4.png', 'assets/player/marco_sheet4.xml');
	//game.load.atlasXML ('monster', 'assets/monsters/mj_standing.png', 'assets/monsters/mj_monster.xml');
	game.load.atlasXML ('monsters', 'assets/monsters/mj_dance.png', 'assets/monsters/mj_monster.xml');
	game.load.image('bullet', 'assets/player/bullet.png');
	game.load.atlasXML('level1boss', 'assets/monsters/level1boss.png', 'assets/monsters/level1boss.xml');
	game.load.atlasXML('fireball', 'assets/monsters/fireball.png', 'assets/monsters/fireball.xml');
	//game.load.image('ground', 'assets/seductive.jpg');
	
    //game.load.image('stand', 'assets/player/standing.png');
    //game.load.spritesheet('player', 'assets/player/marco_sheet.png', 47, 40);
	
	game.load.image('item_box', 'assets/item_box2.png');
	game.load.image('grenade', 'assets/player/grenade.png');
	
	//Load the tilemap file
    game.load.tilemap('map', 'level_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_1', 'level_14.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_2', 'level_3.json', null, Phaser.Tilemap.TILED_JSON);
    
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
	game.load.image('hud', 'assets/hud2.png');
	game.load.image('lantern', 'assets/lantern6.png');
	game.load.image('lantern overlay', 'assets/lantern_overlay2.png');

	game.load.audio('music', 'assets/sound/bg_music.mp3');
	game.load.audio('single shot', 'assets/sound/single_shot.mp3');
	game.load.audio('explosion', 'assets/sound/explosion.mp3');

}

var GUN = 1;
var GRENADES = 2;
var points = 0;

var grenades;
var item;
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

var level1boss;
var fireball;
var fb_explosion;

var level = 1;

function create() {
	gun_shot = game.add.audio('single shot');
	explosion = game.add.audio('explosion');
	music = game.add.audio('music');
	music.play('', 0, 1, true);
    // Enable physics for the game
    game.physics.startSystem(Phaser.Physics.P2JS);
 
	jumping = false;
    game.stage.backgroundColor = '#736357';

    // Add input keys
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    fireKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    yesKey = game.input.keyboard.addKey(Phaser.Keyboard.Y);
    noKey = game.input.keyboard.addKey(Phaser.Keyboard.N);
    
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
        item = game.add.sprite(3071, 256, 'item_box');
        game.physics.enable(item);
    }else if (level === 2){
    	map.setCollisionBetween(0, 1197, true, 'Platform Layer');
        map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
        item = game.add.sprite(2880, 512, 'item_box');
        game.physics.enable(item);
    }
    
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
    
    initPlayer();

    game.physics.enable(player);
    
    //  Player physics properties.
    player.body.collideWorldBounds = true;
    player.body.bounce.y = 0;
    player.body.gravity.y = 500;
    player.health = 6;
    game.camera.follow(player);
    weapon = GUN;
    
    bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(100, 'bullet', 0, false);
	
	grenades = game.add.group();
	grenades.enableBody = true;
	grenades.physicsBodyType = Phaser.Physics.ARCADE;
	grenades.createMultiple(100, 'player', 0, false);


	fireballs = game.add.group();
	fireballs.enableBody = true;
	fireballs.physicsBodyType = Phaser.Physics.ARCADE;
	fireballs.createMultiple(100, 'fireball', 2, false);
	
	monsters = new Array(10);
	    
    if (level === 1) {
        level1boss = game.add.sprite(3950, 100, 'level1boss');
        level1boss.animations.add('move', [0, 1, 0, 1, 0, 1, 2, 3, 4], true);
        game.physics.enable(level1boss);

        //  Player physics properties.
        level1boss.body.collideWorldBounds = true;
        level1boss.body.bounce.y = 0;
        level1boss.body.gravity.y = 500;
        level1boss.health = 6;
        
        monsters[monster_index] = level1boss;
        monster_index++;
        
        monster1 = game.add.sprite(1000, 100, 'monsters');
        game.physics.enable(monster1);
        monster1.body.collideWorldBounds = true;
        monster1.body.gravity.y = 500;
        monster1.health = 2;
        monsters[monster_index] = monster1;
        monster_index++;
        
        monster2 = game.add.sprite(2000, 100, 'monsters');
        game.physics.enable(monster2);
        monster2.body.collideWorldBounds = true;
        monster2.body.gravity.y = 500;
        monster2.health = 2;
        monsters[monster_index] = monster2;
        monster_index++;
        
        
        
    }else if (level === 2){
    	monster_mj = game.add.sprite(3700, 720, 'monsters');
		monster_mj.animations.add('dance', [0, 1, 2, 3, 4, 5, 6, 7], true);
		monster_mj.health = 8;

	    game.physics.enable(monster_mj);
	    monster_mj.body.gravity.y = 500;
	    
	    monsters[monster_index] = monster_mj;
	    monster_index++;
    }
    
    
    
	

//    lantern = game.add.sprite(0, 0, 'lantern');
//    lantern.alpha = 0.86;
//    
//    lantern_overlay = game.add.sprite(0, 0, 'lantern overlay');
//    lantern_overlay.alpha = 0.8;
//    
//    game.add.tween(lantern_overlay).to( {alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0 , 1000, true);
	
    hud = game.add.sprite(0, 0, 'hud');
    //lantern_overlay.fixedToCamera = true;
    //lantern.fixedToCamera = true;
    hud.fixedToCamera = true;
    health1 = game.add.sprite(35, 0, 'player');
    health1.fixedToCamera = true;
    health1.animations.add('full', [25]);
    health1.animations.add('half', [26]);
    health1.animations.add('empty', [27]);
    health2 = game.add.sprite(85, 0, 'player');
    health2.fixedToCamera = true;
    health2.animations.add('full', [25]);
    health2.animations.add('half', [26]);
    health2.animations.add('empty', [27]);
    health3 = game.add.sprite(135, 0, 'player');
    health3.fixedToCamera = true;
    health3.animations.add('full', [25]);
    health3.animations.add('half', [26]);
    health3.animations.add('empty', [27]);
    
    var style = { font: "bold 12px Arial", fill: "#ff0044", align: "right"};
    var text = game.add.text(990,10, points + "XP\nLEVEL: " + level, style);

    text.anchor.set(1,0);
    text.fixedToCamera = true;
    

}

//Control global variables
var facing_right = true;

var running = false;
var firing = false;
var choice = false;
var fire_delay = 0;
var ouch_timer = 0;
var text_timeout = 0;
var t;

var fireball_delay = 0;


function update() {
	
	if (level === 1){
		handleLevel1Boss();
		if (!(player.health === 0)) {
	        level1boss.animations.play('move', 5);
	    }
	}else if (level === 2){
		monster_mj.body.velocity.x = 0;
		if (monster_mj.health === 0)
			monster_mj.kill();
    
        game.physics.arcade.collide(monster_mj, layer);
        monster_mj.animations.play('dance', 1); 
	}
	handleXP();
	handleHealth();

	grenades.forEachExists(checkGrenadeCollisions, this);

	
	if (text_timeout === 80){
		t.destroy();
	}
    else if (text_timeout != 0)
    	text_timeout++;
	if (ouch_timer === 60 || ouch_timer === 0){
		ouch_timer = 0;
	}
    else
    	ouch_timer++;
	
	handlePlayerMonsterCollision();
	
    game.physics.arcade.collide(player, layer);
    if (game.physics.arcade.collide(player, ouch_layer)){
    	if (ouch_timer === 0){
    		console.log(player.health);
    		player.health--;
    		ouch_timer++;
    	}	
    }
   
    if (game.physics.arcade.collide(item, player)){
    	weapon = GRENADES;
    	item.destroy();
    	var text = "Grenades acquired";
    	var style = { font: "65px Arial", fill: "#FFFFFF", align: "center" };
    	t = game.add.text(player.x - 100, player.y - 100, text, style);
    	text_timeout++;
    }

    handleMonsters();
    
    game.physics.arcade.collide(level1boss, layer);
    bullets.forEachExists(checkBulletCollisions, this);
  
    fireballs.forEachExists(checkFireballCollisions, this);
    handleInput();
    
    if (level1boss.health === 0) {
    	if (player.x >= 5088 && player.x <= 5120 && player.y === 630){
        	var text = "You Won!";
        	var style = { font: "65px Arial", fill: "#FFFFFF", align: "center" };
        	t = game.add.text(500, 250, text, style);
        	t.fixedToCamera = true;
        	t.destroy();
    		music.stop();
    		reset();
    		level++;
    		create();
    	}
    }
}

function handleXP() {
	//score.setText(points + " XP");
}

var monster_move = 0;
var right = true;

function handleMonsters(){
	
	if (monster_move % 80 === 0){
		if (right === true)
			right = false;
		else if (right === false)
			right = true;
	}
		
	if (right){
		var k = 0;
	    while (k < monster_index){
	    	monsters[k].body.velocity.x = -500;
	    	k++;
	    }
	}
    else {
    	var l = 0;
	    while (l < monster_index){
	    	monsters[l].body.velocity.x = 500;
	    	l++;
	    }
    }
	
	var i = 0;
    while (i < monster_index){
    	game.physics.arcade.collide(monsters[i], layer)
    	i++;
    }
    
    var j = 0;
    while (j < monster_index){
    	if (monsters[j].health === 0)
    		monsters[j].destroy();
    	j++;
    }
    monster_move++;
}

function handlePlayerMonsterCollision(){
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
}

function initPlayer() {
	
    player = game.add.sprite(3000, 100, 'player');
    //player = game.add.sprite(600, 600, 'player');
    player.animations.add('shooting', [0, 1, 2, 3], 5, true);
    player.animations.add('running', [4, 5, 6, 7, 8, 9], 10, true);
    player.animations.add('idle', [10, 11, 12, 13, 14, 15], 10, true);
    //grenade animations
    player.animations.add('jump grenade', [60, 61, 62, 63, 64, 65, 66, 67, 68, 69], 10, true);
    player.animations.add('idle grenade', [28, 29, 30, 31, 32, 33], 10, true);
    player.animations.add('run grenade', [47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59], 10, true);
    
    //new animations - to be tested
    player.animations.add('run shoot', [16, 17, 18, 19, 20, 21, 22, 23], 10, true);
    player.animations.add('bullet', [24], 10, true);
    player.animations.add('health', [25, 26, 27], 10, true);
    //player.animations.add('grenade', [34], 10, true);
    player.animations.add('jump shoot', [35, 36, 37, 38, 39, 40, 41, 42], 10, true);
    player.animations.add('jump', [43, 44, 45, 46], 10, true);
    
   
    player.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
    player.animations.add('radio', [92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113], 10, true);
    
}

function handleLevel1Boss(){
	
	if (level1boss.health === 0)
    	level1boss.destroy();
	if (level1boss.exists){
   	 if (fireball_delay === 90 || fireball_delay === 0)
   	        fireball_delay = 0;
   	    else
   	        fireball_delay++;

   	    if (fireball_delay === 0 && !(player.health === 0)) {
   	        createFireBall();
   	        fireball_delay++;
   	    }
   	    if (player.x < level1boss.x) {
   	        level1boss.scale.x = 1;
   	    } else
   	        level1boss.scale.x = -1;
   }
}

function handleHealth(){
	 if(player.health === 6){
		 health1.animations.play('full', 1);
		 health2.animations.play('full', 1);
		 health3.animations.play('full', 1);
	 }else if(player.health === 5){
		 health3.animations.play('half', 1);
	 }else if(player.health === 4){
		 health3.animations.play('empty', 1);
	 }else if(player.health === 3){
		 health2.animations.play('half', 1);
	 }else if(player.health === 2){
		 health2.animations.play('empty', 1);
	 }else if(player.health === 1){
		 health1.animations.play('half', 1);
	 }else if (player.health === 0 && !choice){
		 health1.animations.play('empty', 1);
		console.log("Player died");
		player.destroy();
		fire_delay = 100;
    	var death = "You Died!\n" +
    			"Restart? (Type Y or N)";
    	var style = { font: "65px Arial", fill: "#FF0000", align: "center" };
    	var t3 = game.add.text(player.x - 250, player.y - 100, death, style);
    	text_timeout = 0;
    	if (yesKey.isDown) {
    		t3.destroy();
    		music.stop();
    		reset();
    		create();
    	} else if (noKey.isDown) {
    		t3.destroy();
    		choice = true;
    	}
	 } else if (player.health === 0 && choice){
		 //So the Final message does not get overwritten
    	var style = { font: "70px Arial", fill: "#FFFFFF", align: "center", shadowColor: "#000000", shadowOffsetX: 4, shadowOffsetY: 4};
    	var thank = "Thank You For Playing!";
    	var t2 = game.add.text(500, 250, thank, style);
    	t2.anchor.set(.5, .5);
    	t2.fixedToCamera = true;
    	
	 }
}


function handleInput(){
	if (weapon === GUN){
		if (fire_delay === 20 || fire_delay === 0)
	    	fire_delay = 0;
	    else
	    	fire_delay++;
	}else if (weapon === GRENADES){
		if (fire_delay === 60 || fire_delay === 0)
	    	fire_delay = 0;
	    else
	    	fire_delay++;
	}
    
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
		} else {
			running = true;
	    	facing_right = true;
		}	
	}else 
		running = false;
	
	if (running && firing && !jumping){
		if (fire_delay === 0 && weapon === GUN){
    		gun_shot.play();
	    	createBullet();
	    	fire_delay++;
	    }else if (fire_delay === 0){
	    	createGrenade();
	    	fire_delay++;
	    }
		if(weapon === GUN){
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
		}else{
			if (facing_right){
				player.scale.x = 1;
				player.animations.play('run grenade', 10);
				player.anchor.setTo(0.2, 0);
				player.body.velocity.x = 250;
				velocity = player.body.velocity.x;
			}
			else {
				player.scale.x = -1;
				player.animations.play('run grenade', 10);
				player.anchor.setTo(0.2, 0);
				player.body.velocity.x = -250;
				velocity = player.body.velocity.x;
			}	
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
		if (fire_delay === 0 && weapon === GUN){
    		gun_shot.play();
	    	createBullet();
	    	fire_delay++;
	    }else if (fire_delay === 0){
	    	createGrenade();
	    	fire_delay++;
	    }
    	if (weapon === GUN){
    		if (facing_right) {
        		player.scale.x = 1;
        		player.animations.play('shooting', 15, false);
        	} else {
        		player.scale.x = -1;
        		player.animations.play('shooting', 15, false);
        	}
    	}else{
    		if (facing_right) {
        		player.scale.x = 1;
        		player.animations.play('jump grenade', 15, false);
        	} else {
        		player.scale.x = -1;
        		player.animations.play('jump grenade', 15, false);
        	}
    	}
	}
    else if (firing && !running) {
    	if (fire_delay === 0){
    		if(weapon === GUN){
    			gun_shot.play();
        		createBullet();
        		fire_delay++;
    		}else {
    			createGrenade();
        		fire_delay++;
    		}
    		
    	}
    	if (weapon === GUN){
    		if (facing_right){
        		player.scale.x = 1;
        		player.animations.play('shooting', 15, false);
        	} else {
        		player.scale.x = -1;
        		player.animations.play('shooting', 15, false);
        	}
    	}else{
    		if (facing_right){
        		player.scale.x = 1;
        		player.animations.play('idle grenade', 15, false);
        	} else {
        		player.scale.x = -1;
        		player.animations.play('idle grenade', 15, false);
        	}
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

function checkGrenadeCollisions(sprite){
	if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer)){
		sprite.animations.play('explosion', 20, false);
		sprite.body.velocity.x = 0;
		if (sprite.health === 0){
			explosion.volume = 2;
			explosion.play();
			justExploded = false;
			sprite.health++;
		}
	}else{
		var i = 0;
		while(i < monster_index){
			if (game.physics.arcade.collide(sprite, monsters[i]) && sprite.health === 0){
				sprite.animations.play('explosion', 20, false);
				sprite.body.velocity.x = 0;
				monsters[i].health = monsters[i].health - 2;
				monsters[i].body.velocity.x = 0;
				console.log(monsters[i].health);
				if (sprite.health === 0){
					explosion.volume = 2;
					explosion.play();
					justExploded = false;
					sprite.health++;
				}
			}
			i++;
		}
	}
}

function checkBulletCollisions(sprite) {
	if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer))
		sprite.kill();
	var i = 0;
	while(i < monster_index){
		if (game.physics.arcade.collide(sprite, monsters[i])){
			monsters[i].health--;
			monsters[i].body.velocity.x = 0;
			sprite.kill();
		}
		i++;
	}
}


function checkFireballCollisions(sprite) 
{
    if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer))
        sprite.kill();
    if (game.physics.arcade.collide(sprite, player)) {
        player.health--;
        player.body.velocity.x = 0;
        sprite.kill();
    }
}

function createGrenade(){
	
	if (facing_right){
		var grenade = grenades.getFirstExists(false);
		grenade.animations.add('grenade', [34], 10, true);
		var explode = grenade.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
		explode.killOnComplete = true;
		grenade.anchor.setTo(1,1);
		grenade.reset(player.x + 20, player.y);
		grenade.body.velocity.x = 300;
		grenade.body.velocity.y = -250;
		grenade.body.gravity.y = 500;
		grenade.animations.play('grenade', 10, true);
		grenade.scale.x = 1;
		grenade.scale.y = 1;
		grenade.health = 0;
	}else{
		var grenade = grenades.getFirstExists(false);
		grenade.animations.add('grenade', [34], 10, true);
		var explode = grenade.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
		explode.killOnComplete = true;
		grenade.anchor.setTo(1,1);
		grenade.reset(player.x - 10, player.y);
		grenade.body.velocity.x = -300;
		grenade.body.velocity.y = -250;
		grenade.body.gravity.y = 500;
		grenade.animations.play('grenade', 10, true);
		grenade.scale.x = -1;
		grenade.scale.y = 1;
		grenade.health = 0;
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

function createFireBall() {
    if (player.x < level1boss.x) {
        var fireball = fireballs.getFirstExists(false);
        fireball.reset(level1boss.x + 20, level1boss.y + 15);
        fireball.body.velocity.x = -300;
        fireball.scale.x = -1;
    } else {
        var fireball = fireballs.getFirstExists(false);
        fireball.reset(level1boss.x - 20, level1boss.y + 15);
        fireball.body.velocity.x = 300;
        fireball.scale.x = 1;
    }
}

function reset() {
	running = false;
	firing = false;
	choice = false;
	fire_dealy = 0;
	ouch_timer = 0;
	facing_right = true;
	weapon = 0;
	monster_index = 0;
	points = 0;
	fireball_delay = 0;
	fire_delay = 0;
	velocity = 0;

}
