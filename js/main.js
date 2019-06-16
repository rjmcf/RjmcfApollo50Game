// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
playerThrust = 1000;
playerFuelUsage = 0.5;
playerThrusting = false;
playerTurnSpeed = 0.1;
playerTurningClockwise = false;
playerTurningAnticlockwise = false;

gravityStrength = 500;

// Phaser parameters:
// - game width
// - game height
// - renderer
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.CANVAS, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload()
{
    game.load.image("spaceship", "../assets/proto_spaceship.png");
}

/*
 * Initialises the game. This function is only called once.
 */
function create()
{
    game.stage.setBackgroundColor("#66ffff");
    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(400,300,"spaceship");
    game.physics.p2.enable(player);
    player.body.angularDamping = 0.7;
    player.fuel = 100;

    fuelLabel = game.add.text(20, 20, "");

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerStartThrust);
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onUp.add(playerStopThrust);
    game.input.keyboard
        .addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(playerStartTurnClockwise);
    game.input.keyboard
        .addKey(Phaser.Keyboard.RIGHT)
        .onUp.add(playerStopTurnClockwise);
    game.input.keyboard
        .addKey(Phaser.Keyboard.LEFT)
        .onDown.add(playerStartTurnAnticlockwise);
    game.input.keyboard
        .addKey(Phaser.Keyboard.LEFT)
        .onUp.add(playerStopTurnAnticlockwise);
    game.input
        .onDown.add(debugChangeGravity);
}

/*
 * Updates state of game. Called many times per second.
 */
function update()
{
    if (playerThrusting && player.fuel > 0)
    {
        player.body.thrust(playerThrust);
        player.fuel = player.fuel - playerFuelUsage;
        if (player.fuel < 0)
        {
            player.fuel = 0;
        }
    }

    if (playerTurningClockwise)
    {
        player.body.angularVelocity += playerTurnSpeed;
    }

    if (playerTurningAnticlockwise)
    {
        player.body.angularVelocity -= playerTurnSpeed;
    }

    fuelLabel.setText("Fuel: " + player.fuel.toString());
}

function debugChangeGravity()
{
    clickLocation = new Phaser.Point(game.input.mousePointer.x, game.input.mousePointer.y);
    playerLocation = new Phaser.Point(player.body.x, player.body.y);
    direction = Phaser.Point.subtract(clickLocation, playerLocation).normalize();
    setGravityDirection(direction);
}

function playerStartThrust()
{
    playerThrusting = true;
}

function playerStopThrust()
{
    playerThrusting = false;
}

function playerStartTurnClockwise()
{
    playerTurningClockwise = true;
}

function playerStopTurnClockwise()
{
    playerTurningClockwise = false;
}

function playerStartTurnAnticlockwise()
{
    playerTurningAnticlockwise = true;
}

function playerStopTurnAnticlockwise()
{
    playerTurningAnticlockwise = false;
}

function setGravityDirection(direction)
{
    gravityVector = direction.multiply(gravityStrength, gravityStrength);
    game.physics.p2.gravity.x = gravityVector.x;
    game.physics.p2.gravity.y = gravityVector.y;
}
