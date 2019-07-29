/**
 * 主游戏界面
 * @author Card1ac(Autism_Ka) 2019.7.22
 */
//游戏变量
let bg, mask, roomNumText, pingText, player_1_text, player_2_text, movingText, player_1 = {}, player_2 = {}, startBtn,
  readyBtn, quitBtn, readyText, disconnectText = [], whiteDisplay = [], blackDisplay = [], downSound, whiteChess = [],
  blackChess = [], bk = 0, wk = 0, player_1_scoreText, player_2_scoreText, player_1_levelText, player_2_levelText,
  chatBubble_1, chatBubble_2, chatText_1, chatText_2, chatTween_1, chatTween_2, panelTween_down, panelTween_up,
  arrowLoopTween, arrowRotationDownTween, arrowRotationUpTween, panel, arrow, arrowBtn, cuiBtn, biecuiBtn, chatBtn,
  chaoBtn, cuiVoice,
  biecuiVoice, chaoVoice,
  isDown = false
//事件变量
let netUpdatePingSignal, netShowNameSignal, netClearNameSignal, netQuitRoomSignal, netShowButtonSignal, netReadySignal,
  netStartGameSignal, netChangeMovingTextSignal, netChessDownSignal, netUpdateChessSignal, netReconnectSignal,
  netDisconnectSignal, netClearDisconnectTextSignal, netWinSignal, netUpdateScoreSignal, netChatSignal, netVoiceSignal
//创建二维数组 0为无子 1为黑子 2为白子 棋盘为15*15的格子
// let chessboard =
//   [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  //1
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //4
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //5
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //7
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //11
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
//     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]] //15
game.States.game = function () {
  this.preload = function () {

  }
  this.create = function () {
    //手机棋盘适配
    if (!isDesktop) {
      game.scale.setGameSize(540, 880)
    }
    //一些游戏元素创建
    bg = game.add.sprite(0, 40, 'bg')
    mask = game.add.tileSprite(0, 0, 700, 40, 'mask')
    clickSound = game.add.audio('click')
    downSound = game.add.audio('down')
    cuiVoice = game.add.audio('voice_1')
    biecuiVoice = game.add.audio('voice_2')
    chaoVoice = game.add.audio('voice_3')
    roomNumText = game.add.text(game.world.width / 2, 25, '房间号：' + roomNum, {
      fontSize: '20px',
      fill: '#ffffff',
      align: 'center'
    })
    roomNumText.anchor.setTo(0.5)
    pingText = game.add.text(game.world.width - 100, 25, 'Ping:0 ms', {
      fontSize: '20px',
      fill: '#00bf20'
    })
    pingText.anchor.setTo(0.5)
    //创建事件
    netUpdatePingSignal = new Phaser.Signal()
    netShowNameSignal = new Phaser.Signal()
    netClearNameSignal = new Phaser.Signal()
    netQuitRoomSignal = new Phaser.Signal()
    netShowButtonSignal = new Phaser.Signal()
    netReadySignal = new Phaser.Signal()
    netStartGameSignal = new Phaser.Signal()
    netChangeMovingTextSignal = new Phaser.Signal()
    netChessDownSignal = new Phaser.Signal()
    netUpdateChessSignal = new Phaser.Signal()
    netReconnectSignal = new Phaser.Signal()
    netDisconnectSignal = new Phaser.Signal()
    netClearDisconnectTextSignal = new Phaser.Signal()
    netWinSignal = new Phaser.Signal()
    netUpdateScoreSignal = new Phaser.Signal()
    netChatSignal = new Phaser.Signal()
    netVoiceSignal = new Phaser.Signal()
    //添加事件监听
    netUpdatePingSignal.add(netUpdatePing, this)
    netShowNameSignal.add(netShowName, this)
    netClearNameSignal.add(netClearName, this)
    netQuitRoomSignal.add(netQuitRoom, this)
    netShowButtonSignal.add(newShowButton, this)
    netReadySignal.add(netReady, this)
    netStartGameSignal.add(netStartGame, this)
    netChangeMovingTextSignal.add(netChangeMovingText, this)
    netChessDownSignal.add(netChessDown, this)
    netUpdateChessSignal.add(netUpdateChess, this)
    netReconnectSignal.add(netReconnect, this)
    netDisconnectSignal.add(netDisconnect, this)
    netClearDisconnectTextSignal.add(netClearDisconnectText, this)
    netWinSignal.add(netWin, this)
    netUpdateScoreSignal.add(netUpdateScore, this)
    netChatSignal.add(netChat, this)
    netVoiceSignal.add(netVoice, this)
    //进房间请求房间信息消息
    socket.emit('room_inf', {
      roomId: roomNum
    })
    //执行方法
    createText()
    //创建下拉面板的缓动动画
    game.add.tween(chatBubble_1).to({alpha: 1}, 500, 'Linear', false, 0).yoyo(true, 3000)
    panelTween_down = game.add.tween(panel).to({y: 0}, 500, 'Sine.easeInOut', false, 0)
    panelTween_up = game.add.tween(panel).to({y: -271}, 500, 'Sine.easeInOut', false, 0)
    arrowLoopTween = game.add.tween(arrow).to({y: 25}, 500, 'Linear', true, 0, -1).yoyo(true, 100)
    arrowRotationDownTween = game.add.tween(arrow).to({angle: 180}, 500, 'Sine.easeInOut', false, 0)
    arrowRotationUpTween = game.add.tween(arrow).to({angle: 0}, 500, 'Sine.easeInOut', false, 0)
    //启动bg点击事件
    bg.inputEnabled = true
    bg.events.onInputDown.add(clickBg)
    bg.inputEnabled = false
  }

  //创建固定的UI
  function createText () {
    //根据不同的设备来创建不同的位置的UI
    if (isDesktop) {
      pcUI()
    } else {
      mobileUI()
    }
  }

  //电脑端棋盘UI
  function pcUI () {
    //玩家信息
    game.add.text(620, 100, '玩家1', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    game.add.text(620, 250, '玩家2', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    game.add.text(620, 400, '行动方', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    player_1_text = game.add.text(620, 140, '', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    player_1_text.anchor.setTo(0.5)
    player_2_text = game.add.text(620, 290, '待加入...', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    player_2_text.anchor.setTo(0.5)
    movingText = game.add.text(620, 450, '', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    movingText.anchor.setTo(0.5)
    //分数/称号
    player_1_scoreText = game.add.text(570, 170, '分数：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_1_levelText = game.add.text(570, 190, '称号：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_1_scoreText.visible = false
    player_1_levelText.visible = false

    player_2_scoreText = game.add.text(570, 320, '分数：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_2_levelText = game.add.text(570, 340, '称号：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_2_scoreText.visible = false
    player_2_levelText.visible = false
    //创建聊天气泡
    chatBubble_1 = game.add.sprite(420, 70, 'chatBubble')
    chatBubble_2 = game.add.sprite(420, 220, 'chatBubble')
    chatText_1 = game.add.text(chatBubble_1.width / 2 - 5, chatBubble_1.height / 2 + 3, '', {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center'
    })
    chatBubble_1.addChild(chatText_1)
    chatText_1.anchor.setTo(0.5)
    chatText_2 = game.add.text(chatBubble_2.width / 2 - 5, chatBubble_2.height / 2 + 3, '', {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center'
    })
    chatBubble_2.addChild(chatText_2)
    chatText_2.anchor.setTo(0.5)
    chatTween_1 = game.add.tween(chatBubble_1).to({alpha: 1}, 500, 'Linear', false, 0).yoyo(true, 3000)
    chatTween_2 = game.add.tween(chatBubble_2).to({alpha: 1}, 500, 'Linear', false, 0).yoyo(true, 3000)
    chatBubble_1.alpha = 0
    chatBubble_2.alpha = 0
    //创建下拉面板
    panel = game.add.sprite(0, -271, 'chatPanel')
    arrowBtn = game.add.button(0, panel.height, 'arrowBtn', clickHandler, this)
    panel.addChild(arrowBtn)
    arrow = game.add.sprite(arrowBtn.width / 2, arrowBtn.height / 2, 'arrow')
    arrow.anchor.setTo(0.5)
    arrowBtn.addChild(arrow)
    cuiBtn = game.add.button(panel.width / 2, panel.height / 2 - 80, 'cuiBtn', clickHandler, this)
    cuiBtn.anchor.setTo(0.5)
    biecuiBtn = game.add.button(panel.width / 2, panel.height / 2 - 30, 'biecuiBtn', clickHandler, this)
    biecuiBtn.anchor.setTo(0.5)
    chaoBtn = game.add.button(panel.width / 2, panel.height / 2 + 20, 'chaoBtn', clickHandler, this)
    chaoBtn.anchor.setTo(0.5)
    chatBtn = game.add.button(panel.width / 2, panel.height / 2 + 70, 'chatBtn', clickHandler, this)
    chatBtn.anchor.setTo(0.5)

    cuiBtn.onInputDown.add(function () {
      cuiBtn.scale.set(0.9)
    }, this)
    cuiBtn.onInputUp.add(function () {
      cuiBtn.scale.set(1)
    }, this)
    biecuiBtn.onInputDown.add(function () {
      biecuiBtn.scale.set(0.9)
    }, this)
    biecuiBtn.onInputUp.add(function () {
      biecuiBtn.scale.set(1)
    }, this)
    chaoBtn.onInputDown.add(function () {
      chaoBtn.scale.set(0.9)
    }, this)
    chaoBtn.onInputUp.add(function () {
      chaoBtn.scale.set(1)
    }, this)
    chatBtn.onInputDown.add(function () {
      chatBtn.scale.set(0.9)
    }, this)
    chatBtn.onInputUp.add(function () {
      chatBtn.scale.set(1)
    }, this)
    panel.addChild(cuiBtn)
    panel.addChild(biecuiBtn)
    panel.addChild(chaoBtn)
    panel.addChild(chatBtn)
    panel.inputEnabled = true
    panel.input.priorityID = 3 //点击优先级，用来避免点到面板还下棋
    cuiBtn.input.priorityID = 4
    chatBtn.input.priorityID = 4
    biecuiBtn.input.priorityID = 4
    chaoBtn.input.priorityID = 4
    arrowBtn.input.priorityID = 4
    //棋子展示
    whiteDisplay[0] = game.add.sprite(570, 95, 'white')
    whiteDisplay[1] = game.add.sprite(570, 245, 'white')
    blackDisplay[0] = game.add.sprite(570, 95, 'black')
    blackDisplay[1] = game.add.sprite(570, 245, 'black')
    whiteDisplay[0].anchor.setTo(0.5)
    whiteDisplay[1].anchor.setTo(0.5)
    blackDisplay[0].anchor.setTo(0.5)
    blackDisplay[1].anchor.setTo(0.5)
    whiteDisplay[0].animations.add('white', [0], 1, true)
    whiteDisplay[1].animations.add('white', [0], 1, true)
    blackDisplay[0].animations.add('black', [0], 1, true)
    blackDisplay[1].animations.add('black', [0], 1, true)
    blackDisplay[0].play('black')
    blackDisplay[1].play('black')
    whiteDisplay[0].play('white')
    whiteDisplay[1].play('white')
    whiteDisplay[0].visible = false
    whiteDisplay[1].visible = false
    blackDisplay[0].visible = false
    blackDisplay[1].visible = false
    //准备信息
    readyText = game.add.text(620, 370, '未准备', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    readyText.anchor.setTo(0.5)
    readyText.visible = false
    //掉线信息
    disconnectText[0] = game.add.text(620, 220, '已掉线', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    disconnectText[0].anchor.setTo(0.5)
    disconnectText[1] = game.add.text(620, 370, '已掉线', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    disconnectText[1].anchor.setTo(0.5)
    disconnectText[0].visible = false
    disconnectText[1].visible = false
    //按钮显示
    startBtn = game.add.button(620, 500, 'startBtn', clickHandler, this)
    readyBtn = game.add.button(620, 500, 'readyBtn', clickHandler, this)
    quitBtn = game.add.button(620, 550, 'quitBtn', clickHandler, this)
    startBtn.anchor.setTo(0.5)
    readyBtn.anchor.setTo(0.5)
    quitBtn.anchor.setTo(0.5)
    startBtn.onInputDown.add(function () {
      startBtn.scale.set(0.9)
    }, this)
    startBtn.onInputUp.add(function () {
      startBtn.scale.set(1)
    }, this)
    readyBtn.onInputDown.add(function () {
      readyBtn.scale.set(0.9)
    }, this)
    readyBtn.onInputUp.add(function () {
      readyBtn.scale.set(1)
    }, this)
    quitBtn.onInputDown.add(function () {
      quitBtn.scale.set(0.9)
    }, this)
    quitBtn.onInputUp.add(function () {
      quitBtn.scale.set(1)
    }, this)
    readyBtn.visible = false
    startBtn.visible = false
  }

  //移动端棋盘UI
  function mobileUI () {
    //玩家信息
    game.add.text(250, 620, '玩家1', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    game.add.text(250, 720, '玩家2', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    game.add.text(450, 620, '行动方', {
      fontSize: '22px',
      fill: '#000',
      align: 'center'
    }).anchor.setTo(0.5)
    player_1_text = game.add.text(250, 650, '', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    player_1_text.anchor.setTo(0.5)
    player_2_text = game.add.text(250, 750, '待加入...', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    player_2_text.anchor.setTo(0.5)
    movingText = game.add.text(450, 670, '', {
      fontSize: '16px',
      fill: '#0056ff',
      align: 'center'
    })
    movingText.anchor.setTo(0.5)
    //分数/称号
    player_1_scoreText = game.add.text(220, 660, '分数：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_1_levelText = game.add.text(220, 680, '称号：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_1_scoreText.visible = false
    player_1_levelText.visible = false

    player_2_scoreText = game.add.text(220, 760, '分数：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_2_levelText = game.add.text(220, 780, '称号：', {
      fontSize: '14px',
      fill: '#000',
    })
    player_2_scoreText.visible = false
    player_2_levelText.visible = false
    //创建聊天气泡
    chatBubble_1 = game.add.sprite(50, 590, 'chatBubble')
    chatBubble_2 = game.add.sprite(50, 690, 'chatBubble')
    chatText_1 = game.add.text(chatBubble_1.width / 2 - 5, chatBubble_1.height / 2 + 3, '', {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center'
    })
    chatBubble_1.addChild(chatText_1)
    chatText_1.anchor.setTo(0.5)
    chatText_2 = game.add.text(chatBubble_2.width / 2 - 5, chatBubble_2.height / 2 + 3, '', {
      fontSize: '12px',
      fill: '#ffffff',
      align: 'center'
    })
    chatBubble_2.addChild(chatText_2)
    chatText_2.anchor.setTo(0.5)
    chatTween_1 = game.add.tween(chatBubble_1).to({alpha: 1}, 500, 'Linear', false, 0).yoyo(true, 3000)
    chatTween_2 = game.add.tween(chatBubble_2).to({alpha: 1}, 500, 'Linear', false, 0).yoyo(true, 3000)
    chatBubble_1.alpha = 0
    chatBubble_2.alpha = 0
    //创建下拉面板
    panel = game.add.sprite(0, -271, 'chatPanel')
    arrowBtn = game.add.button(0, panel.height, 'arrowBtn', clickHandler, this)
    panel.addChild(arrowBtn)
    arrow = game.add.sprite(arrowBtn.width / 2, arrowBtn.height / 2, 'arrow')
    arrow.anchor.setTo(0.5)
    arrowBtn.addChild(arrow)
    cuiBtn = game.add.button(panel.width / 2, panel.height / 2 - 80, 'cuiBtn', clickHandler, this)
    cuiBtn.anchor.setTo(0.5)
    biecuiBtn = game.add.button(panel.width / 2, panel.height / 2 - 30, 'biecuiBtn', clickHandler, this)
    biecuiBtn.anchor.setTo(0.5)
    chaoBtn = game.add.button(panel.width / 2, panel.height / 2 + 20, 'chaoBtn', clickHandler, this)
    chaoBtn.anchor.setTo(0.5)
    chatBtn = game.add.button(panel.width / 2, panel.height / 2 + 70, 'chatBtn', clickHandler, this)
    chatBtn.anchor.setTo(0.5)

    cuiBtn.onInputDown.add(function () {
      cuiBtn.scale.set(0.9)
    }, this)
    cuiBtn.onInputUp.add(function () {
      cuiBtn.scale.set(1)
    }, this)
    biecuiBtn.onInputDown.add(function () {
      biecuiBtn.scale.set(0.9)
    }, this)
    biecuiBtn.onInputUp.add(function () {
      biecuiBtn.scale.set(1)
    }, this)
    chaoBtn.onInputDown.add(function () {
      chaoBtn.scale.set(0.9)
    }, this)
    chaoBtn.onInputUp.add(function () {
      chaoBtn.scale.set(1)
    }, this)
    chatBtn.onInputDown.add(function () {
      chatBtn.scale.set(0.9)
    }, this)
    chatBtn.onInputUp.add(function () {
      chatBtn.scale.set(1)
    }, this)
    panel.addChild(cuiBtn)
    panel.addChild(biecuiBtn)
    panel.addChild(chaoBtn)
    panel.addChild(chatBtn)
    panel.inputEnabled = true
    panel.input.priorityID = 3 //点击优先级，用来避免点到面板还下棋
    cuiBtn.input.priorityID = 4
    chatBtn.input.priorityID = 4
    biecuiBtn.input.priorityID = 4
    chaoBtn.input.priorityID = 4
    arrowBtn.input.priorityID = 4
    //棋子展示
    whiteDisplay[0] = game.add.sprite(200, 615, 'white')
    whiteDisplay[1] = game.add.sprite(200, 715, 'white')
    blackDisplay[0] = game.add.sprite(200, 615, 'black')
    blackDisplay[1] = game.add.sprite(200, 715, 'black')
    whiteDisplay[0].anchor.setTo(0.5)
    whiteDisplay[1].anchor.setTo(0.5)
    blackDisplay[0].anchor.setTo(0.5)
    blackDisplay[1].anchor.setTo(0.5)
    whiteDisplay[0].animations.add('white', [0], 1, true)
    whiteDisplay[1].animations.add('white', [0], 1, true)
    blackDisplay[0].animations.add('black', [0], 1, true)
    blackDisplay[1].animations.add('black', [0], 1, true)
    blackDisplay[0].play('black')
    blackDisplay[1].play('black')
    whiteDisplay[0].play('white')
    whiteDisplay[1].play('white')
    whiteDisplay[0].visible = false
    whiteDisplay[1].visible = false
    blackDisplay[0].visible = false
    blackDisplay[1].visible = false
    //准备信息
    readyText = game.add.text(310, 720, '未准备', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    readyText.anchor.setTo(0.5)
    readyText.visible = false
    //掉线信息
    disconnectText[0] = game.add.text(310, 620, '已掉线', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    disconnectText[0].anchor.setTo(0.5)
    disconnectText[1] = game.add.text(310, 720, '已掉线', {
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    })
    disconnectText[1].anchor.setTo(0.5)
    disconnectText[0].visible = false
    disconnectText[1].visible = false
    //按钮显示
    startBtn = game.add.button(100, 640, 'startBtn', clickHandler, this)
    readyBtn = game.add.button(100, 640, 'readyBtn', clickHandler, this)
    quitBtn = game.add.button(100, 710, 'quitBtn', clickHandler, this)
    startBtn.anchor.setTo(0.5)
    readyBtn.anchor.setTo(0.5)
    quitBtn.anchor.setTo(0.5)
    startBtn.onInputDown.add(function () {
      startBtn.scale.set(0.9)
    }, this)
    startBtn.onInputUp.add(function () {
      startBtn.scale.set(1)
    }, this)
    readyBtn.onInputDown.add(function () {
      readyBtn.scale.set(0.9)
    }, this)
    readyBtn.onInputUp.add(function () {
      readyBtn.scale.set(1)
    }, this)
    quitBtn.onInputDown.add(function () {
      quitBtn.scale.set(0.9)
    }, this)
    quitBtn.onInputUp.add(function () {
      quitBtn.scale.set(1)
    }, this)
    readyBtn.visible = false
    startBtn.visible = false
  }

  //点击棋盘下棋事件
  function clickBg () {
    if (game.input.x >= 10 && game.input.x <= 530 && game.input.y >= 50 && game.input.y <= 565) {
      //把鼠标坐标纠正成棋格坐标 具体怎么算的我也忘记了！！！
      let saveX = 270 - 35 * Math.round((270 - game.input.x) / 35)
      let saveY = 270 - 35 * Math.round((270 - game.input.y) / 35) + 5
      let i
      let j
      console.log(saveX + '   ' + saveY)
      switch (saveX) {
        case 25:
          i = 0
          break
        case 25 + 35:
          i = 1
          break
        case 25 + 35 * 2:
          i = 2
          break
        case 25 + 35 * 3:
          i = 3
          break
        case 25 + 35 * 4:
          i = 4
          break
        case 25 + 35 * 5:
          i = 5
          break
        case 25 + 35 * 6:
          i = 6
          break
        case 25 + 35 * 7:
          i = 7
          break
        case 25 + 35 * 8:
          i = 8
          break
        case 25 + 35 * 9:
          i = 9
          break
        case 25 + 35 * 10:
          i = 10
          break
        case 25 + 35 * 11:
          i = 11
          break
        case 25 + 35 * 12:
          i = 12
          break
        case 25 + 35 * 13:
          i = 13
          break
        case 25 + 35 * 14:
          i = 14
          break
      }
      switch (saveY) {
        case 65:
          j = 0
          break
        case 65 + 35:
          j = 1
          break
        case 65 + 35 * 2:
          j = 2
          break
        case 65 + 35 * 3:
          j = 3
          break
        case 65 + 35 * 4:
          j = 4
          break
        case 65 + 35 * 5:
          j = 5
          break
        case 65 + 35 * 6:
          j = 6
          break
        case 65 + 35 * 7:
          j = 7
          break
        case 65 + 35 * 8:
          j = 8
          break
        case 65 + 35 * 9:
          j = 9
          break
        case 65 + 35 * 10:
          j = 10
          break
        case 65 + 35 * 11:
          j = 11
          break
        case 65 + 35 * 12:
          j = 12
          break
        case 65 + 35 * 13:
          j = 13
          break
        case 65 + 35 * 14:
          j = 14
          break
      }
      if (!setChessBoard(j, i)) {
        socket.emit('change_chess', {
          i: i,
          j: j,
          chessboard: chessboard,
          loginUserNum: loginUserNum
        })
        bg.inputEnabled = false
      }

    }
  }

  //set棋盘值
  function setChessBoard (j, i) {
    if (loginUserNum === player_1.loginUserNum) {
      if (player_1.chessColor === 1) {
        if (chessboard[j][i] !== 0) {
          return true
        } else {
          chessboard[j][i] = 1
        }

      } else {
        if (chessboard[j][i] !== 0) {
          return true
        } else {
          chessboard[j][i] = 2
        }
      }
    }
    if (loginUserNum === player_2.loginUserNum) {
      if (player_2.chessColor === 1) {
        if (chessboard[j][i] !== 0) {
          return true
        } else {
          chessboard[j][i] = 1
        }
      } else {
        if (chessboard[j][i] !== 0) {
          return true
        } else {
          chessboard[j][i] = 2
        }
      }
    }
  }

  //催促音效等
  function netVoice () {
    switch (saveEnum) {
      case VOICE_ENUM.VOICE_CUI:
        cuiVoice.play()
        break
      case VOICE_ENUM.VOICE_BIECUI:
        biecuiVoice.play()
        break
      case VOICE_ENUM.VOICE_CHAOFENG:
        chaoVoice.play()
        break
    }
  }

  //聊天消息
  function netChat () {
    chatBubble_1.bringToTop()
    chatBubble_2.bringToTop()
    if (chatLoginUserNum === player_1.loginUserNum) {
      chatText_1.text = chatMsg
      chatTween_1.start()
    }
    if (chatLoginUserNum === player_2.loginUserNum) {
      chatText_2.text = chatMsg
      chatTween_2.start()
    }
  }

  //每局结束更新游戏分数和称号
  function netUpdateScore () {
    if (winnerLoginUserNum === player_1.loginUserNum) {
      player_1_scoreText.text = '分数：' + score_1 + '(' + (score_1 - 3) + '+3)'
      player_1_levelText.text = '称号：' + showLevel(score_1)
      player_2_scoreText.text = '分数：' + score_2 + '(' + (score_2 + 3) + '-3)'
      player_2_levelText.text = '称号：' + showLevel(score_2)
    } else {
      player_1_scoreText.text = '分数：' + score_1 + '(' + (score_1 + 3) + '-3)'
      player_1_levelText.text = '称号：' + showLevel(score_1)
      player_2_scoreText.text = '分数：' + score_2 + '(' + (score_2 - 3) + '+3)'
      player_2_levelText.text = '称号：' + showLevel(score_2)
    }
  }

  //游戏胜利
  function netWin () {
    movingText.text = '恭喜' + winnerName + '\n(' + (winnerColor === 1 ? '黑棋' : '白棋') + ')获胜！'
    bg.inputEnabled = false
    whiteDisplay[1].visible = false
    blackDisplay[0].visible = false
    whiteDisplay[0].visible = false
    blackDisplay[1].visible = false
    quitBtn.visible = true
    readyText.visible = true
    if (player_1.loginUserNum === loginUserNum) {
      startBtn.visible = true
    } else {
      readyBtn.visible = true
    }
    readyText.text = '未准备'
    readyText.setStyle({
      fontSize: '14px',
      fill: '#ff0000',
      align: 'center'
    }, true)
    if (player_1.isDisconnect === 1) {
      layui.use(['layer', 'form'], function () {
        let layer = layui.layer
          , form = layui.form
        layer.alert('由于房主掉线房间自动解散，结算结果：<br>玩家1：<br>' + player_1.name + '(' + showLevel(score_1) + ')<br>分数：' + score_1 + '(' + (score_1 + 3) + '-3)<br>玩家2：<br>'
          + player_2.name + '(' + showLevel(score_2) + ')<br>分数：' + score_2 + '(' + (score_2 - 3) + '+3)', {
          icon: 0,
          title: '提示'
        })
      })
      dataInitialization(true)
      updateUserInfo()
    }
    if (player_2.isDisconnect === 1) {
      xw.warn(player_2.name + '掉线，自动退出房间')
      disconnectText[1].visible = false
      player_2_text.text = '待加入...'
      player_2 = {}
      player_2_levelText.visible = false
      player_2_scoreText.visible = false
      readyText.visible = false
      readyText.text = '未准备'
      readyText.setStyle({
        fontSize: '14px',
        fill: '#ff0000',
        align: 'center'
      }, true)
    }
  }

  //清除掉线
  function netClearDisconnectText () {
    if (player_1.isDisconnect === 0)
      disconnectText[0].visible = false
    if (player_2.isDisconnect === 0)
      disconnectText[1].visible = false
  }

  //显示掉线
  function netDisconnect () {
    if (player_1.isDisconnect === 1)
      disconnectText[0].visible = true
    if (player_2.isDisconnect === 1)
      disconnectText[1].visible = true
  }

  //重连
  function netReconnect () {
    readyBtn.visible = false
    startBtn.visible = false
    readyText.visible = false
    quitBtn.visible = false
    if (player_1.chessColor === 1) {
      whiteDisplay[1].visible = true
      blackDisplay[0].visible = true
    } else {
      whiteDisplay[0].visible = true
      blackDisplay[1].visible = true
    }
  }

  //更新棋盘
  /**
   * 待优化，每次调用的时候，就会重新创建所有棋子，
   * 虽然销毁了但是还是保存在数组内存中，建议先把
   * 所有棋子创建好，用visible来控制显示棋子
   */
  function netUpdateChess () {
    // if (lastWk && lastBk) {
    //   blackChess[lastBk].frame = 0
    //   whiteChess[lastWk].frame = 0
    // }

    for (let i = 0; i < whiteChess.length; i++) {
      whiteChess[i].destroy()
    }
    for (let i = 0; i < blackChess.length; i++) {
      blackChess[i].destroy()
    }

    for (let i = 0; i < chessboard[0].length; i++) {
      for (let j = 0; j < chessboard.length; j++) {
        if (chessboard[j][i] === 1) {
          if (server_i === i && server_j === j) {
            if (!blackChess[bk]) {
              blackChess[bk] = game.add.sprite(i * 35.2 + 25, j * 35.2 + 65, 'black', 1)
              blackChess[bk].anchor.setTo(0.5)
            }
          } else {
            if (!blackChess[bk]) {
              blackChess[bk] = game.add.sprite(i * 35.2 + 25, j * 35.2 + 65, 'black', 0)
              blackChess[bk].anchor.setTo(0.5)
            }
          }
          bk++
        }
        if (chessboard[j][i] === 2) {
          if (server_i === i && server_j === j) {
            if (!whiteChess[wk]) {
              whiteChess[wk] = game.add.sprite(i * 35.2 + 25, j * 35.2 + 65, 'white', 1)
              whiteChess[wk].anchor.setTo(0.5)
            }
          } else {
            if (!whiteChess[wk]) {
              whiteChess[wk] = game.add.sprite(i * 35.2 + 25, j * 35.2 + 65, 'white', 0)
              whiteChess[wk].anchor.setTo(0.5)
            }
          }
          wk++
        }
      }
    }
    //更新棋盘的时候让panel位于顶部才不会让棋子遮挡
    panel.bringToTop()
  }

  //下棋信息
  function netChessDown () {
    downSound.play()
    if (movingLoginUserNum === loginUserNum) {
      bg.inputEnabled = true
    }
  }

  //更新行动信息
  function netChangeMovingText () {
    movingText.text = movingName
  }

  //开始游戏
  function netStartGame () {
    dataInitialization()
    startBtn.visible = false
    quitBtn.visible = false
    readyText.visible = false
    player_1_scoreText.text = '分数：' + player_1.score
    player_1_levelText.text = '称号：' + showLevel(player_1.score)
    player_2_scoreText.text = '分数：' + player_2.score
    player_2_levelText.text = '称号：' + showLevel(player_2.score)

    if (player_1.chessColor === 1) {
      whiteDisplay[1].visible = true
      blackDisplay[0].visible = true
    } else {
      whiteDisplay[0].visible = true
      blackDisplay[1].visible = true
    }

  }

  //准备信息
  function netReady () {
    readyText.text = '已准备'
    readyText.setStyle({
      fontSize: '14px',
      fill: '#009a22',
      align: 'center'
    }, true)
  }

  //显示开始/准备按钮
  function newShowButton () {
    if (player_1.loginUserNum === loginUserNum) {
      startBtn.visible = true
    } else {
      readyBtn.visible = true
    }
  }

  //退出房间返回主界面
  function netQuitRoom () {
    if (player_1.loginUserNum === quitLoginUserNum) {
      xw.loadRemove()
      dataInitialization(true)
      updateUserInfo()
      return
    }
    if (loginUserNum === quitLoginUserNum) {
      xw.loadRemove()
      dataInitialization(true)
      updateUserInfo()
      return
    }
  }

  //显示名字
  function netShowName () {
    if (player_1.loginUserNum) {
      player_1_text.text = player_1.name
      player_1_scoreText.text = '分数：' + player_1.score
      player_1_levelText.text = '称号：' + showLevel(player_1.score)
      player_1_scoreText.visible = true
      player_1_levelText.visible = true
    }
    if (player_2.loginUserNum) {
      player_2_text.text = player_2.name
      player_2_scoreText.text = '分数：' + player_2.score
      player_2_levelText.text = '称号：' + showLevel(player_2.score)
      player_2_scoreText.visible = true
      player_2_levelText.visible = true
      if (isPlay === '0')
        readyText.visible = true
    }
  }

  //清除名字
  function netClearName () {
    if (player_1.loginUserNum === quitLoginUserNum) {
      player_1_text.text = ''
      // player_1 = {}
    }
    if (player_2.loginUserNum) {
      player_2_text.text = '待加入...'
      player_2 = {}
      player_2_levelText.visible = false
      player_2_scoreText.visible = false
      readyText.visible = false
      readyText.text = '未准备'
      readyText.setStyle({
        fontSize: '14px',
        fill: '#ff0000',
        align: 'center'
      }, true)
    }
  }

  //ping变化
  function netUpdatePing () {
    pingText.text = 'Ping:' + ping + ' ms'
    if (ping <= 100) {
      pingText.setStyle({
        fontSize: '20px',
        fill: '#00bf20'
      }, true)
    } else if (ping > 100 && ping <= 200) {
      pingText.setStyle({
        fontSize: '20px',
        fill: '#ffb300'
      }, true)
    } else {
      pingText.setStyle({
        fontSize: '20px',
        fill: '#ff1100'
      }, true)
    }
  }

  //点击事件
  function clickHandler (e) {
    switch (e.key) {
      case 'startBtn':
        clickSound.play()
        socket.emit('start_game', {})
        break
      case 'readyBtn':
        clickSound.play()
        socket.emit('ready', {})
        readyBtn.visible = false
        break
      case 'quitBtn':
        clickSound.play()
        socket.emit('quit_room', {})
        xw.load('正在退出')
        break
      case 'chatBtn':
        clickSound.play()
        panelTween_up.start()
        arrowRotationUpTween.start()
        isDown = false
        Dialog.init('<input type="text"  maxlength="12"  style="margin:8px 0;width:100%;padding:11px 8px;font-size:32px; border:1px solid #999;"/>', {
          title: '聊天',
          button: {
            发送: function () {
              clickSound.play()
              let chat = this.querySelector('input').value.toString()
              if (chat === '') {
                Dialog.init('聊天信息不能为空', 1100)
              } else if (chat.length > 12) {
                Dialog.init('聊天内容不能大于12个字符，请重新输入。', 1100)
              } else {
                socket.emit('chat_message', {
                  message: chat
                })
                Dialog.close(this)
              }
            },
            取消: function () {
              clickSound.play()
              Dialog.close(this)
            }
          }
        })
        break
      case 'cuiBtn':
        socket.emit('voice_message', {
          voiceId: VOICE_ENUM.VOICE_CUI
        })
        panelTween_up.start()
        arrowRotationUpTween.start()
        isDown = false
        break
      case 'biecuiBtn':
        socket.emit('voice_message', {
          voiceId: VOICE_ENUM.VOICE_BIECUI
        })
        panelTween_up.start()
        arrowRotationUpTween.start()
        isDown = false
        break
      case 'chaoBtn':
        socket.emit('voice_message', {
          voiceId: VOICE_ENUM.VOICE_CHAOFENG
        })
        panelTween_up.start()
        arrowRotationUpTween.start()
        isDown = false
        break
      case 'arrowBtn':
        if (!isDown) {
          isDown = true
          panelTween_down.start()
          arrowRotationDownTween.start()
        } else {
          isDown = false
          panelTween_up.start()
          arrowRotationUpTween.start()
        }
        break
    }
  }

  //初始化数据
  function dataInitialization (quit) {
    //棋子计数器
    bk = 0
    wk = 0
    //销毁棋子
    for (let i = 0; i < whiteChess.length; i++) {
      whiteChess[i].destroy()
    }
    for (let i = 0; i < blackChess.length; i++) {
      blackChess[i].destroy()
    }
    //棋子数组
    whiteChess = []
    blackChess = []
    //销毁事件
    if (quit) {
      netUpdatePingSignal.remove(netUpdatePing)
      netShowNameSignal.remove(netShowName)
      netClearNameSignal.remove(netClearName)
      netQuitRoomSignal.remove(netQuitRoom)
      netShowButtonSignal.remove(newShowButton)
      netReadySignal.remove(netReady)
      netStartGameSignal.remove(netStartGame)
      netChangeMovingTextSignal.remove(netChangeMovingText)
      netChessDownSignal.remove(netChessDown)
      netUpdateChessSignal.remove(netUpdateChess)
      netReconnectSignal.remove(netReconnect)
      netDisconnectSignal.remove(netDisconnect)
      netClearDisconnectTextSignal.remove(netClearDisconnectText)
      netWinSignal.remove(netWin)
      netUpdateScoreSignal.remove(netUpdateScore)
      netChatSignal.remove(netChat)
      netVoiceSignal.remove(netVoice)
    }
  }
}