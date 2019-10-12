// pages/pro3/pro3.js
const audio = wx.getBackgroundAudioManager();
const db = wx.cloud.database({
  env: "weixinapp-piafg"
});
const media = require("jsmediatags")
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userImage:"",   //用户头像
    userName : "",  //用户名称
    songs: [],      //歌单列表--其中包含歌曲url
    songUrl: "",    //歌曲路径
    songTitle:"",   //歌曲标题
    sing:''         //歌手名称
  },
  creat(e){
    audio.title = '此时此刻'
    audio.src = e.target.dataset.url;
    console.log(this)    //全局
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户头像
    var image = ""
    new Promise(function(door){
     wx.getUserInfo({
       success(res){
        image = res.userInfo.avatarUrl
        door()
       }
     })
    }).then(()=>{
      this.setData({
        userImage:image
      })
      console.log(this.data.userImage)
    })
    // 获取歌单列表
    db.collection("song")
    .get()
    .then(res=>{
      this.setData({
        songs:res.data
      })
      console.log(this.data.songs)
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