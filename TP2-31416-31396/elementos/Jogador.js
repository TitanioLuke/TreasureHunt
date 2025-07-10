export default class Jogador extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setScale(2).setBounce(0.1).setCollideWorldBounds(true);

        // Inicialização dos poderes
        this.velocidadeExtra = 0;
        this.superSaltoAtivo = false;
        this.escudoAtivo = false;
        this.poderAtivo = null;
        this.tempoPoder = 0;
    }

    mover(cursors, keys) {
        const velocidadeBase = 160;
        const velocidade = velocidadeBase + this.velocidadeExtra;

        if (cursors.left.isDown || keys.left.isDown) {
            this.setVelocityX(-velocidade);
            this.setTexture('player2');
        } else if (cursors.right.isDown || keys.right.isDown) {
            this.setVelocityX(velocidade);
            this.setTexture('player2');
        } else {
            this.setVelocityX(0);
            this.setTexture('player1');
        }

        const saltoNormal = -420;
        const saltoPotente = -620;
        const impulso = this.superSaltoAtivo ? saltoPotente : saltoNormal;

        if ((cursors.up.isDown || keys.up.isDown || keys.space.isDown) && this.body.blocked.down) {
            this.setVelocityY(impulso);
        }
    }
}
