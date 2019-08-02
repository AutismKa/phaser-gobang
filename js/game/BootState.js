/**
 * 菜单界面
 * @author Card1ac(Autism_Ka) 2019.7.22
 */
let createRoomBtn, joinRoomBtn, infoText, connectText
let netUpdateConnectCountSignal
game.States.boot = function () {
  this.init = function () {
    game.scale.setGameSize(700, 580)
  }
  this.preload = function () {

  }
  this.create = function () {
    //注册事件
    netUpdateConnectCountSignal = new Phaser.Signal()
    netUpdateConnectCountSignal.add(netUpdateConnectCount, this)
    //添加logo
    logo = game.add.sprite(game.world.width / 2 - 10, 100, 'logo')
    logo.anchor.setTo(0.5)
    //添加info信息
    infoText = game.add.text(game.world.centerX, game.world.centerY - 30, '昵称：' + userInfo.nickName + '\n分数：' + userInfo.score + '\n称号：' + showLevel(userInfo.score), {
      fontSize: '24px',
      fill: '#000000'
    })
    connectText = game.add.text(game.world.centerX, game.world.centerY + 280, '当前在线：0', {
      fontSize: '16px',
      fill: '#000000'
    })
    connectText.anchor.setTo(0.5)
    clickSound = game.add.audio('click')
    infoText.anchor.setTo(0.5)
    //添加按钮
    createRoomBtn = game.add.button(game.world.centerX, game.world.centerY + 90, 'createRoomBtn', clickHandler, this)
    joinRoomBtn = game.add.button(game.world.centerX, game.world.centerY + 200, 'joinRoomBtn', clickHandler, this)
    createRoomBtn.anchor.setTo(0.5)
    joinRoomBtn.anchor.setTo(0.5)
    //鼠标下去按钮会变小，然后鼠标弹起又会恢复原状
    createRoomBtn.onInputDown.add(function () {
      createRoomBtn.scale.set(0.9)
    }, this)
    createRoomBtn.onInputUp.add(function () {
      createRoomBtn.scale.set(1)
    }, this)
    joinRoomBtn.onInputDown.add(function () {
      joinRoomBtn.scale.set(0.9)
    }, this)
    joinRoomBtn.onInputUp.add(function () {
      joinRoomBtn.scale.set(1)
    }, this)
    //每过5秒刷新连接数
    socket.emit('connect_count', {})
    game.time.events.loop(5000, function () {
      socket.emit('connect_count', {})
    }, this)
  }

  //刷新连接数据
  function netUpdateConnectCount () {
    connectText.text = '当前在线：' + connectCount
  }

  //按钮点击事件
  function clickHandler (e) {
    switch (e.key) {
      case 'createRoomBtn':
        clickSound.play()
        socket.emit('create_room', {
          playerName: userInfo.nickName
        })
        xw.load('创建房间中')
        dispose()
        break
      case 'joinRoomBtn':
        clickSound.play()
        layui.use(['layer', 'form'], function () {
          let layer = layui.layer
            , form = layui.form
          layer.prompt({title: '请输入房间号或者好友昵称', formType: 0}, function (roomNum, index) {
            layer.close(index)
            socket.emit('join_room', {
              playerName: userInfo.nickName,
              roomNum: roomNum
            })
            xw.load('加入房间中')
            dispose()
          })
        })
        break
    }
  }

  //销毁事件
  function dispose () {
    netUpdateConnectCountSignal.remove(netUpdateConnectCount)
  }
}