
export default class InimigoVoador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy3');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setScale(2);
        this.play('voar');
        this.dano = 1;
        this.velocidade = 60;
    }

    seguirJogador(jogador) {
        const dx = jogador.x - this.x;
        const dy = jogador.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 400) {
            this.body.setVelocity(dx * 0.6, dy * 0.6);
        } else {
            this.body.setVelocity(0);
        }
    }
}
