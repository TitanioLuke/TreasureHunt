export default class PowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'coracao');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
    }
}
