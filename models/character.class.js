class Character extends MovableObject {
    height = 300;
    width = 130;
    y = 30;
    speed = 5;
    coins = 0;
    bottles = 0;

    offset = {
        top: 130,
        left: 40,
        right: 40,
        bottom: 15
    };
    
    images_Walking = [
        'img/2_character_pepe/2_walk/W-21.png',
        'img/2_character_pepe/2_walk/W-22.png',
        'img/2_character_pepe/2_walk/W-23.png',
        'img/2_character_pepe/2_walk/W-24.png',
        'img/2_character_pepe/2_walk/W-25.png',
        'img/2_character_pepe/2_walk/W-26.png'
    ];

    images_Jumping = [
        'img/2_character_pepe/3_jump/J-31.png',
        'img/2_character_pepe/3_jump/J-32.png',
        'img/2_character_pepe/3_jump/J-33.png',
        'img/2_character_pepe/3_jump/J-34.png',
        'img/2_character_pepe/3_jump/J-35.png',
        'img/2_character_pepe/3_jump/J-36.png',
        'img/2_character_pepe/3_jump/J-37.png',
        'img/2_character_pepe/3_jump/J-38.png',
        'img/2_character_pepe/3_jump/J-39.png'
    ];

    images_Idle = [
        'img/2_character_pepe/1_idle/idle/I-1.png',
        'img/2_character_pepe/1_idle/idle/I-2.png',
        'img/2_character_pepe/1_idle/idle/I-3.png',
        'img/2_character_pepe/1_idle/idle/I-4.png',
        'img/2_character_pepe/1_idle/idle/I-5.png',
        'img/2_character_pepe/1_idle/idle/I-6.png',
        'img/2_character_pepe/1_idle/idle/I-7.png',
        'img/2_character_pepe/1_idle/idle/I-8.png',
        'img/2_character_pepe/1_idle/idle/I-9.png',
        'img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    images_LongIdle = [
        'img/2_character_pepe/1_idle/long_idle/I-11.png',
        'img/2_character_pepe/1_idle/long_idle/I-12.png',
        'img/2_character_pepe/1_idle/long_idle/I-13.png',
        'img/2_character_pepe/1_idle/long_idle/I-14.png',
        'img/2_character_pepe/1_idle/long_idle/I-15.png',
        'img/2_character_pepe/1_idle/long_idle/I-16.png',
        'img/2_character_pepe/1_idle/long_idle/I-17.png',
        'img/2_character_pepe/1_idle/long_idle/I-18.png',
        'img/2_character_pepe/1_idle/long_idle/I-19.png',
        'img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    images_Dead = [
        'img/2_character_pepe/5_dead/D-51.png',
        'img/2_character_pepe/5_dead/D-52.png',
        'img/2_character_pepe/5_dead/D-53.png',
        'img/2_character_pepe/5_dead/D-54.png',
        'img/2_character_pepe/5_dead/D-55.png',
        'img/2_character_pepe/5_dead/D-56.png',
        'img/2_character_pepe/5_dead/D-57.png'
    ]

    images_Hurt = [
        'img/2_character_pepe/4_hurt/H-41.png',
        'img/2_character_pepe/4_hurt/H-42.png',
        'img/2_character_pepe/4_hurt/H-43.png'
    ]

    walking_sound = new Audio('./audio/running.mp3');
    jump_sound = new Audio('audio/jump.mp3');

    world;
    lastMoveTime;

    constructor() {
        super().loadImage('img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.images_Walking);
        this.loadImages(this.images_Jumping);
        this.loadImages(this.images_Idle);
        this.loadImages(this.images_LongIdle);
        this.loadImages(this.images_Dead);
        this.loadImages(this.images_Hurt);
        this.applyGravity();
        this.animate();
        this.move();
    }

    move() {
        this.setStopableInterval(() => {
            this.walking_sound.pause();
            this.moveToRight();
            this.moveToLeft();
            this.characterJump();
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60);
    }

    moveToRight() {
        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
            this.setLastMoveTime();

            if(this.world.audio) {
                this.walking_sound.play();
            }
        }
    }

    moveToLeft() {
        if(this.world.keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
            this.setLastMoveTime();

            if(this.world.audio) {
                this.walking_sound.play();
            }
        }
    }

    characterJump() {
        if(this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
            this.setLastMoveTime();
            if(this.world.audio) {
                this.jump_sound.play();
            }
        }
    }

    animate() {
        this.setStopableInterval(() => {
            if(this.isDead()) {
                this.playAnimation(this.images_Dead);
            } else if(this.isHurt()) {
                this.playAnimation(this.images_Hurt);
            } else if(this.isAboveGround()) {
                this.playAnimation(this.images_Jumping);
            } else if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                this.playAnimation(this.images_Walking);
            } else if(this.checkIdleTime()) {
                this.playAnimation(this.images_LongIdle);
            } else {
                this.playAnimation(this.images_Idle);
            }
        }, 100)
    }

    setLastMoveTime() {
        this.lastMoveTime = new Date().getTime();
    }

    checkIdleTime() {
        let idleTime = new Date().getTime() - this.lastMoveTime;
        idleTime = idleTime / 1000;
        return idleTime > 6;
    }
}