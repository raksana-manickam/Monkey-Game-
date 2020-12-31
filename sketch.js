var monkey , monkey_running;

var banana ,bananaImage,foodGroup;

var obstacle, obstacleImage, obstacleGroup;

var score;

var ground, groundImage, invisibleGround;

var cloud, cloudImage, cloudGroup;

var survivaltime;

var PLAY = 1

var END = 0;

var gameState = PLAY;

var monkey_fainting;

var gameover, gameoverImage;

var restart, restartImage;

function preload(){
  
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");

  monkey_fainting = loadAnimation("faint.png");
  
  bananaImage = loadImage("banana.png");
  
  obstacleImage = loadImage("obstacle.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  gameoverImage = loadImage("gameover.png");
  
  restartImage = loadImage("restart.png");
}

function setup() {
  
  createCanvas(600,400);
  
  ground = createSprite(100,375,60000,30000);
  ground.addImage("ground",groundImage);
  ground.scale = 0.1;
      
  monkey = createSprite(70,310);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("fainting",monkey_fainting);
  monkey.scale = 0.18;
  
  invisibleGround = createSprite(300,370,600,10);
  invisibleGround.visible = false;
  
  gameover = createSprite(270,160);
  gameover.addAnimation("over",gameoverImage);
  
  restart = createSprite(300,230);
  restart.addImage("restart", restartImage);
  restart.scale = 0.1;

  survivaltime = 0;
  
  score = 0;
  
  foodGroup = createGroup();
  obstacleGroup = createGroup();
  cloudGroup = createGroup();
  
  monkey.setCollider("rectangle",0,0,500,500);

}


function draw() {
  
  background("lightblue");
  
  monkey.collide(invisibleGround);

  
 if(gameState === PLAY){
    
    ground.velocityX = -(3 + 3* survivaltime/100);
    
   if (ground.x < 300){
      ground.x = ground.y;
    }

   if(touches.lenght>0 || keyDown("space")&& monkey.y >= 150) {
        monkey.velocityY = -10;
        touches = [];
    }
  
   if(foodGroup.isTouching(monkey)){
      foodGroup.destroyEach();
      score = score + 1;
    } 
  
    monkey.velocityY = monkey.velocityY + 0.8;
  
    survivaltime = survivaltime +  Math.round(getFrameRate()/60);
   
   gameover.visible = false;
   restart.visible = false;
   
    if(obstacleGroup.isTouching(monkey)){
        gameState = END;
    }
   
  spawnClouds();
  spawnBananas();
  spawnObstacles();
 }
  
  else if (gameState === END) {
    
    ground.velocityX = 0;
    monkey.velocityX = 0;
    monkey.velocityY = 0;
    
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);

    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    
    monkey.changeAnimation("fainting", monkey_fainting);
    
    gameover.visible = true;
    restart.visible = true;
  
    if(mousePressedOver(restart)) {
      reset();
     }
  }   
  
  
  //monkey.debug = true;

  
  drawSprites();
  
  fill("black");
  textSize(20);
  text("SURVIVAL TIME : "+ survivaltime,210,30);
  
  fill("black");
  textSize(25);
  text("SCORE : "+ score,240,60);
}

function spawnClouds() {

  if (frameCount % 150 === 0) {
    var cloud = createSprite(610,120);
    cloud.y = Math.round(random(40,150));
    cloud.addImage(cloudImage);
    cloud.scale = 0.02;
    cloud.velocityX = -(3 + 3* survivaltime/100);
    cloud.lifetime = 250;
    monkey.depth = cloud.depth;
    monkey.depth = monkey.depth + 1;
    cloudGroup.add(cloud);
    gameover.depth = cloud.depth;
    gameover.depth = gameover.depth + 1;
  }
}

function spawnBananas() {

  if (frameCount % 100 === 0) {
    var banana = createSprite(600,120);
    banana.y = Math.round(random(100,320));
    banana.addImage(bananaImage);
    banana.velocityX = -(3 + 3* survivaltime/100);
    banana.scale = 0.1;
    banana.lifetime = 220;
    monkey.depth = banana.depth;
    monkey.depth = monkey.depth + 1;
    foodGroup.add(banana);
    gameover.depth = banana.depth;
    gameover.depth = gameover.depth + 1;
  }
}


function spawnObstacles() {

  if (frameCount % 300 === 0) {
    var obstacle = createSprite(600,120);
    obstacle.y = 330;
    obstacle.addImage(obstacleImage);
    obstacle.velocityX = -(3 + 3* survivaltime/100);
    obstacle.scale = 0.18;
    obstacle.lifetime = 220;
    obstacleGroup.add(obstacle);   
    //obstacle.debug = true;
    obstacle.setCollider("rectangle",0,0,300,300);
  }
}

function reset(){
  score = 0;
  survivaltime = 0;
  gameover.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  foodGroup.destroyEach();
  gameState = PLAY;
  monkey.changeAnimation("running",monkey_running)
}