/**
 * 主入口
 * @author Card1ac(Autism_Ka) 2019.7.22
 */
let game = new Phaser.Game(700, 580, Phaser.AUTO, 'gobang'), isDesktop = true
game.States = {}
game.States.start = function () {
  this.preload = function () {
    //设置背景颜色
    game.stage.backgroundColor = '#e1e1e1'
    //焦点移出游戏不暂停
    game.stage.disableVisibilityChange = true
    //设置适配，如果是手机端就以SHOW_ALL模式显示
    if (!game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
      this.scale.forcePortrait = true
      this.scale.refresh()
      isDesktop = false
    }
    //允许跨域
    game.load.crossOrigin = 'anonymous'

    game.load.image('loading_yellow', './res/images/loading_yellow.png')
    game.load.image('loading_blue', './res/images/loading_blue.png')
  }
  this.create = function () {
    game.state.start('preload')
  }
}
