class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    lastThrowTime;
    Intervals = [];
    allIntervals = []
    gameOver = false;
    endFight = false;
    audio = true;


    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
        this.lastThrowTime = new Date().getTime();
    }

    setWorld() {
        this.character.world = this;
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
        });
    }

    setStopableInterval(fn, time) {
        let id = setInterval(fn, time);
        this.Intervals.push(id);
    }

    clearIntervals() {
        this.Intervals.forEach(clearInterval);
        this.character.clearIntervals();
    }

    run() {
        this.setStopableInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
            this.deleteThrowObject();
            this.chickenAttack();
            this.enemyDead();
            this.endbossFight();
            this.checkEnd();
        }, 1000 / 60);
    }

    lastThrow() {
        let timePassed = new Date().getTime() - this.lastThrowTime;
        timePassed = timePassed / 1000;
        return timePassed > 0.5;
    }

    checkThrowObjects() {
        if (this.keyboard.D == true && this.character.bottles > 0 && this.character.energy > 0&& !this.gameOver) {
            if (this.character.otherDirection && this.lastThrow()) {
                this.throwBottle('left')
            } else if (this.lastThrow()) {
                this.throwBottle('right')
            }
        }
    }

    throwBottle(direction) {
        let bottle;
        if (direction == 'right') {
            bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
        } else if (direction == 'left') {
            bottle = new ThrowableObject(this.character.x, this.character.y + 100, 'reverse');
        };
        this.throwableObjects.push(bottle);
        this.lastThrowTime = new Date().getTime();
        this.character.setLastMoveTime();
        this.character.bottles -= 10;
        this.level.statusBarBottle.setPercentage(this.character.bottles, this.level.statusBarBottle.Images_Bottle)
    }

    chickenAttack() {
        this.level.enemies.forEach((enemy) => {
            if (enemy.x - this.character.x < 400 && enemy.energy > 0) {
                enemy.rushAttack();
            }
        })
    }

    deleteThrowObject() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            if (this.throwableObjects[i].energy == 0 && !this.throwableObjects[i].deleted || !this.throwableObjects[i].isAboveGround() && !this.throwableObjects[i].deleted) {
                this.throwableObjects[i].deleted = true;
                setTimeout(() => {
                    if (this.throwableObjects[i].deleted) {
                        this.throwableObjects[i].clearIntervals()
                        this.throwableObjects.splice(i, 1)
                    }
                }, 200);
            }
        }
    }

    enemyDead() {
        for (let i = 0; i < this.level.enemies.length; i++) {
            if (this.level.enemies[i].energy == 0 && !this.level.enemies[i].deleted) {
                this.level.enemies[i].deleted = true;
                if (this.audio) {
                    this.level.enemies[i].chicken_sound.play();
                };
                setTimeout(() => {
                    if (this.level.enemies[i].deleted) {
                        this.level.enemies[i].clearIntervals();
                        this.level.enemies[i].chicken_sound.pause();
                        this.level.enemies.splice(i, 1)
                    }
                }, 1000);
            }
        }
    }

    endbossFight() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && this.character.x >= 1300 || enemy.activate) {
                if (enemy.energy > 0 && !enemy.isHurt()) {
                    enemy.run(this.character)
                }
                this.endFight = true;
                enemy.activate = true;
            }
        });
    }

    checkEnd() {
        this.checkIfCharacterDead();
        this.checkIfEndbossDead();
    }

    checkIfEndbossDead() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss && enemy.energy <= 0 && !this.gameOver && !this.character.energy == 0) {
                setTimeout(() => {
                    this.gameOver = true;
                    document.getElementById('gameOver').classList.remove('d-none');
                    this.clearIntervals();
                    this.character.walking_sound.pause();
                }, 1000);
            }
        })
    }

    checkIfCharacterDead() {
        if (this.character.energy <= 0 && !this.gameOver) {
            setTimeout(() => {
                this.gameOver = true;
                document.getElementById('lost').classList.remove('d-none');
                this.clearIntervals();
                this.character.walking_sound.pause();
            }, 500);
        }
    }

    checkCollisions() {
        if (!this.character.isHurt()) {
            this.level.enemies.forEach((enemy) => {
                this.collisionWithChicken(enemy);
                this.collisionWithEndboss(enemy)
            });
        };
        this.collisionWithCoin();
        this.collisionWithBottle();
        this.collisionWithThrowableObject();
    }

    collisionWithThrowableObject() {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(e => {
                this.bottleHitsEnemy(e, bottle);
                this.bottleHitsGround(bottle);
                this.bottleHitsEndboss(e)
            });
        });
    }

    bottleHitsEnemy(e, bottle) {
        if (e.isColliding(bottle) && bottle.energy > 0 && bottle.isAboveGround()) {
            e.hit(100);
            bottle.hit(100);
            if (this.audio) {
                bottle.bottle_sound.play();
            }
        };
    }

    bottleHitsGround(bottle) {
        if (!bottle.isAboveGround()) {
            bottle.speedX = 0;
            if (this.audio && bottle.energy > 0) {
                bottle.bottle_sound.play();
            }
        }
    }

    bottleHitsEndboss(e) {
        if (e instanceof Endboss) {
            this.level.statusBarEndboss.setPercentage(e.energy / 4.5, this.level.statusBarEndboss.Images_Health)
        }
    }

    collisionWithBottle() {
        for (let i = 0; i < this.level.bottles.length; i++) {
            let bottle = this.level.bottles[i];
            if (this.character.isColliding(bottle)) {
                this.level.bottles.splice(i, 1)
                this.character.bottles += 10;
                this.level.statusBarBottle.setPercentage(this.character.bottles, this.level.statusBarBottle.Images_Bottle);
            }
        }
    }

    collisionWithCoin() {
        for (let i = 0; i < this.level.coins.length; i++) {
            let coin = this.level.coins[i];
            coin.coin_sound.pause()
            if (this.character.isColliding(coin)) {
                coin.clearIntervals();
                this.level.coins.splice(i, 1)
                this.character.coins += 10;
                if (this.audio) {
                    coin.coin_sound.play();
                }
                this.level.statusBarCoin.setPercentage(this.character.coins, this.level.statusBarCoin.Images_Coins)
            }
        }
    }

    collisionWithChicken(enemy) {
        if (this.character.isColliding(enemy) && enemy.energy > 0 && !this.character.isAboveGround() && enemy instanceof Chicken) {
            this.character.hit(5);
            this.level.statusBar.setPercentage(this.character.energy, this.level.statusBar.Images_Health)
        }
        if (this.character.isColliding(enemy) && this.character.isAboveGround() && enemy instanceof Chicken && enemy.energy > 0) {
            enemy.energy -= 100;
            this.character.jump('low')
        }
    }

    collisionWithEndboss(enemy) {
        if (this.character.isColliding(enemy) && enemy.energy > 0 && enemy instanceof Endboss) {
            this.character.hit(20);
            this.level.statusBar.setPercentage(this.character.energy, this.level.statusBar.Images_Health)
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0)
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        if (!this.gameOver) {
            this.addToMap(this.character);
            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.coins);
            this.addObjectsToMap(this.level.bottles);
            this.addObjectsToMap(this.throwableObjects);
        };

        this.ctx.translate(-this.camera_x, 0);
        if (!this.gameOver) {
            this.addToMap(this.level.statusBar);
            this.addToMap(this.level.statusBarCoin);
            this.addToMap(this.level.statusBarBottle);
            if (this.endFight) {
                this.addToMap(this.level.statusBarEndboss);
            }
        }

        self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1
        this.ctx.restore();
    }
}