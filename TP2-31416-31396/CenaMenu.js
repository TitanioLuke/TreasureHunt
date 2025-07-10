export default class CenaMenu extends Phaser.Scene {
    constructor() {
        super('CenaMenu');
    }

    preload() {
        this.load.image('menu_bg', 'assets/menu_bg.png'); 
    }

    create() {
        const { width, height } = this.scale;

        // Fundo
        this.add.image(width / 2, height / 2, 'menu_bg').setOrigin(0.5).setDisplaySize(width, height);

        // Botão invisível START 
        const botaoComecar = this.add.rectangle(width * 0.80, height * 0.42, 250, 90, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

            botaoComecar.on('pointerdown', () => {
                this.scene.start('CenaJogo');
            });
            

        // Botão invisível QUIT 
        const botaoSair = this.add.rectangle(width * 0.80, height * 0.62, 250, 90, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        botaoSair.on('pointerdown', () => {
            window.close();

        });
    }
}
