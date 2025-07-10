export default class CenaFimGameOver extends Phaser.Scene {
    constructor() {
        super('CenaFimGameOver');
    }

    preload() {
        this.load.image('fundo_gameover', 'assets/fim_derrota.png');
    }

    create() {
        this.add.image(0, 0, 'fundo_gameover')
            .setOrigin(0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // Botão invisível RECOMEÇAR 
        const btnRecomecar = this.add.rectangle(450, 650, 420, 100, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('CenaJogo');
            });

        // Botão invisível VOLTAR 
        const btnVoltar = this.add.rectangle(1050, 650, 420, 100, 0x000000, 0)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.start('CenaMenu');
            });
    }
}
