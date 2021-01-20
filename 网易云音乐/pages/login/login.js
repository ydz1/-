// pages/login/login.js
import request from "../../utils/request";
Page({
  handleInput(event) {
    // console.log(event)
    // let type = event.currentTarget.id //通过id获取类型
    let type = event.target.dataset.type //通过data-获取类型
    this.setData({
      [type]:event.detail.value,
    })
    // console.log(type,event.detail.value)
  },
  async login() {
    let { phone, password } = this.data
    //前端验证
    if(!phone) {
      wx.showToast({
        title:'请输入手机号码',
        icon:'none'
      })
      return
    }

    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)) {
      wx.showToast({
        title:'手机号格式出错',
        icon:'none'
      })
      return
    }
    if(!password) {
      wx.showToast({
        title:'请输入密码',
        icon:'none'
      })
      return
    }
    let loginResult = await request('/login/cellphone',{ phone, password, isLogin:true })
    // console.log(loginResult)
    if(loginResult.code === 200) {
      wx.showToast({
        title:'登陆成功'
      })
      //登陆成功将用户信息存到storage中
      wx.setStorageSync('userInfo',JSON.stringify(loginResult.profile))
      //登录成功后转到个人页面
      wx.switchTab({
        url:'/pages/person/person'
      })
      return
    }
    else if(loginResult.code === 400){
      wx.showToast({
        title:'用户名不存在',
        icon:'error'
      })
      return
    }
    else if(loginResult.code === 502) {
      wx.showToast({
        title:'密码错误',
        icon:'none'
      })
      return
    }
    else{
      wx.showToast({
        title:'登陆失败,请重新登陆',
        icon:'none'
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    phone:0,
    password:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})