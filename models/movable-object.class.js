class MovableObject extends DrawableObject {
    speed = 0.2;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    deleted = false;
    Intervals = [];
    world;

    offset = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    };

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject || this instanceof Chicken) {
            return this.y < 350;
        } else {
            return this.y < 130;
        }
    }

    setStopableInterval(fn, time) {
        let id = setInterval(fn, time);
        this.Intervals.push(id);
    }

    clearIntervals() {
        this.Intervals.forEach(clearInterval);
    }

    isColliding(mo) {
        return this.x + this.width - this.offset.right >= mo.x + mo.offset.left &&
            this.y + this.height - this.offset.bottom >= mo.y + mo.offset.top &&
            this.x + this.offset.left <= mo.x + mo.width - mo.offset.right &&
            this.y + this.offset.top <= mo.y + mo.height - mo.offset.bottom;
    }

    hit(value) {
        this.energy -= value;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    isDead() {
        return this.energy == 0;
    }

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight(speed) {
        if (speed) {
            this.speed = speed;
        }
        this.x += this.speed;
    }

    moveLeft(speed) {
        if (speed) {
            this.speed = speed;
        }
        this.x -= this.speed;
    }

    jump(low) {
        if (low) {
            this.speedY = 20;
        } else {
            this.speedY = 35;
        }
    }

    rushAttack() {
        this.speed = 3;
        if (!this.isAboveGround()) {
            this.jump('low'); 
        }        
    }
}