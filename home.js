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

    var colliding = {
        a: [],
        b: []
    }

    function preload() {
        game.load.image('logo', 'assets/home-is-large.png');
        game.load.image('play', 'assets/play.png');

        game.load.image('standing-on-the-ground', 'assets/standing-on-the-ground.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('astronaut', 'assets/astronaut.png');

        game.load.image('breath-of-the-elements', 'assets/the-breath-of-the-elements.png');

        game.load.image('spending-time-together', 'assets/spending-time-together.png');

        game.load.image('the-noise-outside', 'assets/the-noise-outside.png');
    }

    function create() {
        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

        // Init
        game.stage.backgroundColor = "#FFFFFF";
        game.physics.startSystem(Phaser.Physics.ARCADE);
        resetColliding();

        // Stages
        newTitleStage()

        // Input
        game.input.onDown.add(onDown, this);

        // Pause
        controls.logo = game.add.image(game.world.centerX, game.world.centerY, 'play');
        controls.logo.anchor.setTo(0.5, 0.5);
        game.onResume.add(function() {
            controls.logo.kill()
        });
        game.onPause.add(function() {
            controls.logo.revive()
            controls.logo.bringToTop()
        });
        game.paused = true
    }

    function resetColliding() {
        colliding.a = []
        colliding.b = []
    }

    function newTitleStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 0, 'logo')
        stage.add(sprite)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newStandingOnTheGroundStage()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newStandingOnTheGroundStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'standing-on-the-ground')
        stage.add(sprite)

        var ground = game.add.sprite(0, 510, 'ground')
        game.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.immovable = true
        stage.add(ground)

        var astronaut = game.add.sprite(140, 482, 'astronaut')
        stage.add(astronaut)

        var trash = game.add.group();
        for (var i = 0; i < 5; ++i) {
            let trashItem = game.add.sprite(20 + 40 * i, 25.0, 'astronaut')
            trashItem.angle = random(0, 359)
            trashItem.anchor.setTo(0.5, 0.5);
            game.physics.enable(trashItem, Phaser.Physics.ARCADE);
            trashItem.body.gravity.y = random(150, 200);
            game.physics.arcade.collide(trashItem, ground);
            trashItem.body.bounce.set(0.8)
            trash.add(trashItem)
        }

        colliding.a = trash.children
        colliding.b = [ ground ]

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newBreathOfTheElementsStage()
            ground.destroy()
            astronaut.destroy()
            trash.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newBreathOfTheElementsStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'breath-of-the-elements')
        stage.add(sprite)
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newSpendingTimeTogetherStage()
            sprite.destroy();
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newSpendingTimeTogetherStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'spending-time-together')
        stage.add(sprite)
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newNoiseOutsideStage()
            sprite.destroy();
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newNoiseOutsideStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'the-noise-outside')
        stage.add(sprite)
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newTitleStage()
            sprite.destroy();
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function render() {
    }

    function update() {
        if (!game.scale.isFullScreen) {
            game.paused = true;
            return;
        }

        game.physics.arcade.collide(colliding.a, colliding.b);
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
