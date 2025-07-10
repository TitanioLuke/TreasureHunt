export default class Obstaculo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'spikes');
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // corpo estático
        this.setScale(2).refreshBody();
    }
}
