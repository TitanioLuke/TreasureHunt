// CenaJogo.js
import Jogador from '../elementos/Jogador.js';
import Inimigo from '../elementos/Inimigo.js';
import Obstaculo from '../elementos/Obstaculo.js';
import PowerUp from '../elementos/PowerUp.js';
import InimigoVoador from '../elementos/InimigoVoador.js';


export default class CenaJogo extends Phaser.Scene {
    constructor() {
        super('CenaJogo');
        this.pontuacao = 0;
        this.vida = 5;
        this.vidaMaxima = 10;
        this.tempoInicial = 0;
        this.chaveApanhada = false;
    }

    preload() {
        this.load.image('player1', 'assets/player1.png');
        this.load.image('player2', 'assets/player2.png');
        this.load.image('tesouro', 'assets/tesouro.png');
        this.load.image('spikes', 'assets/spikes.png');
        this.load.image('enemy', 'assets/enemy.png');
        this.load.image('enemy2', 'assets/enemy2.png');
        this.load.image('chao_esquerda', 'assets/chao_esquerda.png');
        this.load.image('chao_meio', 'assets/chao_meio.png');
        this.load.image('chao_direita', 'assets/chao_direita.png');
        this.load.image('ceu', 'assets/ceu.png');
        this.load.image('coracao_cheio', 'assets/coracao_cheio.png');
        this.load.image('coracao_vazio', 'assets/coracao_vazio.png');
        this.load.image('coracao', 'assets/coracao.png');
        this.load.image('caixa', 'assets/caixa.png');
        this.load.image('chave', 'assets/chave.png');
        this.load.image('surpresa', 'assets/surpresa.png');
        this.load.audio('som_tesouro', 'assets/som_tesouro.mp3');
        this.load.audio('som_dano', 'assets/damage.mp3');
        this.load.audio('som_vida', 'assets/vida.mp3');
        this.load.audio('som_chave', 'assets/chave.mp3');
        this.load.audio('musica_fundo', 'assets/musica_fundo.mp3');
        this.load.audio('som_surpresa', 'assets/surpresa.mp3');
        this.load.spritesheet('enemy3', 'assets/enemy3.png', {
            frameWidth: 32,
            frameHeight: 32
        });
        


    }

    create() {
        

        this.anims.create({
            key: 'voar',
            frames: this.anims.generateFrameNumbers('enemy3', { start: 0, end: 2 }),
            frameRate: 6,
            repeat: -1
        });
        

        this.iniciarContadorTempo = false;
        this.tempoInicial = 0;

        this.time.delayedCall(100, () => {
            this.iniciarContadorTempo = true;
            this.tempoInicial = this.time.now;
        });
        
        this.musicaFundo = this.sound.add('musica_fundo', {
            loop: true,
            volume: 0.4
        });
        this.musicaFundo.setScrollFactor?.(0); // segurança
        this.musicaFundo.play();
        
        this.txtContagemPoder = this.add.text(16, 100, '', {
            fontSize: '18px',
            fill: '#ffff00'
        }).setScrollFactor(0).setVisible(false);
        

        const altura = this.scale.height;
        const larguraMundo = 6000;
        this.pontuacao = 0;
        this.vida = 5;
        this.invencivel = false;
        this.tempoInicial = this.time.now;

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE
        });
        this.cursors = this.input.keyboard.createCursorKeys();

        this.somTesouro = this.sound.add('som_tesouro');
        this.somDano = this.sound.add('som_dano');
        this.somVida = this.sound.add('som_vida');
        this.somChave = this.sound.add('som_chave');
        this.somSurpresa = this.sound.add('som_surpresa', { volume: 2 }); 



        this.physics.world.setBounds(0, 0, larguraMundo, altura);
        this.cameras.main.setBounds(0, 0, larguraMundo, altura);

        this.add.tileSprite(0, 0, larguraMundo, altura, 'ceu')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(-1);

        this.plataformas = this.physics.add.staticGroup();
        const blocoLargura = 36;
        for (let x = 0; x <= larguraMundo; x += blocoLargura) {
            this.plataformas.create(x, altura - 36, 'chao_meio')
                .setOrigin(0, 0).setScale(2).refreshBody();
        }

        [[300, altura - 100], [600, altura - 180], [900, altura - 120],
         [1300, altura - 180], [1700, altura - 140], [2000, altura - 220],
         [2300, altura - 100], [2700, altura - 160], [3100, altura - 200],
         [3500, altura - 150], [3900, altura - 240], [4200, altura - 180],
         [4600, altura - 120], [4900, altura - 180], [5100, altura - 260], [5300, altura - 200],
         [5500, altura - 220], [5700, altura - 300], [5900, altura - 160]].forEach(([x, y]) => {
            this.plataformas.create(x, y, 'chao_esquerda').setScale(2).refreshBody();
            this.plataformas.create(x + 36, y, 'chao_direita').setScale(2).refreshBody();
        });

        this.jogador = new Jogador(this, 100, altura - 150);
        this.physics.add.collider(this.jogador, this.plataformas);
        this.cameras.main.startFollow(this.jogador, true, 0.1, 0.1);

        this.txtPoder = this.add.text(16, 100, '', { fontSize: '18px', fill: '#ffff00' }).setScrollFactor(0).setVisible(false);

        this.caixasSurpresa = this.physics.add.staticGroup();
        const poderes = ['velocidade', 'iman', 'salto', 'escudo', 'velocidade', 'escudo'];
        const posCaixas = [
            [850, altura - 200],
            [2300, altura - 300],
            [3600, altura - 250],
            [4100, altura - 250],
            [5000, altura - 250], // nova caixa velocidade
            [5600, altura - 250]  // nova caixa escudo
        ];
    
        posCaixas.forEach(([x, y], i) => {
            const caixa = this.caixasSurpresa.create(x, y, 'surpresa').setScale(2).refreshBody();
            caixa.poder = poderes[i];
        });

        this.physics.add.collider(this.jogador, this.caixasSurpresa, (j, c) => {
            if (j.body.touching.up && c.body.touching.down) {
                this.ativarPoder(c.poder);
                this.somSurpresa.play();
                this.caixasSurpresa.remove(c, true, true);
            }
        });

        this.tesouros = this.physics.add.group();
        const posTesouros = [
            [400, altura - 60], [800, altura - 60], [1300, altura - 230],
            [1800, altura - 180], [2300, altura - 150], [2700, altura - 250],
            [3100, altura - 60], [3500, altura - 300], [3900, altura - 320],
            [4300, altura - 150], [4600, altura - 220], [4800, altura - 100], [5000, altura - 140], [5200, altura - 200],
            [5400, altura - 240], [5600, altura - 150], [5800, altura - 180]
        ];
        posTesouros.forEach(([x, y]) => {
            const t = this.tesouros.create(x, y, 'tesouro').setScale(2);
            if (y < altura - 150) t.body.allowGravity = false;
        });
        this.physics.add.collider(this.tesouros, this.plataformas);
        this.physics.add.overlap(this.jogador, this.tesouros, this.recolherTesouro, null, this);

        this.espinhos = this.physics.add.staticGroup();
        [600, 1100, 1500, 1900, 2800, 3600, 4100, 4950, 5150, 5450, 5750].forEach(x => this.espinhos.add(new Obstaculo(this, x, altura - 48)));
        this.physics.add.overlap(this.jogador, this.espinhos, () => this.perderVida(2), null, this);

        this.inimigos1 = this.add.group();
        [400, 700, 1000, 1200, 3000, 3400].forEach(x => {
            const inimigo = new Inimigo(this, x, altura - 100, 'enemy', 60);
            this.physics.add.existing(inimigo);
            this.inimigos1.add(inimigo);
        });
        this.physics.add.collider(this.inimigos1, this.plataformas);
        this.physics.add.overlap(this.jogador, this.inimigos1, (j, i) => this.perderVida(i.dano), null, this);

        this.inimigos2 = this.add.group();
        [1800, 2000, 2500, 3200, 3900].forEach(x => {
            const inimigo = new Inimigo(this, x, altura - 100, 'enemy2', 80);
            this.physics.add.existing(inimigo);
            this.inimigos2.add(inimigo);
        });
        this.physics.add.collider(this.inimigos2, this.plataformas);
        this.physics.add.overlap(this.jogador, this.inimigos2, (j, i) => this.perderVida(i.dano), null, this);

        this.inimigos3 = this.physics.add.group();
        const posicoes = [
            [4950, altura - 100],
            [5150, altura - 200],
            [5350, altura - 200],
            [5550, altura - 150],
            [5750, altura - 180]
        ];
        posicoes.forEach(([x, y]) => {
            const inimigo = new InimigoVoador(this, x, y);
            this.inimigos3.add(inimigo);
        });
        this.physics.add.collider(this.inimigos3, this.plataformas);
        this.physics.add.overlap(this.jogador, this.inimigos3, (jogador, inimigo) => {
            this.perderVida(inimigo.dano);
            inimigo.destroy();
        });

        this.coracoes = this.physics.add.staticGroup();
        [
            [500, altura - 80], [1000, altura - 200], [1600, altura - 240],
            [2000, altura - 180], [2400, altura - 140], [2800, altura - 200],
            [3500, altura - 300], [3900, altura - 270], [4100, altura - 180],
            [4400, altura - 220],     [5000, altura - 200], [5300, altura - 250], [5700, altura - 220]
        ].forEach(([x, y]) => this.coracoes.create(x, y, 'coracao').setScale(2).refreshBody());
        this.physics.add.overlap(this.jogador, this.coracoes, this.apanharCoracao, null, this);

        this.caixa = this.physics.add.staticImage(larguraMundo - 100, altura - 100, 'caixa').setScale(2);
        this.chave = this.physics.add.staticImage(larguraMundo - 150, altura - 180, 'chave').setScale(2);
        this.chave.setVisible(false);
        this.chave.body.enable = false;

        this.physics.add.overlap(this.jogador, this.chave, () => {
            this.chaveApanhada = true;
            this.chave.setVisible(false);
            this.chave.body.enable = false;
            this.somChave.play();
        });

        this.physics.add.overlap(this.jogador, this.caixa, () => {
            if (this.chaveApanhada) {
                if (this.musicaFundo && this.musicaFundo.isPlaying) {
                    this.musicaFundo.stop();
                }
                this.scene.start('CenaFimWin', { venceu: true });
            }
        });

        this.vidaUI = this.add.group();
        this.atualizarHUD();

        this.txtPontuacao = this.add.text(16, 50, 'Pontuação: 0', { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);
        this.txtTimer = this.add.text(16, 75, 'Tempo: 0s', { fontSize: '18px', fill: '#fff' }).setScrollFactor(0);
    }

    update() {

        this.inimigos3?.getChildren().forEach(inimigo => {
            inimigo.seguirJogador(this.jogador);
        });

        
        if (this.jogador.y > this.scale.height) this.morrer();
        this.jogador.mover(this.cursors, this.keys);
    
        if (this.iniciarContadorTempo) {
            const tempoAtual = Math.floor((this.time.now - this.tempoInicial) / 1000);
            this.txtTimer.setText('Tempo: ' + tempoAtual + 's');
        }
        
        if (this.jogador.poderAtivo) {
            const restante = Math.ceil((this.jogador.tempoPoder - this.time.now) / 1000);
        
            const nomeFormatado = {
                'salto': 'Super Salto',
                'velocidade': 'Velocidade Extra',
                'escudo': 'Escudo',
                'iman': 'Atrair Diamantes'
            }[this.jogador.poderAtivo] || this.jogador.poderAtivo;
        
            this.txtContagemPoder.setText('Poder: ' + nomeFormatado + ' (' + restante + 's)')
                .setVisible(true);
        } else {
            this.txtContagemPoder.setVisible(false);
        }
        
    
        if (this.tesouros.countActive(true) === 0 && !this.chave.visible && !this.chaveApanhada) {
            this.chave.setVisible(true);
            this.chave.body.enable = true;
        }
    

        if (this.jogador.poderAtivo === 'iman') {
            this.tesouros.getChildren().forEach(t => {
                if (!t.active) return;
                const dx = this.jogador.x - t.x;
                const dy = this.jogador.y - t.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 200) {
                    const força = 200 / dist;
                    t.body.velocity.x = dx * força;
                    t.body.velocity.y = dy * força;
                }
            });
        }
    

        if (this.jogador.poderAtivo && this.time.now >= this.jogador.tempoPoder) {
            this.jogador.poderAtivo = null;
            this.jogador.velocidadeExtra = 0;
            this.jogador.superSaltoAtivo = false;
            this.jogador.escudoAtivo = false;
            this.jogador.clearTint();
            this.txtPoder.setVisible(false);
    
            // parar movimento dos tesouros atraídos
            this.tesouros.getChildren().forEach(t => {
                if (t.body) t.setVelocity(0);
            });
        }
    }
    
    
    ativarPoder(tipo) {
        this.jogador.poderAtivo = tipo;
        this.jogador.tempoPoder = this.time.now + 10000;
    
        if (tipo === 'velocidade') {
            this.jogador.velocidadeExtra = 120;
            this.jogador.setTint(0xff8800); // laranja
        } else if (tipo === 'salto') {
            this.jogador.superSaltoAtivo = true;
            this.jogador.setTint(0x00ff00); // verde
        } else if (tipo === 'escudo') {
            this.jogador.escudoAtivo = true;
            this.jogador.setTint(0x00ffff); // azul claro
        } else if (tipo === 'iman') {
            this.jogador.setTint(0xffff00); // amarelo
        }
    
        this.txtPoder.setVisible(true);
    }
    
    recolherTesouro(jogador, tesouro) {
        tesouro.disableBody(true, true);
        this.somTesouro.play();
        this.pontuacao += 10;
        this.txtPontuacao.setText('Pontuação: ' + this.pontuacao);
    }

    apanharCoracao(j, coracao) {
        coracao.disableBody(true, true);
        this.vida = Math.min(this.vida + 1, this.vidaMaxima);
        this.somVida.play();
        this.atualizarHUD();
    }

    perderVida(valor) {
        if (this.invencivel || this.jogador.escudoAtivo) return;
        this.vida -= valor;
        this.somDano.play();
        this.atualizarHUD();
        this.invencivel = true;
        this.jogador.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            this.invencivel = false;
        
            if (this.jogador.poderAtivo === 'velocidade') {
                this.jogador.setTint(0xff8800); // laranja
            } else if (this.jogador.poderAtivo === 'salto') {
                this.jogador.setTint(0x00ff00); // verde
            } else if (this.jogador.poderAtivo === 'escudo') {
                this.jogador.setTint(0x00ffff); // azul claro
            } else if (this.jogador.poderAtivo === 'iman') {
                this.jogador.setTint(0xffff00); // amarelo
            } else {
                this.jogador.clearTint(); // sem poder ativo
            }
        });
        
        if (this.vida <= 0) {
            this.morrer();
        }
        
    }

    atualizarHUD() {
        this.vidaUI.clear(true, true);
        for (let i = 0; i < this.vidaMaxima; i++) {
            const tipo = i < this.vida ? 'coracao_cheio' : 'coracao_vazio';
            this.vidaUI.add(this.add.image(16 + i * 32, 16, tipo).setScrollFactor(0));
        }
    }

    morrer() {
        if (this.musicaFundo && this.musicaFundo.isPlaying) {
            console.log("Parando música...");
            this.musicaFundo.stop();
        }
        this.scene.start('CenaFimGameOver', { venceu: false });
    }
    
}
