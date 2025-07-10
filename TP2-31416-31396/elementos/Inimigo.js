export default class Inimigo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, spriteKey = 'enemy', velocidade = 60) {
        super(scene, x, y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2)
            .setVelocityX(velocidade)
            .setCollideWorldBounds(true)
            .setBounce(1);
        this.body.allowGravity = false;
        this.dano = spriteKey === 'enemy2' ? 1 : 2;
    }
}
