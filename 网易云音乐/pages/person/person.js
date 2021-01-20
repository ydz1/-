// pages/person/person.js
import request from "../../utils/request";
let startY = 0;//个人页滑动初始Y轴距离
let moveY = 0;//个人页滑动过程中Y轴距离
let distanceY = 0;//个人页滑动距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recentUserPlayRecord:{}
  },

  handleTouchStart(event) {
    // console.log(event)
    this.setData({
      coverTransition:''
    })
    startY = event.touches[0].clientY;
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY;
    distanceY = moveY-startY;
    if(distanceY <= 0) {
      return
    }
    if(distanceY >= 80) {
      distanceY = 80
    }
    this.setData({
      coverTransform:`translateY(${distanceY}rpx)`
    })
    // console.log(distanceY)
  },
  handleTouchEnd(event) {
    this.setData({
      coverTransform: 'translateY(0)',
      coverTransition: 'transform 0.5s linear'
    })
  },
  // 点击头像转到登录界面
  toLogin() {
    wx.reLaunch({
      url:'/pages/login/login'
    })
  },
  //获取用户最近播放记录
  async getUserPlayList(userId) {
    let result = await request('/user/record',{uid:userId, type:1})
    this.setData({
      recentUserPlayRecord:result.weekData.slice(0,10).map((item,index) =>{
        item.id = index
        return item
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //从storage中获取用户数据
    this.setData({
      userInfo:JSON.parse(wx.getStorageSync('userInfo'))
    })
    this.getUserPlayList(this.data.userInfo.userId)
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