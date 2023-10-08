class Chicken extends MovableObject {

    y = 350;
    height = 80;
    width = 70;
    
    images_Walking = [
        'img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    image_Dead = 'img/3_enemies_chicken/chicken_normal/2_dead/dead.png';
    
    offset = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 5
    };

    chicken_sound = new Audio('audio/chicken.mp3');

    constructor() {
        super().loadImage('img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.images_Walking);
        this.x = 500 + Math.random() * 1200;
        this.speed = 0.15 + Math.random() * 0.25;
        this.applyGravity();
        this.animate();
        this.chickenRun();
    }

    chickenRun() {
        this.setStopableInterval(() => {
            this.moveLeft(this.speed); 
        }, 1000 / 60);
    }

    animate() {
        this.setStopableInterval(() => {
            if (this.energy <= 0) {
                this.loadImage(this.image_Dead);
                this.speed = 0;
            } else {
               this.playAnimation(this.images_Walking);
            }     
        }, 200);
    }   
}