window.onload = function() {

    const WIDTH = 300.0;
    const HEIGHT = 600.0;

    var game = new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'game-container', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    var colliding = {
        a: [],
        b: []
    }

    var controls = {
        emitter: null,
        emit: false
    }

    function preload() {
        game.load.image('title', 'assets/home-is-large.png')
        game.load.image('logo', 'assets/home-is-logo-150px.png')
        game.load.image('play', 'assets/play.png')

        game.load.image('standing-on-the-ground', 'assets/standing-on-the-ground.png')
        game.load.image('ground', 'assets/ground.png')
        game.load.image('astronaut', 'assets/astronaut-cropped.png')
        game.load.image('spaceship', 'assets/spaceship.png')
        game.load.image('house', 'assets/house.png')
        game.load.image('flowers', 'assets/flowers.png')

        game.load.image('breath-of-the-elements', 'assets/the-breath-of-the-elements.png')
        game.load.image('wind', 'assets/wind.png')
        game.load.spritesheet('rain', 'assets/rain.png', 150, 200, 4)

        game.load.image('spending-time-together', 'assets/spending-time-together.png')
        game.load.image('astronaut-sitting', 'assets/astronaut-sitting.png')

        game.load.image('the-noise-outside', 'assets/the-noise-outside.png')
        game.load.image('astronaut-right', 'assets/astronaut-cropped-right.png')
        game.load.image('window', 'assets/window.png')

        game.load.image('a-bath', 'assets/a-bath.png')
        game.load.image('bath', 'assets/bath.png')

        game.load.image('a-bed', 'assets/a-bed.png')
        game.load.image('bed', 'assets/bed.png')

        game.load.image('and-well-fed', 'assets/and-well-fed.png')
        game.load.image('fed', 'assets/fed.png')

        game.load.image('leaving-home', 'assets/leaving-home.png')
        game.load.image('ramp', 'assets/ramp.png')

        game.load.image('to-return-home', 'assets/to-return-home.png')
        game.load.image('capsule', 'assets/capsule.png')

        game.load.image('not-a-game', 'assets/not-a-game.png')

        game.load.image('when-someone-is-waiting', 'assets/when-someone-is-waiting.png')
        game.load.image('fin', 'assets/fin.png')
        game.load.spritesheet('astronaut-partner', 'assets/astronaut-partner-cropped.png', 100, 152, 4)
        game.load.image('heart', 'assets/heart.png');
    }

    function create() {
        // Maintain aspect ratio
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL

        // Init
        game.stage.backgroundColor = "#FFFFFF"
        game.physics.startSystem(Phaser.Physics.ARCADE)
        resetColliding()

        // Sprites and stages
        controls.emitter = game.add.emitter(0, 0, 100);
        controls.emitter.makeParticles('heart');
        controls.emitter.gravity = -250;

        newTitleStage()

        // Input
        game.input.onDown.add(onDown, this);

        // Pause
        let play = game.add.image(game.world.centerX, game.world.centerY, 'play');
        play.anchor.setTo(0.5, 0.5);
        game.onResume.add(function() {
            play.kill()
        });
        game.onPause.add(function() {
            play.revive()
            play.bringToTop()
        });
        game.paused = true
    }

    function resetColliding() {
        colliding.a = []
        colliding.b = []
    }

    function newTitleStage() {
        let stage = new Phaser.Stage(game)

        var logo = game.add.sprite(75, 50, 'logo')
        stage.add(logo)

        var sprite = game.add.sprite(0, 0, 'title')
        stage.add(sprite)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newStandingOnTheGroundStage()
            logo.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    const TRASH = ['spaceship', 'house', 'flowers']
    function newStandingOnTheGroundStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'standing-on-the-ground')
        stage.add(sprite)

        var ground = game.add.sprite(0, 510, 'ground')
        game.physics.enable(ground, Phaser.Physics.ARCADE);
        ground.body.immovable = true
        stage.add(ground)

        var astronaut = game.add.sprite(100, 360, 'astronaut')
        stage.add(astronaut)

        var trash = game.add.group();
        for (var i = 0; i < 5; ++i) {
            let trashItem = game.add.sprite(40 + 55 * i, 25.0, randomItem(TRASH))
            trashItem.angle = random(0, 359)
            trashItem.anchor.setTo(0.5, 0.5);
            game.physics.enable(trashItem, Phaser.Physics.ARCADE);
            trashItem.body.gravity.y = random(200, 300);
            trashItem.body.bounce.set(0.5)
            trash.add(trashItem)
        }

        colliding.a = trash.children
        colliding.b = [ ground ]

        var next = function(nextStage) {
            return function() {
                if (game.paused) { return; }
                resetColliding()
                nextStage.apply()
                ground.destroy()
                astronaut.destroy()
                trash.destroy()
                sprite.destroy()
                stage.destroy()
            }
        }

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(next(newBreathOfTheElementsStage), this);
        astronaut.inputEnabled = true;
        astronaut.events.onInputDown.add(next(newStandingOnTheGroundStage), this);

        game.world.add(stage)
    }

    function newBreathOfTheElementsStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'breath-of-the-elements')
        stage.add(sprite)

        var astronaut = game.add.sprite(100, 225, 'astronaut')
        stage.add(astronaut)

        var wind = game.add.sprite(-300, 150, 'wind')
        game.physics.enable(wind, Phaser.Physics.ARCADE);
        stage.add(wind)

        var rain = game.add.sprite(90, 55, 'rain')
        rain.alpha = 0
        var raining = rain.animations.add('raining')
        rain.animations.play('raining', 12, true)
        stage.add(rain)

        var elementToggle = 0

        astronaut.inputEnabled = true;
        astronaut.events.onInputDown.add(function() {
            if (game.paused) { return; }

            if (elementToggle === 0) {
                rain.alpha = 0
                wind.x = -300
                wind.body.velocity.set(400, 0)
                wind.body.acceleration.set(400, 0)
                elementToggle = 1
            } else if (elementToggle === 1) {
                rain.alpha = 1
                elementToggle = 0
            }
        }, this);

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newSpendingTimeTogetherStage()
            raining.destroy()
            rain.destroy()
            wind.destroy()
            astronaut.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newSpendingTimeTogetherStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'spending-time-together')
        stage.add(sprite)

        var sittingAstroAlice = game.add.sprite(100, 150, 'astronaut-sitting')
        stage.add(sittingAstroAlice)
        var sittingAstroBob = game.add.sprite(20, 190, 'astronaut-sitting')
        stage.add(sittingAstroBob)
        var sittingAstroClaire = game.add.sprite(10, 280, 'astronaut-sitting')
        stage.add(sittingAstroClaire)

        var astronaut = game.add.sprite(198, 220, 'astronaut')
        stage.add(astronaut)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newNoiseOutsideStage()
            sittingAstroAlice.destroy()
            sittingAstroBob.destroy()
            sittingAstroClaire.destroy()
            astronaut.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newNoiseOutsideStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'the-noise-outside')
        stage.add(sprite)

        var rain = game.add.sprite(150, 100, 'rain')
        var raining = rain.animations.add('raining')
        rain.animations.play('raining', 12, true)
        stage.add(rain)

        var window = game.add.sprite(0, 100, 'window')
        stage.add(window)

        var astronaut = game.add.sprite(70, 225, 'astronaut-right')
        stage.add(astronaut)

        var flower = game.add.sprite(30, 300, 'flowers')
        stage.add(flower)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newBathStage()
            raining.destroy()
            rain.destroy()
            flower.destroy()
            window.destroy()
            astronaut.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newBathStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'a-bath')
        stage.add(sprite)

        var bath = game.add.sprite(0, 100, 'bath')
        stage.add(bath)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newBedStage()
            bath.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newBedStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'a-bed')
        stage.add(sprite)

        var bed = game.add.sprite(0, 100, 'bed')
        stage.add(bed)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newWellFedStage()
            bed.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newWellFedStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'and-well-fed')
        stage.add(sprite)

        var flower = game.add.sprite(40, 140, 'flowers')
        stage.add(flower)

        var fed = game.add.sprite(0, 100, 'fed')
        stage.add(fed)

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newLeavingHomeStage()
            flower.destroy()
            fed.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newLeavingHomeStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'leaving-home')
        stage.add(sprite)

        var ground = game.add.sprite(0, 510, 'ground')
        stage.add(ground)

        var ramp = game.add.sprite(100, 430, 'ramp')
        stage.add(ramp)

        var spaceship = game.add.sprite(150, 430, 'spaceship')
        stage.add(spaceship)

        spaceship.inputEnabled = true;
        game.physics.enable(spaceship, Phaser.Physics.ARCADE);
        spaceship.events.onInputDown.add(function() {
            if (game.paused) { return; }

            spaceship.body.acceleration.set(0, -200)
            spaceship.body.gravity.set(0, 100)
        }, this);

        var next = function(nextStage) {
            return function() {
                if (game.paused) { return; }

                nextStage.apply()
                ground.destroy()
                ramp.destroy()
                spaceship.destroy()
                sprite.destroy()
                stage.destroy()
            }
        }

        ramp.inputEnabled = true;
        ramp.events.onInputDown.add(next(newLeavingHomeStage), this);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(next(newReturnHomeStage), this);

        game.world.add(stage)
    }

    function newReturnHomeStage() {
        let stage = new Phaser.Stage(game)

        var ground = game.add.sprite(0, 510, 'ground')
        game.physics.enable(ground, Phaser.Physics.ARCADE)
        ground.body.immovable = true
        stage.add(ground)

        var capsule = game.add.sprite(150, 20, 'capsule')
        game.physics.enable(capsule, Phaser.Physics.ARCADE)
        capsule.anchor.setTo(0.5, 0.5)
        capsule.angle = random(84, 96)
        capsule.body.collideWorldBounds = true
        capsule.body.gravity.set(0, 100)
        game.physics.arcade.velocityFromAngle(capsule.angle, 300, capsule.body.velocity);
        capsule.body.bounce.set(0.05)
        stage.add(capsule)
        colliding.a = [ capsule ]
        colliding.b = [ ground ]

        capsule.inputEnabled = true
        capsule.events.onInputDown.add(function() {
            if (game.paused) { return; }

            capsule.position.set(150, 20)
            capsule.body.reset(150, 20)
            capsule.angle = random(84, 96)
            capsule.body.gravity.set(0, 100)
            game.physics.arcade.velocityFromAngle(capsule.angle, 300, capsule.body.velocity);
            colliding.a = [ capsule ]
            colliding.b = [ ground ]
        }, this)

        var sprite = game.add.sprite(0, 540.0, 'to-return-home')
        stage.add(sprite)
        sprite.inputEnabled = true
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            resetColliding()
            newNoGameStage()
            capsule.destroy()
            ground.destroy()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newNoGameStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'not-a-game')
        stage.add(sprite)
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            newSomeoneIsWaitingStage()
            sprite.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function newSomeoneIsWaitingStage() {
        let stage = new Phaser.Stage(game)

        var sprite = game.add.sprite(0, 540.0, 'when-someone-is-waiting')
        stage.add(sprite)

        var banner = game.add.sprite(0, 0, 'fin')
        stage.add(banner)

        var partner = game.add.sprite(45, 250, 'astronaut-partner')
        var blink = partner.animations.add('blink')
        partner.animations.play('blink', 8, true)
        stage.add(partner)

        var astronaut = game.add.sprite(155, 250, 'astronaut')
        stage.add(astronaut)

        stage.add(controls.emitter)
        controls.emit = true

        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(function() {
            if (game.paused) { return; }

            controls.emitter.resetAll(-1000, -1000)
            controls.emit = false

            newTitleStage()
            sprite.destroy()
            blink.destroy()
            partner.destroy()
            astronaut.destroy()
            banner.destroy()
            stage.destroy()
        }, this);

        game.world.add(stage)
    }

    function render() {
    }

    function update() {
        if (!game.scale.isFullScreen) {
            game.paused = true;
        }
        if (game.paused) { return; }

        game.physics.arcade.collide(colliding.a, colliding.b);
    }

    function onDown(pointer) {
        // Fullscreen
        game.paused = false;
        if (!game.scale.isFullScreen) {
            game.scale.startFullScreen(false);
            return;
        }

        if (controls.emitter && controls.emit) {
            controls.emitter.x = pointer.x;
            controls.emitter.y = pointer.y;

            controls.emitter.start(true, 3000, null, 2);
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
