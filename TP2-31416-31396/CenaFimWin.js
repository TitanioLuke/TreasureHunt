export default class CenaFimWin extends Phaser.Scene {
    constructor() {
        super('CenaFimWin');
    }

    preload() {
        this.load.image('bg_win', 'assets/fim_vitoria.png'); 
    }

    create() {
        const largura = this.scale.width;
        const altura = this.scale.height;

        // Fundo
        this.add.image(largura / 2, altura / 2, 'bg_win').setDisplaySize(largura, altura);

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
