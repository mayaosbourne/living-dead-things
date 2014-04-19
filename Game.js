/**
 * 
 */
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('phaser', 'assets/seductive.jpg');
    game.load.image('stand', 'assets/player/standing.png');
    game.load.spritesheet('run', 'assets/player/running_1.png', 48, 47, 6);
    game.load.spritesheet('backwards', 'assets/player/backwards.png', 48, 47, 6);

}

var sprite;
var player;

var upKey;
var downKey;
var leftKey;
var rightKey;

function create() {

    game.stage.backgroundColor = '#736357';
    
    back = game.add.image(0, 0, 'phaser');
	back.scale.set(2);
    
    player = game.add.sprite(200, 360, 'run');
    player.animations.add('run');
    player.animations.add('backwards');
    
    game.physics.arcade.enable(player);
    
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
   
  
    //  In this example we'll create 4 specific keys (up, down, left, right) and monitor them in our update function
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    jumpKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

}

function update() {

	player.body.velocity.x = 0;
	
    if (downKey.isDown)
    {
    	player.body.velocity.x = -350;
    	player.animations.play('run', 10);
    }
    else if (upKey.isDown)
    {
    	player.body.velocity.x = 350;
    	player.animations.play('backwards', 10);
    }
    else{
    	
    }
    if (jumpKey.isDown)
    {
        player.body.velocity.y = -350;
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
