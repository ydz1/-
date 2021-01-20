// pages/recommendSong/recommendSong.js
import PubSub from 'pubsub-js'
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendSongsList:[], //每日推荐歌曲
    index:0 //当前播放音乐在列表中的index
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    //请求每日推荐的api需要cookie，可先判断是佛登陆
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo) {
      wx.showToast({
        title:'请先登录',
        success() {
          wx.reLaunch({
            url:'/pages/login/login'
          })
        }
      })
    }
    //获取每日推荐歌曲
    this.getRecommendSongsList()

    PubSub.subscribe('type',(msg,type) => {
      let {index} = this.data
      //消息发布根据index和type把上一首或者下一首歌的id传给歌曲详情界面
      if(type === 'prev') {
        // 如果已经是第一首,让其播最后一首
        (index === 0) && (index = this.data.recommendSongsList.length)
        index = index - 1
      }else{
        //如果是最后一首，播第一首
        (index === this.data.recommendSongsList.length-1) && (index = -1)
        index = index + 1
      }
      this.setData({
        index
      })
      let musicId = this.data.recommendSongsList[index].id
      PubSub.publish('musicId',musicId)
    })
  },
  // 获取每日推荐歌曲
  async getRecommendSongsList() {
    let recommendSongsList = await request('/recommend/songs')
    this.setData({
      recommendSongsList:recommendSongsList.recommend
    })
  },
  //点击跳转到播放页面
  toSongPlay(event) {
    let {song,index} = event.currentTarget.dataset // 消息订阅，获取歌曲详情页面发过来的type
    this.setData({
      index
    })
    wx.navigateTo({
      url:'/pages/songplay/songplay?songId='+ song.id
    })
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