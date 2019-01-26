window.onload = function() {

    const WIDTH = 300.0;
    const HEIGHT = 600.0;

    var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game-container', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    var controls = {}

    var currentStage = null

    function preload() {
        game.load.image('logo', 'assets/home-is-logo.png');
        game.load.image('play', 'assets/play.png');

        game.load.image('standing-on-the-ground', 'assets/standing-on-the-ground.png');
        game.load.image('ground', 'assets/ground.png');
    }

    function create() {
        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        game.stage.backgroundColor = "#FFFFFF";

        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Sprites
        currentStage = newTitleStage()
        game.world.add(currentStage)

        // Input
        game.input.onDown.add(onDown, this);

        // Pause
        controls.logo = game.add.image(game.world.centerX, game.world.centerY, 'play');
        controls.logo.anchor.setTo(0.5, 0.5);
        game.onResume.add(function() {
            controls.logo.kill();
        });
        game.onPause.add(function() {
            controls.logo.revive();
            controls.logo.bringToTop();
        });
        game.paused = true;
    }

    function newTitleStage() {
        var stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 0, 'logo')
        game.physics.enable(sprite, Phaser.Physics.ARCADE);
        sprite.body.collideWorldBounds = true;
        sprite.body.gravity.y = 200;

        sprite.body.onWorldBounds = new Phaser.Signal();
        sprite.body.onWorldBounds.add(function(sprite) {
            game.world.remove(currentStage, true);
            currentStage = newStandingOnTheGroundStage()
            game.world.add(currentStage)
        }, this);

        stage.add(sprite)

        return stage
    }

    function newStandingOnTheGroundStage() {
        var stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'standing-on-the-ground')
        stage.add(sprite)
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            game.world.remove(currentStage, true);
            currentStage = newTitleStage()
            game.world.add(currentStage)
        }, this);

        sprite = game.add.sprite(0, 510, 'ground')
        stage.add(sprite)

        return stage
    }

    function render() {
    }

    function update() {
        if (!game.scale.isFullScreen) {
            game.paused = true;
            return;
        }
    }

    function onDown() {
        // Fullscreen
        game.paused = false;
        if (!game.scale.isFullScreen) {
            game.scale.startFullScreen(false);
            return;
        }
    }

    function debug(text, line=1.0) {
        game.debug.text(text, 100.0, HEIGHT - line * 20.0);
    }
    function round(value) {
        return Math.round(value * 100) / 100;
    }
    function random(min, max) {
        return game.rnd.between(min, max);
    }
    function randomItem(items) {
        return game.rnd.pick(items);
    }
    function frac() {
        return game.rnd.frac();
    }
    function distance(x1, y1, x2, y2) {
        return Phaser.Math.distance(x1, y1, x2, y2);
    }

};
