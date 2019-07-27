/**
 * 加载界面
 * @author Card1ac(Autism_Ka) 2019.7.22
 */

let yellowProgress, progressText
game.States.preload = function () {
  this.preload = function () {
    this.game.add.sprite(game.world.centerX - 157.5, game.world.centerY - 20, 'loading_blue')
    yellowProgress = game.add.sprite(game.world.centerX - 157.5, game.world.centerY - 20, 'loading_yellow')
    progressText = game.add.text(game.world.centerX, game.world.centerY + 50, '0%', {
      fontSize: '40px',
      fill: '#000000'
    })
    progressText.anchor.setTo(0.5)
    game.load.crossOrigin = 'anonymous'
    game.load.setPreloadSprite(yellowProgress)
    game.load.onFileComplete.add(loadingProgress)

    game.load.image('bg', './res/images/backgroup.gif')
    game.load.image('loginBtn', './res/images/loginBtn.png')
    game.load.image('registerBtn', './res/images/registerBtn.png')
    game.load.image('loginDialog', './res/images/loginDialog.png')
    game.load.image('logo', './res/images/logo.png')
    game.load.image('createRoomBtn', './res/images/createRoom.png')
    game.load.image('joinRoomBtn', './res/images/joinRoom.png')
    game.load.image('mask', './res/images/headBg.png')
    game.load.image('startBtn', './res/images/startBtn.png')
    game.load.image('readyBtn', './res/images/readyBtn.png')
    game.load.image('quitBtn', './res/images/quitBtn.png')
    game.load.image('chatBubble', './res/images/chatBubble.png')
    game.load.image('arrow', './res/images/arrow.png')
    game.load.image('arrowBtn', './res/images/arrowBtn.png')
    game.load.image('chatPanel', './res/images/chatPanel.png')
    game.load.image('cuiBtn', './res/images/cuiBtn.png')
    game.load.image('biecuiBtn', './res/images/biecuiBtn.png')
    game.load.image('chaoBtn', './res/images/chaoBtn.png')
    game.load.image('chatBtn', './res/images/chatBtn.png')

    game.load.spritesheet('black', './res/images/blackNew.png', 30, 30)
    game.load.spritesheet('white', './res/images/whiteNew.png', 30, 30)

    game.load.audio('voice_1', './res/media/cui.mp3')
    game.load.audio('voice_2', './res/media/biecui.mp3')
    game.load.audio('voice_3', './res/media/xiao.mp3')

    game.load.audio('bgm', './res/media/bgm.mp3')
    game.load.audio('down', './res/media/down.mp3')
    game.load.audio('click', './res/media/click.wav')
  }
  this.create = function () {
    game.state.start('login')
  }

  function loadingProgress (progress) {
    progressText.text = progress + '%'
  }
}