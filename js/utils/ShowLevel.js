/**
 * 根据分数返回段位
 * @author Card1ac(Autism_Ka) 2019.7.25
 */
function showLevel (score) {
  if (parseInt(score) < 0) {
    return '弱鸡'
  }
  if (parseInt(score) >= 0 && parseInt(score) <= 10) {
    return '菜鸟'
  }
  if (parseInt(score) > 10 && parseInt(score) <= 50) {
    return '小卒'
  }
  if (parseInt(score) > 50 && parseInt(score) <= 100) {
    return '勇士'
  }
  if (parseInt(score) > 100 && parseInt(score) <= 300) {
    return '高手'
  }
  if (parseInt(score) > 300 && parseInt(score) <= 500) {
    return '大侠'
  }
  if (parseInt(score) > 500 && parseInt(score) <= 800) {
    return '掌门'
  }
  if (parseInt(score) > 800 && parseInt(score) <= 1200) {
    return '盟主'
  }
  if (parseInt(score) > 1200) {
    return '独孤求败'
  }
}