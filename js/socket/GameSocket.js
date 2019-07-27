/**
 * 网络消息处理
 * @author Card1ac(Autism_Ka) 2019.7.22
 */
let socket, loginUserNum, ping, roomNum, quitLoginUserNum, isPlay, movingName,
  movingLoginUserNum, server_i, server_j, chessboard, winnerName, winnerColor, winnerLoginUserNum, score_1, score_2,
  isReconnect = false, chatMsg, chatLoginUserNum, saveEnum

function connect () {
  loginUserNum = userInfo.id
  let opts = {
    query: 'loginUserNum=' + loginUserNum
  }
  socket = io.connect(socketUrl, opts)
  socket.on('connect', function () {
    console.log('连接成功')
    socket.emit('check_reconnect', {})
  })
  socket.on('push_event', function (data) {
    console.log(data)
    switch (data.id) {
      //没有找到房间号消息
      case '40001':
        console.log('消息类型：' + data.id + '\n' +
          '未找到房间号消息'
        )
        xw.loadRemove()
        xw.error(data.msg)
        break
      //房间已满消息
      case '40002':
        console.log('消息类型：' + data.id + '\n' +
          '房间已满消息'
        )
        xw.loadRemove()
        xw.warn(data.msg)
        break
      //玩家数量不够消息
      case '40003':
        console.log('消息类型：' + data.id + '\n' +
          '玩家数不够消息'
        )
        xw.loadRemove()
        xw.warn(data.msg)
        break
      //玩家没有准备消息
      case '40004':
        console.log('消息类型：' + data.id + '\n' +
          '玩家没有准备消息'
        )
        xw.loadRemove()
        xw.warn(data.msg)
        break
      //房间已经开始消息
      case '40005':
        console.log('消息类型：' + data.id + '\n' +
          '房间已经开始消息'
        )
        xw.loadRemove()
        xw.warn(data.msg)
        break
      //聊天消息
      case '10001':
        console.log('消息类型：' + data.id + '\n' +
          '聊天消息'
        )
        chatMsg = data.message
        chatLoginUserNum = data.loginUserNum
        netChatSignal.dispatch()
        break
      //创建房间消息
      case '10002':
        console.log('消息类型：' + data.id + '\n' +
          '创建房间消息'
        )
        roomNum = data.roomNum
        xw.loadRemove()
        game.state.start('game')
        break
      //加入房间消息
      case '10003':
        console.log('消息类型：' + data.id + '\n' +
          '加入房间消息'
        )
        roomNum = data.roomNum
        xw.loadRemove()
        game.state.start('game')
        break
      //退出房间消息
      case '10004':
        console.log('消息类型：' + data.id + '\n' +
          '退出房间消息'
        )
        quitLoginUserNum = data.loginUserNum
        if (getPlayerSite(quitLoginUserNum) + 1 === 2) {
          if (quitLoginUserNum !== loginUserNum) {
            xw.warn(eval('player_' + (getPlayerSite(quitLoginUserNum) + 1)).name + '退出了房间')
          }
        } else {
          xw.warn(eval('player_' + (getPlayerSite(quitLoginUserNum) + 1)).name + '解散了房间')
        }
        if (isPlay === '0') {
          netQuitRoomSignal.dispatch()
          netClearNameSignal.dispatch()
        }
        break
      //房间信息消息
      case '10005':
        console.log('消息类型：' + data.id + '\n' +
          '房间信息消息'
        )
        roomNum = data.roomId
        isPlay = data.isPlay
        if (data.player_1) {
          player_1 = data.player_1
          netShowNameSignal.dispatch()
        }
        if (data.player_2) {
          player_2 = data.player_2
          netShowNameSignal.dispatch()
        }
        if (isPlay === '0')
          netShowButtonSignal.dispatch()
        if (isPlay === '1')
          netClearDisconnectTextSignal.dispatch()
        break
      //开始游戏消息
      case '10006':
        console.log('消息类型：' + data.id + '\n' +
          '开始游戏消息'
        )
        netStartGameSignal.dispatch()
        break
      //准备游戏消息
      case '10007':
        console.log('消息类型：' + data.id + '\n' +
          '准备游戏消息'
        )
        if (player_1.loginUserNum) {
          if (player_1.loginUserNum === data.loginUserNum) {
            player_1.isReady = data.isReady
          }
        }
        if (player_2.loginUserNum) {
          if (player_2.loginUserNum === data.loginUserNum) {
            player_2.isReady = data.isReady
          }
        }
        netReadySignal.dispatch()
        break
      //游戏信息消息
      case '10008':
        console.log('消息类型：' + data.id + '\n' +
          '游戏信息消息'
        )
        if (data.player_1) {
          player_1 = data.player_1
        }
        if (data.player_2) {
          player_2 = data.player_2
        }
        server_i = data.i
        server_j = data.j
        movingName = data.movingName
        chessboard = data.chessboard
        movingLoginUserNum = data.movingLoginUserNum
        netChangeMovingTextSignal.dispatch()
        netChessDownSignal.dispatch()
        netUpdateChessSignal.dispatch()
        break
      //胜利消息
      case '10009':
        console.log('消息类型：' + data.id + '\n' +
          '胜利消息'
        )
        isPlay = '0'
        winnerColor = data.winColor
        winnerName = data.winName
        winnerLoginUserNum = data.winLoginUserNum
        score_1 = data.score_1
        score_2 = data.score_2
        isReconnect = false
        netWinSignal.dispatch()
        netUpdateScoreSignal.dispatch()
        break
      //语音催促消息
      case '10010':
        console.log('消息类型：' + data.id + '\n' +
          '语音催促等消息'
        )
        saveEnum = data.voiceId
        chatLoginUserNum = data.loginUserNum
        switch (saveEnum) {
          case VOICE_ENUM.VOICE_CUI:
            chatMsg = '速度些噻，又少打两盘咯！'
            netChatSignal.dispatch()
            break
          case VOICE_ENUM.VOICE_BIECUI:
            chatMsg = '催啥子嘛，看都没看清楚'
            netChatSignal.dispatch()
            break
          case VOICE_ENUM.VOICE_CHAOFENG:
            chatMsg = '我可不可以笑一哈，哈哈'
            netChatSignal.dispatch()
            break
        }
        netVoiceSignal.dispatch()
        break
      //掉线消息
      case '10011':
        console.log('消息类型：' + data.id + '\n' +
          '掉线消息'
        )
        if (data.player_1) {
          player_1 = data.player_1
        }
        if (data.player_2) {
          player_2 = data.player_2
        }
        netDisconnectSignal.dispatch()
        break
      //重连消息
      case '10012':
        console.log('消息类型：' + data.id + '\n' +
          '重连消息'
        )
        if (data.isReconnect === 1) {
          isReconnect = true
          roomNum = data.roomId
          game.state.start('game')
          xw.load('重连中')
        } else {
          isReconnect = false
        }
        break
      //重连玩家信息
      case '10013':
        setTimeout(function () {
          console.log('消息类型：' + data.id + '\n' +
            '重连玩家信息消息'
          )
          isPlay = data.isPlay
          server_i = data.i
          server_j = data.j
          movingName = data.movingName
          chessboard = data.chessboard
          movingLoginUserNum = data.movingLoginUserNum
          netChangeMovingTextSignal.dispatch()
          netChessDownSignal.dispatch()
          netUpdateChessSignal.dispatch()
          netReconnectSignal.dispatch()
          xw.loadRemove()
        }, 1000)
        break
    }

    function getPlayerSite (loginUserNum) {
      if (player_1.loginUserNum === loginUserNum) {
        return 0
      }
      if (player_2.loginUserNum === loginUserNum) {
        return 1
      }
    }
  })

  socket.on('disconnect', function () {
    console.log('已经断线')
  })
  socket.on('pong', function (data) {
    ping = data
    if (netUpdatePingSignal) {
      netUpdatePingSignal.dispatch()
    }
  })
}