/**
 * 
 */
var game = new Phaser.Game(800, 800, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
	game.load.image('ground', 'assets/seductive.jpg');
    game.load.image('stand', 'assets/player/standing.png');
    game.load.spritesheet('run', 'assets/player/running_1.png', 48, 47, 6);
    game.load.spritesheet('backwards', 'assets/player/backwards.png', 48, 47, 6);
	
	//Load the tilemap file
    game.load.tilemap('myGame', 'test_map.json', null, Phaser.Tilemap.TILED_JSON);
	//Load the spritesheet for the tilemap
    game.load.image('tiles1', 'assets/tilesets/tile_04.png');
    
}

var sprite;
var player;
var jumping;
var velocity;

var platforms;
var upKey;
var downKey;
var leftKey;
var rightKey;

function create() {
	jumping = false;
    game.stage.backgroundColor = '#736357';

    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

	map = game.add.tilemap('myGame');
	
	//'main' is the name of the spritesheet inside of Tiled Map Editor
	
    map.addTilesetImage('main', 'tiles1');
    
	//'Grass 1' is the name of a layer inside of Tiled Map Editor
    layer = map.createLayer('Tile Layer 1');
    layer.resizeWorld();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
 
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
 
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
 
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(3, 3);
 
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
    
    player = game.add.sprite(200, 360, 'run');
    player.animations.add('run');
    player.animations.add('backwards');
    
    game.physics.arcade.enable(player);
    
    //  Player physics properties. 
    //player.body.bounce.y = 0.2;
    player.body.gravity.y = 500;
    player.body.collideWorldBounds = true;
	
}

function update() {

//  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
	if (jumpKey.isDown && player.body.touching.down)
    {
    	jumping = true;
        player.body.velocity.y = -250;
    }
	if (player.body.touching.down){
    	jumping = false;
    }else{
    	player.body.velocity.x = velocity;
    }
	if (downKey.isDown && player.body.touching.down)
    {
    	player.body.velocity.x = -350;
    	player.animations.play('run', 10);
        velocity = player.body.velocity.x;
    }
    else if (upKey.isDown && player.body.touching.down)
    {
    	player.body.velocity.x = 350;
    	player.animations.play('backwards', 10);
    	velocity = player.body.velocity.x;
    }
    else if (player.body.touching.down){
    	player.body.velocity.x = 0;
    	velocity = player.body.velocity.x;
    }
   
    

//    if (leftKey.isDown)
//    {
//        sprite.x--;
//    }
//    else if (rightKey.isDown)
//    {
//        sprite.x++;
//    }

}
