/**q
 * 
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

function preload() {
	game.load.atlasXML('player', 'assets/player/marco_sheet4.png', 'assets/player/marco_sheet4.xml');
	//game.load.atlasXML ('monster', 'assets/monsters/mj_standing.png', 'assets/monsters/mj_monster.xml');
	game.load.atlasXML ('monsters', 'assets/monsters/zombieSprites.png', 'assets/monsters/zombieSprites.xml');
	game.load.image('bullet', 'assets/player/bullet.png');
	game.load.atlasXML('level1boss', 'assets/monsters/level1boss.png', 'assets/monsters/level1boss.xml');
	game.load.atlasXML('fireball', 'assets/monsters/fireball.png', 'assets/monsters/fireball.xml');
	game.load.atlasXML('level2boss', 'assets/monsters/level2boss.png', 'assets/monsters/level2boss.xml');
	game.load.atlasXML('level3boss', 'assets/monsters/level3bossNEW.png', 'assets/monsters/level3boss.xml');
	//game.load.image('ground', 'assets/seductive.jpg');
	
    //game.load.image('stand', 'assets/player/standing.png');
    //game.load.spritesheet('player', 'assets/player/marco_sheet.png', 47, 40);
	
	game.load.image('item_box', 'assets/item_box2.png');
	game.load.spritesheet('finish', 'assets/coin.png', 44, 40, 10);
	game.load.image('grenade', 'assets/player/grenade.png');
	
	//Load the tilemap file
    game.load.tilemap('map_1', 'level_1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_2', 'level_3.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('map_3', 'level_4.json', null, Phaser.Tilemap.TILED_JSON);
  
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
	game.load.image('lantern', 'assets/lantern6.png');
	game.load.image('lantern overlay', 'assets/lantern_overlay2.png');
	game.load.image('gunmod', 'assets/gun_mod.png');
	game.load.image('grenademod', 'assets/grenade_mod.png');

	game.load.audio('music', 'assets/sound/bg_music.mp3');
	game.load.audio('the_end', 'assets/sound/the_end.mp3');
	game.load.audio('single shot', 'assets/sound/single_shot.mp3');
	game.load.audio('explosion', 'assets/sound/explosion.mp3');
	game.load.audio('grunt', 'assets/sound/grunt.mp3');

	game.load.image('black_bg', 'assets/black_bg.png');
	game.load.image('the_end_text', 'assets/the_end_text.png');
}

var GUN = 1;
var GRENADES = 2;
var hasGrenades = false;
var points = 0;
var text;
var black_bg;
var the_end_text;

var grenades;
var gun_mod;
var grenade_mod;
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
var the_end_music;

var level1boss;
var level2boss;
var level3boss;
var fireball;
var fb_explosion;

var bossDestroyed = false;

var hasAcquiredFinishToken = false;

var level = 3;

function create() {
	gun_shot = game.add.audio('single shot');
	explosion = game.add.audio('explosion');
	the_end_music = game.add.audio('the_end');
	grunt = game.add.audio('grunt');
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
    weaponKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
    
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
    }else if (level === 3){
    	map = game.add.tilemap('map_3');
    	map.addTilesetImage('stars');
    	map.addTilesetImage('cemetary');
    	map.addTilesetImage('tile_04');
    }else if (level === 4){
    	//Don't know what tilesets are needed here.
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
        finish = game.add.sprite(5100, 665, 'finish');
        finish.animations.add('spin');
        finish.animations.play('spin', 30, true);
        game.physics.enable(finish);
    }else if (level === 2){
    	map.setCollisionBetween(0, 1197, true, 'Platform Layer');
        map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
        item = game.add.sprite(2880, 512, 'item_box');
        game.physics.enable(item);
        finish = game.add.sprite(4700, 780, 'finish');
        finish.animations.add('spin');
        finish.animations.play('spin', 30, true);
        game.physics.enable(finish);
    }else if (level === 3){
    	map.setCollisionBetween(0, 1197, true, 'Platform Layer');
        map.setCollisionBetween(1, 1100, true, 'Ouch Layer');
        item = game.add.sprite(2273, 615, 'item_box');
        game.physics.enable(item);
    }
    
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
	
	addMonstersToLevel(level);
	
    lantern = game.add.sprite(0, 0, 'lantern');
    lantern.alpha = 0.86;
    //lantern.alpha = 0.00;
    
    lantern_overlay = game.add.sprite(0, 0, 'lantern overlay');
    lantern_overlay.alpha = 0.8;
    //lantern_overlay.alpha = 0.0;

    
    game.add.tween(lantern_overlay).to( {alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0 , 1000, true);
	
    hud = game.add.sprite(0, 0, 'hud');
    gun_mod = game.add.sprite(450, 0, 'gunmod');
    gun_mod.fixedToCamera = true;
    lantern_overlay.fixedToCamera = true;
    lantern.fixedToCamera = true;
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
    text = game.add.text(990,10, points + "XP\nLEVEL: " + level, style);

    text.anchor.set(1,0);
    text.fixedToCamera = true;
    
    
}

//Control global variables
var facing_right = true;
var b2_ani = 'idle';
var running = false;
var firing = false;
var choice = false;
var fire_delay = 0;
var ouch_timer = 0;
var text_timeout = 0;
var t;
var t3;
var game_over_delay = 0;

var fireball_delay = 0;

function update() {	
    if (level === 1 && game.physics.arcade.distanceBetween(player, level1boss) < 500) {
        lantern_overlay.destroy();
        lantern.destroy();
    }else if (level === 2 && game.physics.arcade.distanceBetween(player, level2boss) < 500){
    	lantern_overlay.destroy();
        lantern.destroy();
    }else if (level === 3 && game.physics.arcade.distanceBetween(player, level3boss) < 500){
    	lantern_overlay.destroy();
        lantern.destroy();
    }
	if (level === 1){
		if (level1boss.y > 900){
			console.log("Fired");
			level1boss.x = 4706;
			level1boss.y = 800;
		}
		handleLevel1Boss();
		if (!(player.health === 0)) {
	        level1boss.animations.play('move', 5);
	    }
	}else if (level === 2){
		if (level2boss.y > 900){
			console.log("Fired");
			level2boss.x = 4706;
			level2boss.y = 800;
		}
		handleLevel2Boss();
		if (!(player.health === 0)) {
	        level2boss.animations.play(b2_ani);
		}
	}else if (level === 3){
		if (player.x > 3996 && player.y > 1470 && player.y < 3000)
			player.y = 1400;
		if (player.y > 3900)
			player.y = 3800;
		if (level3boss.y > 4000)
			level3boss.y = 3750;
		handleLevel3Boss();
	}

	handleHealth();
	game.physics.arcade.collide(level1boss, layer);
	game.physics.arcade.collide(level2boss, layer);
	game.physics.arcade.collide(level3boss, layer);
	
	grenades.forEachExists(checkGrenadeCollisions, this);
	
	if (text_timeout === 80){
		t.destroy();
		text_timeout = 0;
	}
    else if (text_timeout != 0)
    	text_timeout++;
	if (ouch_timer === 60 || ouch_timer === 0){
		ouch_timer = 0;
	}
    else
    	ouch_timer++;
	
    game.physics.arcade.collide(player, layer);
    if (game.physics.arcade.collide(player, ouch_layer)){
    	if (ouch_timer === 0){
    		grunt.play();
    		player.health--;
    		ouch_timer++;
    	}	
    }
   
    //hasGrenades = true;
    
    if (game.physics.arcade.collide(item, player)){
    	weapon = GRENADES;
    	hasGrenades = true;
    	handleXP(200);
    	item.destroy();
    	var text = "Grenades Acquired!";
    	var style1 = { font: "65px Arial", fill: "#FFFFFF", align: "center" };
    	t = game.add.text(player.x - 100, player.y - 100, text, style1);
    	gun_mod.destroy();
    	grenade_mod = game.add.sprite(450, 0, 'grenademod');
    	grenade_mod.fixedToCamera = true;
    	text_timeout++;
    }
    
    if(level === 1 || level === 2){
    	 if (game.physics.arcade.collide(finish, player)){
    	    	finish.destroy();
    	    	hasAcquiredFinishToken = true;
    	    	handleXP(player.health * 100);
    	    }
    }

    handleMonsters();
    handlePlayerMonsterCollision();
    bullets.forEachExists(checkBulletCollisions, this);
  
    fireballs.forEachExists(checkFireballCollisions, this);
    handleInput();
    
    if ((level === 1 && !level1boss.exists) || (level === 2 && !level2boss.exists)) {
        if (hasAcquiredFinishToken) {
            hasAcquiredFinishToken = false;
            var text4 = "You Won!";
            var style4 = { font: "65px Arial", fill: "#FFFFFF", align: "center" };
            t4 = game.add.text(500, 250, text4, style4);
            t4.fixedToCamera = true;
            t4.destroy();
            music.stop();
            reset();
            level++;
            create();

        }
    }
    else if (level === 3 && !level3boss.exists) {
        game_over_delay++;
        
        game.add.tween(black_bg).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, false);
    }
    if (game_over_delay === 200) {
        
        the_end_text = game.add.sprite(0, 0, 'the_end_text');
        the_end_text.fixedToCamera = true;
        player.destroy();
        
    }
}

function addMonstersToLevel(level){
	monsters = new Array(10);
    
    if (level === 1) {

        level1boss = game.add.sprite(3950, 750, 'level1boss');
        level1boss.animations.add('move', [0, 1, 0, 1, 0, 1, 2, 3, 4], true);
        game.physics.enable(level1boss);

        //  Player physics properties.
        level1boss.body.collideWorldBounds = true;
        level1boss.body.bounce.y = 0;
        level1boss.body.gravity.y = 500;
        level1boss.anchor.set(0.5, 0.5);
        level1boss.health = 6;
        /*level1boss = game.add.sprite(3950, 100, 'level1boss');
        level1boss.animations.add('move', [0, 1, 0, 1, 0, 1, 2, 3, 4], true);
        game.physics.enable(level1boss);

        //  Player physics properties.
        level1boss.body.collideWorldBounds = true;
        level1boss.body.bounce.y = 0;
        level1boss.body.gravity.y = 500;
        level1boss.anchor.set(0.5, 0.5);
        level1boss.health = 6;
        */
        monsters[monster_index] = level1boss;
        monster_index++;
        
        monster1 = game.add.sprite(1000, 100, 'monsters');
        monster1.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster1.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster1.animations.play('walk', 7, true);
        //monster1.animations.play('attack', 10, true);
        game.physics.enable(monster1);
        monster1.body.collideWorldBounds = true;
        monster1.body.gravity.y = 500;
        monster1.health = 2;
        monsters[monster_index] = monster1;
        monster_index++;
        
        monster2 = game.add.sprite(2000, 100, 'monsters');
        monster2.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster2.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster2.animations.play('walk', 7, true);
        //monster2.animations.play('attack', 10, true);
        game.physics.enable(monster2);
        monster2.body.collideWorldBounds = true;
        monster2.body.gravity.y = 500;
        monster2.health = 2;
        monsters[monster_index] = monster2;
        monster_index++;
        
        monster3 = game.add.sprite(1500, 600, 'monsters');
        monster3.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster3.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster3.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster3);
        monster3.body.collideWorldBounds = true;
        monster3.body.gravity.y = 500;
        monster3.health = 2;
        monsters[monster_index] = monster3;
        monster_index++;
  
    }else if (level === 2){
    	
    	level2boss = game.add.sprite(4706, 815, 'level2boss');
    	game.physics.enable(level2boss);
        level2boss.animations.add('idle', ['idle-1-00.png', 'idle-1-01.png', 'idle-1-02.png', 'idle-1-01.png'], 5, true);
        level2boss.animations.add('attack', ['attack-1-00.png', 'attack-1-01.png', 'attack-1-02.png', 'attack-1-03.png', 
                                            'attack-1-04.png', 'attack-1-05.png', 'attack-1-06.png', 'attack-1-07.png', 
                                            'attack-1-08.png'], 5, false);
        level2boss.animations.add('spin_attack', ['spin_attack-1-00.png', 'spin_attack-1-01.png'], 7, true);
        level2boss.animations.add('chanelling', ['channeling-1-00.png', 'channeling-1-01.png'], 5, true);
       

        //  Player physics properties.
        level2boss.body.collideWorldBounds = true;
        level2boss.body.bounce.y = 0;
        level2boss.body.gravity.y = 500;
        level2boss.anchor.set(0.5, 1);
        level2boss.health = 6;
        
        monsters[monster_index] = level2boss;
        monster_index++;
	    
	    monster1 = game.add.sprite(2500, 600, 'monsters');
        monster1.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster1.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster1.animations.play('walk', 7, true);
        //monster1.animations.play('attack', 10, true);
        game.physics.enable(monster1);
        monster1.body.collideWorldBounds = true;
        monster1.body.gravity.y = 500;
        monster1.health = 2;
        monsters[monster_index] = monster1;
        monster_index++;
        
        monster2 = game.add.sprite(2700, 450, 'monsters');
        monster2.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster2.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster2.animations.play('walk', 7, true);
        //monster2.animations.play('attack', 10, true);
        game.physics.enable(monster2);
        monster2.body.collideWorldBounds = true;
        monster2.body.gravity.y = 500;
        monster2.health = 2;
        monsters[monster_index] = monster2;
        monster_index++;
        
        monster3 = game.add.sprite(2500, 1000, 'monsters');
        monster3.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster3.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster3.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster3);
        monster3.body.collideWorldBounds = true;
        monster3.body.gravity.y = 500;
        monster3.health = 2;
        monsters[monster_index] = monster3;
        monster_index++;
        
        monster4 = game.add.sprite(2500, 1300, 'monsters');
        monster4.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster4.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster4.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster4);
        monster4.body.collideWorldBounds = true;
        monster4.body.gravity.y = 500;
        monster4.health = 2;
        monsters[monster_index] = monster4;
        monster_index++;
        
        monster5 = game.add.sprite(2500, 1900, 'monsters');
        monster5.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster5.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster5.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster5);
        monster5.body.collideWorldBounds = true;
        monster5.body.gravity.y = 500;
        monster5.health = 2;
        monsters[monster_index] = monster5;
        monster_index++;
        
    } else if (level === 3) {

        level3boss = game.add.sprite(3400, 3800, 'level3boss');
        level3boss.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], true);
        level3boss.animations.add('walking', [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], true);
        level3boss.animations.add('charging', [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35], true);
        level3boss.animations.add('dying', [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                                            81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], true);

        game.physics.enable(level3boss);
        
        level3boss.animations.play('walking', 10, true);
        level3boss.scale.x = -1;
        level3boss.body.collideWorldBounds = true;
        level3boss.body.bounce.y = 0;
        level3boss.body.gravity.y = 500;
        level3boss.anchor.set(0, 1);
        level3boss.health = 10;
        
        monsters[monster_index] = level3boss;
        monster_index++;

        
    	monster1 = game.add.sprite(2336, 832, 'monsters');
        monster1.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster1.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster1.animations.play('walk', 7, true);
        //monster1.animations.play('attack', 10, true);
        game.physics.enable(monster1);
        monster1.body.collideWorldBounds = true;
        monster1.body.gravity.y = 500;
        monster1.health = 2;
        monsters[monster_index] = monster1;
        monster_index++;
        
        monster2 = game.add.sprite(2624, 832, 'monsters');
        monster2.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster2.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster2.animations.play('walk', 7, true);
        //monster2.animations.play('attack', 10, true);
        game.physics.enable(monster2);
        monster2.body.collideWorldBounds = true;
        monster2.body.gravity.y = 500;
        monster2.health = 2;
        monsters[monster_index] = monster2;
        monster_index++;
        
        monster3 = game.add.sprite(3584, 1440, 'monsters');
        monster3.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster3.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster3.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster3);
        monster3.body.collideWorldBounds = true;
        monster3.body.gravity.y = 500;
        monster3.health = 2;
        monsters[monster_index] = monster3;
        monster_index++;
        
        monster4 = game.add.sprite(1440, 1344, 'monsters');
        monster4.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster4.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster4.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster4);
        monster4.body.collideWorldBounds = true;
        monster4.body.gravity.y = 500;
        monster4.health = 2;
        monsters[monster_index] = monster4;
        monster_index++;
        
        monster5 = game.add.sprite(1440, 1728, 'monsters');
        monster5.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster5.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster5.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster5);
        monster5.body.collideWorldBounds = true;
        monster5.body.gravity.y = 500;
        monster5.health = 2;
        monsters[monster_index] = monster5;
        monster_index++;
        
        monster6 = game.add.sprite(1440, 2112, 'monsters');
        monster6.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster6.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster6.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster6);
        monster6.body.collideWorldBounds = true;
        monster6.body.gravity.y = 500;
        monster6.health = 2;
        monsters[monster_index] = monster6;
        monster_index++;
        
        monster7 = game.add.sprite(2176, 2496, 'monsters');
        monster7.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster7.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster7.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster7);
        monster7.body.collideWorldBounds = true;
        monster7.body.gravity.y = 500;
        monster7.health = 2;
        monsters[monster_index] = monster7;
        monster_index++;
        
        monster8 = game.add.sprite(3296, 2080, 'monsters');
        monster8.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
        monster8.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
        monster8.animations.play('walk', 7, true);
        //monster3.animations.play('attack', 10, true);
        game.physics.enable(monster8);
        monster8.body.collideWorldBounds = true;
        monster8.body.gravity.y = 500;
        monster8.health = 2;
        monsters[monster_index] = monster8;
        monster_index++;
    }
}

function handleXP(score) {	
	points += score;
	
	text.destroy();
	var style = { font: "bold 12px Arial", fill: "#ff0044", align: "right"};
    text = game.add.text(990,10, points + "XP\nLEVEL: " + level, style);

    text.anchor.set(1,0);
    text.fixedToCamera = true;
	
}

var monster_move = 0;
var right = true;
var monsterIsKilled = false;
var explode_delay = 0;
var monsterExplode;
var monsterDeadIndex;

function handleMonsters(){
    if (monsterIsKilled === true) {
        explode_delay++;
    }
	if (monster_move % 500 === 0){
		if (right === true)
			right = false;
		else if (right === false)
			right = true;
	}
	
	if (level === 2 && player_met && (channeling || channeled)){
		var k = 0;
	    while (k < monster_index){
	    	if (player.x < monsters[k].x){
	    		if (monsters[k] === level2boss){
	    			
	    		}else{
	    			monsters[k].scale.x = 1;
		    		monsters[k].body.velocity.x = -50;
	    		}
			} else if (player.x >=monsters[k].x){
				if (monsters[k] === level2boss){
					
				}else{
					monsters[k].scale.x = -1;
					monsters[k].body.velocity.x = 50;
				}
			}
	    	k++;
	    }
	}else{
		if (right){
			var k = 0;
		    while (k < monster_index){
		    	if (monsters[k] === level1boss || monsters[k] === level2boss || monsters[k] === level3boss){

		    	}else{
		    		monsters[k].scale.x = 1;
			    	monsters[k].body.velocity.x = -50;
		    	}	
		    	k++;
		    }
		}
	    else {
	    	var l = 0;
		    while (l < monster_index){
		    	if (monsters[l] === level1boss || monsters[l] === level2boss || monsters[l] === level3boss){
		    		
		    	}else{
			    	monsters[l].scale.x = -1;
			    	monsters[l].body.velocity.x = 50;
		    	}
		    	l++;
		    }
	    }
	}
	
	var i = 0;
    while (i < monster_index){
    	game.physics.arcade.collide(monsters[i], layer);
    	i++;
    }
    
    var j = 0;
    while (j < monster_index){
        if (monsters[j].health === 0) {
        	if (monsters[j] === level1boss || monsters[j] === level2boss || monsters[j] === level3boss){

	    	}else{
	    		 monsterIsKilled = true;
	             var x = monsters[j].x;
	             var y = monsters[j].y;
	             monsters[j].health++;
	             monsters[j].destroy();
	             monsterExplode = game.add.sprite(x, y, 'monsters');
	             monsterExplode.animations.add('explode', [104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121,
	                                      122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144], true);
	
	             monsterExplode.anchor.set(0.43, 0.43);
	             monsterExplode.animations.play('explode', 15);
	    	}
         
        }
        if (explode_delay === 175) {
            monsterIsKilled = false;
            explode_delay = 0;
            monsterExplode.destroy();
        }
    	j++;
    }
    monster_move++;
}

function handlePlayerMonsterCollision(){
	 var i = 0;
	 var collided = false;
	    while (i < monster_index){
	    	if (game.physics.arcade.collide(monsters[i], player) || game.physics.arcade.overlap(level2boss, player)){
	    		if (ouch_timer === 0){
	    			grunt.play();
	    			collided = true;
	        		player.health--;
	        		ouch_timer++;
	        	}		
	    	}
	    	i++;
	    }
	 return collided;
}

function initPlayer() {
	
    if (level === 1) {
        player = game.add.sprite(600, 800, 'player');
    } else if (level === 2) {
        player = game.add.sprite(600, 2000, 'player');
    } else {
        player = game.add.sprite(600, 200, 'player');
    }
    //this is for level 3 boss testing
    player = game.add.sprite(3700, 3800, 'player');
    //player = game.add.sprite(3000, 200, 'player');
    //player = game.add.sprite(5100, 665, 'player');
    //player = game.add.sprite(4506, 750, 'player');
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

var once = true;
var boss_move;
var b1_health = 0;

function handleLevel1Boss(){
    if (level1boss.exists) {

    	if (b1_health <= 0){
			var health = level1boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
			b1_health = game.add.text(level1boss.x, level1boss.y - 100, health, style1);
		}else if (level1boss.health < 0){
			console.log("dead");
			b1_health.destroy();
		}
		else{
			b1_health.destroy();
			var health = level1boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
			b1_health = game.add.text(level1boss.x, level1boss.y - 100, health, style1);
		}
    	
        if (fireball_delay === 90 || fireball_delay === 0)
            fireball_delay = 0;
        else
            fireball_delay++;

        if (fireball_delay === 0 && !(player.health === 0) && (game.physics.arcade.distanceBetween(player, level1boss) < 500)) {
            createFireBall();
            fireball_delay++;

            if (player.x < level1boss.x) {
                level1boss.scale.x = 1;
                level1boss.body.velocity.x = -50;
                //right = false;
            } else {
                level1boss.scale.x = -1;
                level1boss.body.velocity.x = 50;
                //right == true;
            }
        }


        if (level1boss.health <= 0 ) {
            if (once) {
                handleXP(1000);
                once = false;
            }
            var x = level1boss.x;
            var y = level1boss.y;
            var explodeBoss = game.add.sprite(x, y, 'player');
            explodeBoss.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
            explodeBoss.anchor.set(0.43, 0.43);
            explodeBoss.animations.play('explosion', 20, false);
            explodeBoss.killOnComplete = true;
            explosion.volume = 2;
            explosion.play();
            level1boss.destroy();

        }

    }

    game.physics.arcade.collide(level1boss, layer);
}
var player_met = false;
var boss_right = false;
var channeling = false;
var channeled = false;
var ranged = false;
var attack = false;
var risen = 0;
var raise_timer = 0;
var b2_health = 0;

function handleLevel2Boss(){
	if (level2boss.exists){

		if (b2_health === 0){
			var health = level2boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
			b2_health = game.add.text(level2boss.x, level2boss.y - 100, health, style1);
		}else if (level2boss.health < 0){
			b2_health.destroy();
		}
		else{
			b2_health.destroy();
			var health = level2boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
			b2_health = game.add.text(level2boss.x, level2boss.y - 100, health, style1);
		}
		
		if ((game.physics.arcade.distanceBetween(player, level2boss) < 450) && !player_met && (player.y - level2boss.y < 10)){
			player_met = true;
		}
		if (player_met && !(player.health === 0)){
			if(!channeling && !ranged && !attack){
				b2_ani = 'idle';
				level2boss.animations.play('idle');
				
				if(player.x < level2boss.x){
					level2boss.scale.x = 1;
					level2boss.body.velocity.x = -50;
					boss_right = false;
				} else if (player.x >= level2boss.x){
					level2boss.scale.x = -1;
					level2boss.body.velocity.x = 50;
					boss_right = true;
				}

				if(game.physics.arcade.distanceBetween(player, level2boss) > 400){
					if(boss_right){
						level2boss.body.velocity.x = 500;
					} else {
						level2boss.body.velocity.x = -500;
					}
					ranged = true;
					attack = false;
					b2_ani = 'spin_attack';
					level2boss.animations.play('spin_attack');

				} else if(game.physics.arcade.distanceBetween(player, level2boss) < 90) {
					attack = true;
					if(boss_right) {
						level2boss.body.velocity.x = 5;	
					} else {
						level2boss.body.velocity.x = -5;
					}
					
					b2_ani = 'attack';
					level2boss.animations.play('attack');
					level2boss.events.onAnimationComplete.addOnce(function(){
						attack = false;
						b2_ani = 'idle';
						level2boss.animations.play('idle');
					});
				}
			}

			if((level2boss.health === 3 || level2boss.health === 2) && !channeled ){
				level2boss.body.velocity.x = 0;
				b2_ani = 'chanelling';
				level2boss.animations.play('chanelling');
				channeling = true;
				ranged = false;
				attack = false;
			}

			if (channeling){
				if((raise_timer === 0 || raise_timer === 30) && risen <= 5){
					var raise_x;
					if(boss_right){
						raise_x = level2boss.x + 100;
					} else {
						raise_x = level2boss.x - 100;
					}
					
					monster1 = game.add.sprite(raise_x, level2boss.y - 50, 'monsters');
			        monster1.animations.add('walk', [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], true);
			        monster1.animations.add('attack', [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
			                                           38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], true);
			        monster1.animations.add('rise', [145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155], false);
			        monster1.animations.play('rise', 7, false);
			        monster1.events.onAnimationComplete.addOnce(function(){
						monster1.animations.play('walk', 7, true);
					}, this);
			        game.physics.enable(monster1);
			        monster1.body.collideWorldBounds = true;
			        monster1.body.gravity.y = 500;
			        monster1.health = 2;
			        monsters[monster_index] = monster1;
			        monster_index++;
			        risen++;
					raise_timer = 0;
				} 
				raise_timer++;
				if(risen === 6){
					console.log("made it!");
					channeled = true;
					channeling = false;
					ranged = false;
					attack = false;
					risen++;
				}
			}

			if(ranged){
				console.log("ranged");
				attack = false;
				if(player.x < level2boss.x){
					level2boss.scale.x = 1;
					level2boss.body.velocity.x = -500;
					boss_right = false;
				} else if (player.x >= level2boss.x){
					level2boss.scale.x = -1;
					level2boss.body.velocity.x = 500;
					boss_right = true;
				}
				if(game.physics.arcade.collide(player, level2boss)){
					ranged = false;
				}
			}
		
			if (level2boss.health <= 0){
				level2boss.destroy();
				if (once){
					handleXP(1000);
					once = false;
				}
				var x = level2boss.x;
				var y = level2boss.y-50;
				var explodeBoss = game.add.sprite(x, y, 'player');
				explodeBoss.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
				explodeBoss.anchor.set(0.43, 0.43);
				explodeBoss.animations.play('explosion', 20, false);
				explodeBoss.killOnComplete = true;
				explosion.volume = 2;
				explosion.play();
				level2boss.destroy();
			}
		}
	
		game.physics.arcade.collide(level2boss, layer);

	}
}

var charging = false;
var b3_right;
var b3_fire_delay = 0;
var b3_health = 0;
var charge_delay = 0;
var isTheEnd = false;

function handleLevel3Boss(){
	
	if(game.physics.arcade.distanceBetween(player, level3boss) > 200 ||
			  game.physics.arcade.distanceBetween(player, level3boss) < -200){
		ranged = true;
		charging = false;
		level3boss.body.velocity.x = 0;
		b3_ani = 'idle';
	}
	if (charge_delay > 80 && charge_delay < 150){
		charging = true;
		ranged = false;
		charge_delay++;
	}else if (charge_delay === 150 || charge_delay === 0){
		charge_delay = 0;
		charging = false;
		ranged = true;
		charge_delay++;
	}
    else
    	charge_delay++;
	
	if(game.physics.arcade.distanceBetween(player, level3boss) > 200 ){
		b3_right = true;
	}else if(game.physics.arcade.distanceBetween(player, level3boss) < -200){
		b3_right = false;
	}
	
	if (level3boss.exists){
		if (b3_health <= 0){
			var health = level3boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
		    b3_health = game.add.text(level3boss.x, level3boss.y - 100, health, style1);
		}else if (level3boss.health < 0){
			b3_health.destroy();
		}
		else{
			b3_health.destroy();
			var health = level3boss.health;
			var style1 = { font: "20px Arial", fill: "#FF0000", align: "center" };
		    b3_health = game.add.text(level3boss.x, level3boss.y - 100, health, style1);
		}

		if (b3_fire_delay === 60 || b3_fire_delay === 0)
			b3_fire_delay = 0;
	    else
	    	b3_fire_delay++;
		
		if ((game.physics.arcade.distanceBetween(player, level3boss) < 500) && !player_met){
			player_met = true;
		}
		
		if (player_met && !(player.health === 0)){
			if(!ranged && !charging){
				b3_ani = 'walking';
				level3boss.animations.play('walking');
				if(player.x + 80 < level3boss.x){
					level3boss.scale.x = -1;
					level3boss.body.velocity.x = -100;
					boss_right = false;
				} else if(player.x - 80 >= level3boss.x){
					level3boss.scale.x = 1;
					level3boss.body.velocity.x = 100;
					boss_right = true;
				} 
			}else if (ranged){
				charging = false;
				level3boss.animations.play('idle');
				if (b3_fire_delay === 0){
					createLavaBubbles();
					b3_fire_delay++;
				}
			}else if (charging){
				ranged = false;
				level3boss.animations.play('charging', 15);
				if(player.x + 80 < level3boss.x){
					level3boss.scale.x = -1;
					level3boss.body.velocity.x = -200;
					boss_right = false;
				} else if(player.x - 80 >= level3boss.x){
					level3boss.scale.x = 1;
					level3boss.body.velocity.x = 200;
					boss_right = true;
				} 
			}	
		}
		
		if (level3boss.health <= 0){
			level3boss.destroy();
    		if (once){
    			handleXP(1000);
    			once = false;
    		}
    		isTheEnd = true;
    		var x = level3boss.x;
        	var y = level3boss.y;
        	var explodeBoss = game.add.sprite(x, y, 'level3boss');
        	explodeBoss.animations.add('dying', [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
                                                 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100], true);
        	explodeBoss.animations.play('dying', 20, false);
        	explodeBoss.anchor.set(0.5, 1);
        	explodeBoss.killOnComplete = true;
        	explosion.volume = 2;
        	explosion.play();
        	black_bg = game.add.sprite(0, 0, 'black_bg');
        	black_bg.alpha = 0.0;
        	black_bg.fixedToCamera = true;
        	level3boss.destroy();
        	music.stop();
        	the_end_music.play();
		}
	}
	
	game.physics.arcade.collide(level3boss, ouch_layer);
	game.physics.arcade.collide(level3boss, layer);
}

function handleHealth() {
    if (isTheEnd === false) {
        if (player.health === 6) {
            health1.animations.play('full', 1);
            health2.animations.play('full', 1);
            health3.animations.play('full', 1);
        } else if (player.health === 5) {
            health3.animations.play('half', 1);
        } else if (player.health === 4) {
            health3.animations.play('empty', 1);
        } else if (player.health === 3) {
            health2.animations.play('half', 1);
        } else if (player.health === 2) {
            health2.animations.play('empty', 1);
        } else if (player.health === 1) {
            health1.animations.play('half', 1);
        } else if (player.health === 0 && !choice) {
            health1.animations.play('empty', 1);
            player.destroy();
            fire_delay = 100;
            music.stop();
            t3 = game.add.text(player.x - 250, player.y - 100, "Thank You for Playing!\n" +
                    "Press 'Y' to Play Again!", { font: "65px Arial", fill: "#FFFFFF", align: "center" });
            text_timeout = 0;

            if (yesKey.isDown) {
                t3.destroy();
                reset();
                create();
            }
        }
    }
	
}

var switched = 0;

function handleInput(){
	if (switched === 30 || switched === 0)
		switched = 0;
	else
		switched++;
	
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
    
	if (weaponKey.isDown && hasGrenades && switched === 0 && fire_delay === 0){
		if (weapon === GUN){
		    gun_mod.destroy();
		    grenade_mod = game.add.sprite(450, 0, 'grenademod');
		    grenade_mod.fixedToCamera = true;
			weapon = GRENADES;
			switched++;
		}
		else if(weapon === GRENADES){
		    grenade_mod.destroy();
		    gun_mod = game.add.sprite(450, 0, 'gunmod');
		    gun_mod.fixedToCamera = true;
			weapon = GUN;
			switched++;
		}
	}
	
	if (jumpKey.isDown && jumping === false)
    {
    	jumping = true;
    	
        player.body.velocity.y = -250;
        player.body.velocity.x = velocity;
    }
	
	var i = 0;
	var collided = false;
		while (i < monster_index){
			if (game.physics.arcade.collide(monsters[i], player)){
	    		collided = true;
	    	}
	    	i++;
	    }
	
	if (player.body.onFloor() || collided){
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
				player.anchor.setTo(0, 0);
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
    if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer))
    {
        sprite.animations.play('explosion', 20, false);
        sprite.body.velocity.x = 0;
        if (sprite.health === 0){
            explosion.volume = 2;
            explosion.play();
            justExploded = false;
            sprite.health++;
        }
    } else if (game.physics.arcade.collide(sprite, level1boss)) {
        sprite.body.velocity.x = 0;
        sprite.kill();
        level1boss.health = level1boss.health - 2;
        level1boss.body.velocity.x = 0;
        var x = sprite.x;
    	var y = sprite.y;
    	var explodeBoss = game.add.sprite(x, y, 'player');
    	explodeBoss.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
    	explodeBoss.anchor.set(0.43, 0.43);
    	explodeBoss.animations.play('explosion', 20, false);
    	explodeBoss.killOnComplete = true;
    	explosion.volume = 2;
    	explosion.play();
    }else if (game.physics.arcade.collide(sprite, level2boss)) {
        sprite.body.velocity.x = 0;
        sprite.kill();
        level2boss.health = level2boss.health - 2;
        level2boss.body.velocity.x = 0;
        var x = sprite.x;
    	var y = sprite.y;
    	var explodeBoss = game.add.sprite(x, y, 'player');
    	explodeBoss.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
    	explodeBoss.anchor.set(0.43, 0.43);
    	explodeBoss.animations.play('explosion', 20, false);
    	explodeBoss.killOnComplete = true;
    	explosion.volume = 2;
    	explosion.play();
    }else if (game.physics.arcade.collide(sprite, level3boss)) {
        sprite.body.velocity.x = 0;
        sprite.kill();
        level3boss.health = level3boss.health - 2;
        level3boss.body.velocity.x = 0;
        var x = sprite.x;
    	var y = sprite.y;
    	var explodeBoss = game.add.sprite(x, y, 'player');
    	explodeBoss.animations.add('explosion', [71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90], 10, true);
    	explodeBoss.anchor.set(0.43, 0.43);
    	explodeBoss.animations.play('explosion', 20, false);
    	explodeBoss.killOnComplete = true;
    	explosion.volume = 2;
    	explosion.play();
    }else{
        var i = 0;
		while (i < monster_index)
		{
			if (game.physics.arcade.collide(sprite, monsters[i]) && sprite.health === 0){
				if (monsters[i] === level1boss || monsters[i] === level2boss || monsters[i] === level3boss){
					
				}
				else{
					sprite.animations.play('explosion', 20, false);
					sprite.body.velocity.x = 0;
					monsters[i].health = monsters[i].health - 2;
					monsters[i].body.velocity.x = 0;
					if (sprite.health === 0){
						explosion.volume = 2;
						explosion.play();
						justExploded = false;
						sprite.health++;
					}
				}
			}
			i++;
		}
		
    }
}

function checkBulletCollisions(sprite) {
	if (game.physics.arcade.collide(sprite, layer) || game.physics.arcade.collide(sprite, ouch_layer))
	    sprite.kill();
	if (game.physics.arcade.collide(sprite, level1boss)) {
	    level1boss.health--;
	    level1boss.body.velocity.x = 0;
	    sprite.kill();
	}
	if (game.physics.arcade.collide(sprite, level2boss)) {
	    if (!channeling){
	    	level2boss.health--;   
	    }
	    level2boss.body.velocity.x = 0; 
	    sprite.kill();	
	}
	if (game.physics.arcade.collide(sprite, level3boss)) {
	    level3boss.health--;
	    level3boss.body.velocity.x = 0;
	    sprite.kill();
	}
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
    	grunt.play();
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
		grenade.body.velocity.x = 170;
		grenade.body.velocity.y = -100;
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
		grenade.body.velocity.x = -170;
		grenade.body.velocity.y = -100;
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
		bullet.reset(player.x, player.y + 15);
		bullet.body.velocity.x = -700;
		bullet.scale.x = -1;
	}else {
		var bullet = bullets.getFirstExists(false);
		bullet.reset(player.x, player.y + 15);
		bullet.body.velocity.x = 700;
		bullet.scale.x = 1;
	}
    player.bringToTop();
}

function createLavaBubbles() {
    if (player.x < level3boss.x) {
        var fireball = fireballs.getFirstExists(false);
        fireball.reset(level3boss.x + 20, level3boss.y - 50);
        game.physics.arcade.accelerateToObject(fireball, player, 300);
        fireball.scale.x = -1;
    } else {
        var fireball = fireballs.getFirstExists(false);
        fireball.reset(level3boss.x + 20, level3boss.y - 50);
        game.physics.arcade.accelerateToObject(fireball, player, 300);
        fireball.scale.x = 1;
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
	var i = 0;
	while(i < monster_index){
		monsters[i].destroy();
		i++;
	}
	running = false;
	firing = false;
	choice = false;
	fire_dealy = 0;
	ouch_timer = 0;
	facing_right = true;
	weapon = GUN;
	monster_index = 0;
	fireball_delay = 0;
	fire_delay = 0;
	velocity = 0;
	hasAcquiredFinishToken = false;
	bossDestroyed = false;
	player_met = false;
	hasGrenades = false;
	map.destroy();
	layer.destroy();

}
