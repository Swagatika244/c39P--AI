/*--------------------------------------------------------*/
var PLAY = 1;
var END = 0;
var WIN = 2;
var gameState = PLAY;

var kangaroo, kangaroo_running, kangaroo_collided;
var jungle, invisiblejungle;
var invisibleGround

var obstaclesGroup, obstacle1;
var shrub

var score=0;

var gameOver, restart, win;

function preload(){
  kangaroo_running =   loadAnimation("assets/kangaroo1.png","assets/kangaroo2.png","assets/kangaroo3.png");
  kangaroo_collided = loadAnimation("assets/kangaroo1.png");
  jungleImage = loadImage("assets/bg.png");
  shrub1 = loadImage("assets/shrub1.png");
  shrub2 = loadImage("assets/shrub2.png");
  shrub3 = loadImage("assets/shrub3.png");
  obstacle1 = loadImage("assets/stone.png");
  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");
  jumpSound = loadSound("assets/jump.wav");
  collidedSound = loadSound("assets/collided.wav");
}

function setup() {
  createCanvas(800, 400);

  //create jungle 
  jungle = createSprite(400,30,width,20);
  jungle.addImage("jungle",jungleImage);
  jungle.scale=0.4;
  jungle.x = width /2;

  //create kangaroo and set properties 
  kangaroo = createSprite(100, height-120);
  kangaroo.addAnimation('kangaroo_running', kangaroo_running);
  kangaroo.addAnimation('kangaroo_collided', kangaroo_collided);
  kangaroo.changeAnimation('kangaroo_running');
  kangaroo.scale = 0.15;
  kangaroo.debug = true;
  kangaroo.setCollider("circle", 0, 100, 600);

  // create invisible ground 
  invisibleGround = createSprite(width/2, height-20, width, 20);
  invisibleGround.visible = false;

  // create Groups 
  shrubsGroup = new Group();
  obstaclesGroup = new Group();

  // create Gameover element 
  gameOver = createElement('h1', "Game Over");
  gameOver.position(width/2-180, height/2-140);
  gameOver.class('resetText');

  // create Restart Button 
  restart = createImg("assets/restart.png");
  restart.position(width/2-45, height/2);
  restart.size(80, 80);
  restart.mouseClicked(reset);

  // create Win icon
  win = createElement('h1','Congratulation!!!<br>You Won');
  win.position(width/2-250, height/2-200);
  win.class('resetText');
  
  score = 0;

}

function draw() {
  background(0);
  //position of kangaroo according to camera
  kangaroo.x = camera.position.x-270;

  //Gravity 
  kangaroo.velocityY +=1 ;
  kangaroo.collide(invisibleGround);

  //check the state of game 
  if (gameState === PLAY){       
        
        gameOver.hide();
        restart.hide();
        win.hide();

        jungle.velocityX = -4;
        if(jungle.x < 0){
          jungle.x = jungle.width/7;
        }

        if(keyDown (UP_ARROW) && kangaroo.y >= 170){
          kangaroo.velocityY = -12;
          jumpSound.play();
        }

      //spawn Shubs
        spawnObstables();

      //spawn Obstacles
        spawnShrub();

      if (kangaroo.isTouching(shrubsGroup)){
        for(var shrub of shrubsGroup){
        shrub.destroy();
        score +=1;}
      }
      if (kangaroo.isTouching(obstaclesGroup)){
        //gameState = 0;
        kangaroo.velocityY = -12;

        //collidedSound.play();
      }
      if(score===5){
         gameState=WIN       
      }
  }
  if(gameState===END){
    gameOver.show();
    restart.show();

    kangaroo.changeAnimation('kangaroo_collided');
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
  }
  if(gameState===WIN){
    win.show();
    restart.show();

    kangaroo.changeAnimation('kangaroo_collided');
    jungle.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    shrubsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
  }
  drawSprites();

  push ();
    stroke (0);
    fill ('#660000');
    textSize (25);
    textStyle(BOLDITALIC);
    text ("Score: " + /* "&emsp;" */ + score , width -120, 30);
  pop ();
}

function spawnShrub(){
  if(frameCount %150 === 0){
    shrub = createSprite(camera.position.x + 400, 330, 40, 10);
    shrub.velocityX = -4;
    var shrubTypes = [shrub1, shrub2, shrub3];
    var rand = random(shrubTypes);
    shrub.addImage(rand);
    shrub.scale = 0.1;
    shrub.lifetime = width/4 + 200;
    shrubsGroup.add(shrub);
  }
}
function spawnObstables(){
  if(frameCount %100 === 0){
    var obstacle = createSprite(camera.position.x + 500, 330, 40, 10);
    obstacle.velocityX = -4;
    obstacle.scale = 0.25;
    obstacle.addImage(obstacle1);
    obstaclesGroup.add(obstacle);
    obstacle.lifetime = width/4 + 200;
    obstacle.depth = kangaroo.depth;
    kangaroo.depth +=1;
  }
}
function reset(){
  if(gameState===END || gameState===WIN){
    gameState = PLAY;
    kangaroo.changeAnimation('kangaroo_running');
    obstaclesGroup.destroyEach();
    shrubsGroup.destroyEach();

    score = 0;
  }
  
}
