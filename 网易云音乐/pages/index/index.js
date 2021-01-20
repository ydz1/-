// pages/index/index.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerArray:[], //轮播图数据
    recommendArray:[], //热门推荐数据
    rankListArray:[] //排行榜数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let bannerArray = await request('/banner',{type:1})
    let recommendArray = await request('/personalized', {limit:10})
    // console.log(bannerArray)
    // console.log(recommendArray);
    this.setData({
      bannerArray:bannerArray.banners,
      recommendArray:recommendArray.result
    })
    let index = 0;
    let resultArray = [];
    while(index < 5) {
      let rankResult = await request('/top/list',{idx:index++})
      // console.log(rankResult)
      let item = {name:rankResult.playlist.name,rankArray:rankResult.playlist.tracks.slice(0,3)}
      resultArray.push(item)
      this.setData({
        rankListArray : resultArray
      })
    }
  },
  toRecommendSonglist() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
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