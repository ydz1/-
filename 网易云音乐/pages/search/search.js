// pages/search/search.js
import request from "../../utils/request";
let isSend = false; //输入框节流标志
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderData:'', //搜索框的placeholder字段
    hostListData:[],//热搜榜数据
    inputData:'', //输入框输入的数据
    searchList:[], //搜索到的模糊匹配项
    historyList:[] //记录搜索记录的数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPlaceHolder()
    this.getHotList()
    //页面加载时将storage中的historyList遍历出来显示到页面上
    let historyList = wx.getStorageSync('history');
    if(historyList.length){
      this.setData({
        historyList
      })
    }
  },

  //获取placeholder的默认关键字
  async getPlaceHolder() {
    let placeHolderData = await request('/search/default')
    placeHolderData = placeHolderData.data.showKeyword
    this.setData({
      placeHolderData
    })
  },

  //获取热搜榜数据
  async getHotList() {
    let hostListData = await request('/search/hot/detail')
    this.setData({
      hostListData:hostListData.data
    })
  },

  //处理搜索框模糊输入效果
  handleInput(event) {
    this.setData({
      inputData:event.detail.value.trim()
    })
    if(isSend) {
      return
    }
    isSend = true
    this.getSearchList()
    setTimeout(()=>{
      isSend = false
    },300)
  },
  //获取模糊匹配条数
  async getSearchList() {
    //输入为空，则不发送请求,并把searchList置为空数组
    if(!this.data.inputData) {
      this.setData({
        searchList:[]
      })
      return
    }
    let result = await request('/search',{keywords:this.data.inputData, limit:10})
    let resultlist = result.result.songs
    this.setData({
      searchList:resultlist
    })
    // 记录搜索记录
    let {historyList, inputData} = this.data
    if(inputData !== ''){
      //判断一下相同的搜索记录不重复，删除原来那个旧的，unshift新的
      if(historyList.indexOf(inputData) !== -1) {
        historyList.splice(historyList.indexOf(inputData),1)
      }
      historyList.unshift(inputData)
      this.setData({
        historyList
      })
      //为避免刷新后数据丢失需要将historyList存到storage中
      wx.setStorageSync('history',historyList)
    }

  },
  // 点击清除搜索框中的内容
  handleClear() {
    let { inputData, searchList } = this.data
    //把输入框置为空
    inputData = ''
    //把模糊匹配数组置为空
    searchList = []
    this.setData({
      inputData,
      searchList
    })
  },
  handleDelete() {
    wx.showModal({
      title:'是否删除历史记录',
      success:(res) =>{
        if(res.confirm) {
          this.setData({
            historyList:[],
          })
          wx.removeStorageSync('history')
        }
      }
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