/**
 * 登录界面
 * @author Card1ac(Autism_Ka) 2019.7.22
 */
let loginDialog, loginBtn, registerBtn, clickSound, username, password, userInfo, saveUserName, savePassWord, logo, bgm
game.States.login = function () {
  this.create = function () {
    //加载插件
    game.add.plugin(PhaserInput.Plugin)
    //添加登录的图片框
    loginDialog = game.add.sprite(game.world.width / 2, game.world.height / 2 + 80, 'loginDialog')
    loginDialog.anchor.setTo(0.5)
    loginDialog.scale.set(0.7)
    //添加logo
    logo = game.add.sprite(game.world.width / 2 - 10, 100, 'logo')
    logo.anchor.setTo(0.5)
    //添加点击声音和背景音乐
    clickSound = game.add.audio('click')
    bgm = game.add.audio('bgm')
    bgm.loopFull(0.5)
    //添加登录按钮
    loginBtn = game.add.button(game.world.width / 2 + 45, game.world.height / 2 + 180, 'loginBtn', clickHandler, this)
    //添加注册按钮
    registerBtn = game.add.button(game.world.width / 2 - 55, game.world.height / 2 + 180, 'registerBtn', clickHandler, this)
    //鼠标下去按钮会变小，然后鼠标弹起又会恢复原状
    loginBtn.onInputDown.add(function () {
      loginBtn.scale.set(0.4)
    }, this)
    loginBtn.onInputUp.add(function () {
      loginBtn.scale.set(0.5)
    }, this)
    registerBtn.onInputDown.add(function () {
      registerBtn.scale.set(0.4)
    }, this)
    registerBtn.onInputUp.add(function () {
      registerBtn.scale.set(0.5)
    }, this)
    //设置按钮的锚点和初始大小
    loginBtn.anchor.setTo(0.5)
    loginBtn.scale.set(0.5)
    registerBtn.anchor.setTo(0.5)
    registerBtn.scale.set(0.5)
    //调用方法
    createInputField()
  }

  //按钮点击事件
  function clickHandler (e) {
    switch (e.key) {
      case 'loginBtn':
        clickSound.play()
        xw.load('登录中')
        axios.post(api + 'login', {
          userName: username.value,
          passWord: password.value
        }).then(function (res) {
          console.log(res)
          if (res.data.code === 200) {
            xw.success('登录成功')
            userInfo = res.data.data
            xw.loadRemove()
            saveUserName = username.value
            savePassWord = password.value
            connect()
            //updateUserInfo方法里包含了跳转到boot界面
            updateUserInfo()
          } else {
            xw.error('登录失败，' + res.data.msg)
            xw.loadRemove()
          }

        }).catch(function (e) {
          xw.error('登录失败，请稍候重试')
          xw.loadRemove()
          console.log(e)
        })
        break
      case 'registerBtn':
        clickSound.play()
        //加载layui
        if (!isDesktop) {
          var width = $(window).width() + 'px'
          var height = $(window).height() + 'px'
        } else {
          var width = 600 + 'px'
          var height = 400 + 'px'
        }
        layui.use(['layer', 'form'], function () {
          let layer = layui.layer
            , form = layui.form
          layer.open({
            type: 2,
            title: '注册',
            shadeClose: true,
            shade: 0.8,
            area: [width, height],
            content: './register.html' //iframe的url
          })
        })
        break
    }

  }

  //创建输入框方法
  function createInputField () {
    username = game.add.inputField(game.world.width / 2 - 115, game.world.height / 2, {
      font: '14px Arial',
      fill: '#000000',
      borderWidth: 1,
      borderColor: '#000',
      width: 200,
      padding: 8,
      borderRadius: 6,
      placeHolder: '请输入用户名'
    })
    password = game.add.inputField(game.world.width / 2 - 115, game.world.height / 2 + 100, {
      font: '14px Arial',
      fill: '#000000',
      borderWidth: 1,
      borderColor: '#000',
      width: 200,
      padding: 8,
      borderRadius: 6,
      placeHolder: '请输入密码',
      type: PhaserInput.InputType.password
    })
  }
}