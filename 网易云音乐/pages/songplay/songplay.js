// pages/songplay/songplay.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from "../../utils/request";
let appInstance = getApp(); //获取全局app实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false, //是否播放
    song:{},//歌曲的信息
    currentTime:'00:00', //歌曲当前的播放时间
    totalTime:'00:00', //歌曲总共的播放时间
    currentWidth:0 //当前播放进度条的宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options会接收路由的query参数
    let songId = options.songId
    this.getSongInfo(songId)
    //解决销毁页面页面播放状态问题
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === songId) {
      this.setData({
        isPlay:true
      })
    }
    //解决系统播放栏控制音频播放状态与isPlay不一致的问题
    //获取背景音乐管理器
    this.BackgroundAudioManager = wx.getBackgroundAudioManager()
    //监听音乐暂停的回调
    this.BackgroundAudioManager.onPause(() => {
      this.controlIsPlay(false)
    })
    //监听音乐播放的回调
    this.BackgroundAudioManager.onPlay(() => {
      this.controlIsPlay(true)
      // 将歌曲Id同步到全局app的globalData中
      appInstance.globalData.musicId = songId
    })
    //监听音乐停止的回调（真机上用户点右边的X）
    this.BackgroundAudioManager.onStop(()=>{
      this.controlIsPlay(false)
    })
    //监听音乐时间更新的回调
    this.BackgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.BackgroundAudioManager.currentTime*1000).format('mm:ss')
      let currentWidth = this.BackgroundAudioManager.currentTime / this.BackgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听音乐播放结束
    this.BackgroundAudioManager.onEnded(()=>{
      //播放下一首
      PubSub.publish('type','next')
      //把进度条和播放时间重置到初始状态
      this.setData({
        currentTime:'00:00',
        currentWidth:0
      })
    })
  },
  // 获取歌曲信息
  async getSongInfo(songId) {
    let songInfo = await request('/song/detail',{ids:songId})
    let totalTime = songInfo.songs[0].dt
    totalTime = moment(totalTime).format('mm:ss')
    this.setData({
      song:songInfo.songs[0],
      totalTime
    })
    wx.setNavigationBarTitle({
      title:this.data.song.name
    })
  },
  // 控制ispLay状态
  controlIsPlay(state) {
    this.setData({
      isPlay:state
    })
    // 将歌曲状态同步到全局app的globalData中
    appInstance.globalData.isMusicPlay = state
  },
  // 歌曲播放/暂停的回调
  handleSongPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    let songId = this.data.song.id
    let songName = this.data.song.name
    this.controlPlay(songId,songName)
  },

  //控制歌曲播放/暂停
  async controlPlay(songId,songName) {
    if(this.data.isPlay) {
      //获取歌曲的播放路径
      let musicItem = await request('/song/url',{id:songId})
      let musicPath = musicItem.data[0].url;
      this.BackgroundAudioManager.src= musicPath
      this.BackgroundAudioManager.title= songName
    }else{
      this.BackgroundAudioManager.pause()
    }
  },
  //点击播放上一首/下一首
  checkSong(event) {
    let type = event.currentTarget.id
    if(type === 'prev') {
      PubSub.subscribe('musicId', (msg,data) => {
        // 根据id获取歌曲详情信息
        this.getSongInfo(data)
        //切换时自动播放
        this.controlPlay(data,this.data.song.name)
        //因为退出到推荐列表界面再进入播放界面可能创建多个重复的订阅subscribe回调，所以要把之前的subscribe取消
        PubSub.unsubscribe('musicId')
      })
      //消息发布
      PubSub.publish('type','prev')
    }else{
      PubSub.subscribe('musicId',(msg,data)=>{
        // 根据id获取歌曲详情信息
        this.getSongInfo(data)
        //切换时自动播放
        this.controlPlay(data,this.data.song.name)
        PubSub.unsubscribe('musicId')
      })
      //消息发布
      PubSub.publish('type','next')
    }
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
