// pages/pro1/pro1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots:true,
    autoplay:true,
    imagesList:[
      { url:"../../images/code-cloud-callback-config.png"},
      { url:"../../images/code-db-inc-dec.png"}
    ],  //轮播图图片
    abc:0,
    num:9
  },
  // 轮播一次后出发的事件
  changeS(event){
    // 当前滑块的index,itemid,事件触发原因
    console.log(event.detail)
  },
  // 轮播图滚动中触发
  changeT(event){
    // left，top值
    // console.log(event.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // setInterval(()=>{
    //   console.log(this.data.abc)
    // },1000)
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