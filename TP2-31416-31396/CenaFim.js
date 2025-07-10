export default class CenaFim extends Phaser.Scene {
    constructor() {
        super('CenaFim');
    }

    init(data) {
        this.venceu = data.venceu;
    }

    create() {
        const msg = this.venceu ? 'Parabéns! Venceste!' : 'Game Over!';
        this.add.text(300, 200, msg, { fontSize: '32px', fill: '#fff' });

        const botao = this.add.text(300, 300, ' Recomeçar Jogo', {
            fontSize: '24px',
            fill: '#00ff00',
            backgroundColor: '#000',
            padding: { x: 10, y: 5 }
        }).setInteractive();

        botao.on('pointerdown', () => {
            this.scene.start('CenaJogo');
        });
    }
}
