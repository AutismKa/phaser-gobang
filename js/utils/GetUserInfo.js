/**
 * 获取最新的用户信息
 * @author Card1ac(Autism_Ka) 2019.7.25
 */
//更新userInfo
function updateUserInfo () {
  xw.load('加载中')
  axios.post(api + 'getUserInfo', {
    userName: saveUserName,
    passWord: savePassWord
  }).then(function (res) {
    console.log(res)
    if (res.data.code === 200) {
      userInfo = res.data.data
      xw.loadRemove()
      saveUserName = username.value
      savePassWord = password.value
      if (!isReconnect)
        game.state.start('boot')
    } else {
      xw.error('获取最新信息失败，' + res.data.msg)
      xw.loadRemove()
    }

  }).catch(function (e) {
    xw.error('获取最新信息失败')
    xw.loadRemove()
    console.log(e)
  })
}