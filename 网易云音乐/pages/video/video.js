// pages/video/video.js
import request from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[],
    navId:0,
    videoList:[], //视频数据
    videoId:'', //正在播放的视频id
    videoTimeRecord:[], //已播放的视频播放时间的记录
    isTriggered:false //标志是否下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNavlist()
  },
  toSearch() {
    wx.navigateTo({
      url:'/pages/search/search'
    })
  },

  // 获取视频区导航栏数据
  async getNavlist() {
    let navList = await request('/video/group/list')
    navList = navList.data.slice(0,14)
    this.setData({
      navList,
      navId : navList[0].id
    })
    this.getVideoList(this.data.navId)
  },

  // 获取对应视频分类的视频数据
  async getVideoList(navId) {
    let videoList = await request('/video/group',{id: navId})
    //关闭视频加载提示
    wx.hideLoading()
    let index = 0
    this.setData({
      videoList:videoList.datas.map(item => {
        item.id = index++
        return item
      }),
      //关闭下拉刷新
      isTriggered:false
    })
  },

  //点击切换视频分类
  navTap(event) {
    //使用id向event传参，如果参数是Number类型，自动转化为String
    this.setData({
      navId:event.currentTarget.id - 0 //使用id传参
      // navId:event.currentTarget.dataset.navId
    })
    this.getVideoList(this.data.navId)
    wx.showLoading({
      title:'正在加载'
    })
    this.setData({
      videoList:[]
    })
  },
  //处理多个视频同时播放问题/视频播放回调
  handlePlay(event) {
    /*
    1.创建VideoContext 实例
    2.要想将上个正在播放的视频停掉，需要获取到上一个视频的VideoContext实例
    3.保证停掉的是上个视频，不要停掉自身
     */
    let vid = event.currentTarget.id
    // this.vid !== vid && this.VideoContext && this.VideoContext.stop()
    // this.vid = vid
    this.setData({
      videoId:vid
    })
    this.VideoContext = wx.createVideoContext(vid)
    // 判断当前播放的视频是否有过播放记录，若有，则跳转到之前播放的位置
    let { videoTimeRecord } = this.data
    let exist = videoTimeRecord.find(item => item.vid === vid)
    if(exist) {
      this.VideoContext.seek(exist.currentTime)
    }
    this.VideoContext.play()
  },
  // 监听视频播放时间改变的回调
  videoPlayTimeChange(event) {
    let videoRecordObj = {vid:event.currentTarget.id, currentTime:event.detail.currentTime}
    let {videoTimeRecord} = this.data
    // 判断：当数组中已有该视频的记录对象，则只需修改时间，若没有，则push
    let existItem = videoTimeRecord.find(item => item.vid === event.currentTarget.id)
    if(existItem) {
      existItem.currentTime = event.detail.currentTime
    }else{
      videoTimeRecord.push(videoRecordObj)
    }
    this.setData({
      videoTimeRecord
    })
  },
  // 视频播放结束的回调
  handleVideoEnd(event) {
    //结束时清除videoTimeRecord数组中的对应信息
    let { videoTimeRecord } = this.data
    let targetIndex  = videoTimeRecord.findIndex(item => item.vid === event.currentTarget.id)
    videoTimeRecord.splice(targetIndex, 1)
    this.setData({
      videoTimeRecord
    })
  },
  //处理下拉刷新
  handleRefresh () {
    this.getVideoList(this.data.navId)
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
    console.log('下拉刷新')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('上拉触底了')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({from}) {
    if(from === 'button') {
      return {
        title:'我的音乐小程序(来自button的转发)'
      }
    }
    else{
      return {
        title:'我的音乐小程序(来自menu的转发)'
      }
    }
  }
})