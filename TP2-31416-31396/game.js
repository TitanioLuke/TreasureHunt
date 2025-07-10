import CenaMenu from './CenaMenu.js';
import CenaJogo from './CenaJogo.js';
import CenaFimWin from './CenaFimWin.js';
import CenaFimGameOver from './CenaFimGameOver.js';

const largura = window.innerWidth;
const altura = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: largura,
    height: altura,
    scale: {
        mode: Phaser.Scale.RESIZE,  
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#1d1d1d',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: [CenaMenu, CenaJogo, CenaFimWin, CenaFimGameOver]
};

const game = new Phaser.Game(config);
