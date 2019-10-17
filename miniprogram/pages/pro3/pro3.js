// pages/pro3/pro3.js
const audio = wx.getBackgroundAudioManager();
const db = wx.cloud.database({
  env: "weixinapp-piafg"
});
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    userImage:"https://ali.image.hellorf.com/images/81d779cef3ca7a7b3f606cf6fd53157f.jpeg",   //用户头像
    userName : "",  //用户名称
    songs: [],      //歌单列表--其中包含歌曲url
    songUrl: "",    //歌曲路径 
    songTitle:"",   //歌曲标题
    sing:'',         //歌手名称
    songIndex: null,    //当前正在播放歌曲在列表中的下标
    state: 3,     //列表播放状态1-顺序/2-列表循环/3-随机/4-单曲循环
    music: false,     //当前是否再播放歌曲
    suijiList:[],    //随机播放的列表,保存原列表中的所要播放歌曲的下标
    suijixiab:0    //初始值为0,当随机列表完全生成时使用
  },
  // 点击修改播放顺序
  changeState(){
    var state = this.data.state
    if(state<4){
      state++
    }else{
      state = 1
    }
    this.setData({
      state
    })
    if(this.data.state == 3){
      this.setData({
        suijiList:[]
      })
    }
  },
  shang(){
    console.log("点击一次上一首")
    // 顺序播放状态下
    if(this.data.state != 3){
      if (this.data.songIndex == 0) {
        this.bofang(this.data.songs.length - 1)
      } else {
        this.bofang(this.data.songIndex - 1)
      }
    }
    // 随机播放状态下
    else{
      // 如果当前未开始播放歌曲,只触发一次
      if(this.data.suijiList.length == 0){
        this.bofang(this.randomPlay())
      } 
      else if ((this.data.suijixiab - 1) == -1 && (this.data.suijiList.length!=this.data.songs.length)){  //如果上一曲为空,并且随机列表未生成
        console.log("上一首为空,调用随机函数")
        this.bofang(this.randomPlay(true))
      }
      else if (this.data.suijiList.length == this.data.songs.length && (this.data.suijixiab - 1) == -1){
        console.log("随机列表完全生成,随机下标为0,开始播放suijilist.length-1")
        this.setData({
          suijixiab:this.data.suijiList.length-1
        })
        this.bofang(this.data.suijiList[this.data.suijixiab])
      }
      else{
        this.setData({
          suijixiab: this.data.suijixiab - 1
        })
        console.log("播放上一首", this.data.suijiList, this.data.suijiList[this.data.suijixiab])
        this.bofang(this.data.suijiList[this.data.suijixiab])
      }
    }
    console.log("正在播放歌曲:"+this.data.suijiList, this.data.suijiList[this.data.suijixiab])
    console.log("上一首任务执行完毕,此次播放下标为:"+this.data.suijixiab)
  },
  xia(){
    console.log("点击一次下一首")
    if (this.data.state != 3){
      if (this.data.songIndex == this.data.songs.length - 1) {
        this.bofang(0)
      } else {
        this.bofang(this.data.songIndex + 1)
      }
      console.log("不是随机播放")
    }else{
      console.log("是随机播放")
      // 如果列表没有随机完
      console.log(this.data.suijiList.length, this.data.songs.length, this.data.suijixiab, this.data.suijiList.length - 1)
      if(this.data.suijiList.length == 0){
        console.log("初次生成随机列表")
        this.bofang(this.randomPlay(false))
        this.setData({
          suijixiab: 0
        })
      }
      else if ((this.data.suijiList.length != this.data.songs.length) && this.data.suijixiab>=this.data.suijiList.length-1){
        console.log("随机列表未完全生成,调用一次随机播放,在随机列表末尾添加一次")
        this.bofang(this.randomPlay(false))
        this.setData({
          suijixiab:this.data.suijixiab+1
        })
      }
      else if(this.data.suijiList.length == this.data.songs.length){//如果列表随机完,播放随机列表中位于随机列表0下标的原歌曲列表中的歌曲下标
        console.log("随机列表已完全生成")
        if (this.data.suijixiab < this.data.suijiList.length-1){
          this.setData({
            suijixiab: this.data.suijixiab + 1
          })
          this.bofang(this.data.suijiList[this.data.suijixiab])
          console.log(this.data.suijiList, this.data.suijiList[this.data.suijixiab])
        }else{
          this.setData({
            suijixiab: 0
          })
          this.bofang(this.data.suijiList[this.data.suijixiab])
        }
      }
      else if ((this.data.suijiList.length != this.data.songs.length)&& this.data.suijixiab < this.data.suijiList.length-1){
        console.log("随机列表未完全生成,但随机下标小于随机数组的length-1")
        this.setData({
          suijixiab: this.data.suijixiab + 1
        })
        this.bofang(this.data.suijiList[this.data.suijixiab])
      }
    }
    console.log(this.data.suijiList,this.data.suijiList[this.data.suijixiab])
    console.log("下一首按钮任务执行完毕此次随机下标为:",this.data.suijixiab)
  },
  // 随机播放--随机出一个下标(此地址不与正在播放的单曲和已经播放的单曲重复)
  // 每随机一个合法值都会将其保存在随机播放数组中(或前或后)用于上/下一曲使用
  randomPlay(bool) {
    // 如果列表随机完成 -- 返回下标 0
    if (this.data.suijiList.length == this.data.songs.length) {
      console.log("列表随机完毕,播放随机列表中的第一首")
      return 0
    }
    var x = Math.floor(Math.random() * this.data.songs.length)
    for(var i=0;i<=this.data.suijiList.length || this.data.suijiList.length==0;i++){
      if (x == this.data.suijiList[i]) {
        console.log("随机歌曲出现重复,再次调用此函数")
        if (bool == true){
          return this.randomPlay(bool)
        }else{
          return this.randomPlay()
        }
      } else {
        // 不执行操作，再次进行循环
      }
      if (i == this.data.suijiList.length) {
        if(bool == true){
          var s = this.data.suijiList
          s.unshift(x)
          this.setData({
            suijiList: s
          })
          console.log("此次随机结果为:"+x,this.data.suijiList)
          console.log("在数组前添加元素成功")
        }else{
          this.setData({
            suijiList: this.data.suijiList.concat(x)
          })
        }
        console.log("随机下标保存成功,此次随机结果为:"+x, this.data.suijiList)
        return x
        break
      }
    }
  },
  // 传入下标--播放此歌曲,并修改背景音频状态
  bofang(index){
    audio.title = this.data.songs[index].title
    audio.singer = this.data.songs[index].singer
    audio.src = this.data.songs[index].url
    // 修改全局播放状态为true
    this.setData({
      music: true
    })
    // 修改正在播放的歌曲下标为此次播放的下标
    this.setData({
      songIndex: index
    })
    // 修改用户头像为此次播放的歌曲
    this.suijitouxiang(index)
  },
  creat(e){
    if(this.data.state == 3){
      this.setData({
        suijiList: [e.currentTarget.dataset.index]
      })
      console.log(this.data.suijiList)
    }
    // 当前未播放歌曲
    if(!this.data.music){
      this.bofang(e.currentTarget.dataset.index)
    }else{
      // 如果点击的是正在播放歌曲--不做操作
      if (e.currentTarget.dataset.index == this.data.songIndex){

      }else{
        this.bofang(e.currentTarget.dataset.index)
      }
    }
  },
  // 传入下标返回此下标的头像路径,--不直接修改,return一个图片路径
  suijitouxiang(index){
    if (this.data.songs[index].coverImgUrl !== "") {
      this.setData({
        userImage: this.data.songs[index].coverImgUrl
      })
      audio.coverImgUrl = this.data.songs[index].coverImgUrl
    } else {
      console.log("此歌曲没有图片")
      // 查询数据库获取一张随机图片
      db.collection("coverImgUrl")
      .where({
        "_id": "4ed13a22-16a9-423f-932f-e707fbc55409"
      })
      .get()
      .then((res) => {
        var i = this.math(res)
        this.setData({
          userImage: res.data[0].imgUrl[i]
        })
        audio.title = this.data.songs[index].title
        audio.coverImgUrl = this.data.userImage
      })
    }
  },
  // 随机出一个图像下标--与当前不相同的下标
  math(res){
    // 创建一个随机下标
    const i = Math.floor(Math.random() * res.data[0].imgUrl.length)
    // 如果当前随机的图片 不等于 当前显示的图片
    if (res.data[0].imgUrl[i] !== this.data.userImage) {
      return i
    }else{
      console.log("图片随机出现重复,重新随机")
      return this.math(res)
    }
  },
  change(e){
    // 如果当前停止状态
    if(!this.data.music){
      this.creat(e)
      //若果当前播放状态
    }else{
      //若果当前点击歌曲是正在播放歌曲 --暂停
      if (e.currentTarget.dataset.index == this.data.songIndex) {
        audio.pause()
        this.setData({
          music: false
        })
      } else {  //点击新的歌曲 --播放
        this.creat(e)
      }
    } 
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
        console.log(image)
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
    // 监听歌曲播放结束
    audio.onEnded(() => {
      // 1--顺序播放
      if (this.data.state == 1){
        if(this.data.songIndex < this.data.songs.length-1){
          this.setData({
            songIndex:this.data.songIndex+1
          })
          audio.title = this.data.songs[this.data.songIndex].title
          audio.singer = this.data.songs[this.data.songIndex].singer
          this.media(this.data.songs[this.data.songIndex].url)
          audio.src = this.data.songs[this.data.songIndex].url
        }else{
          audio.stop()
          this.setData({
            music: false
          })
          console.log("顺序播放--列表播放结束")
        }
      }
      // 2--列表循环播放
      if (this.data.state == 2){
        if (this.data.songIndex < this.data.songs.length - 1) {
          this.setData({
            songIndex: this.data.songIndex + 1
          })
          audio.title = this.data.songs[this.data.songIndex].title
          audio.singer = this.data.songs[this.data.songIndex].singer
          audio.src = this.data.songs[this.data.songIndex].url
        } else {
          this.setData({
            songIndex: 0
          })
          audio.title = this.data.songs[this.data.songIndex].title
          audio.singer = this.data.songs[this.data.songIndex].singer
          audio.src = this.data.songs[this.data.songIndex].url
          console.log("列表播放结束--列表循环开始")
        }
      }
      // 3--随机播放
      if(this.data.state == 3){
        var i = this.randomPlay()
        try{
          this.bofang(i)
          console.log("随机播放一次")
        }catch(err){
          audio.stop()
          this.setData({
            music: false
          })
          console.log("歌曲随机播放完毕")
          this.setData({
            suijiList:[]
          })
        }

      }
      // 4--单曲循环
      if(this.data.state == 4){
        audio.title = this.data.songs[this.data.songIndex].title
        audio.singer = this.data.songs[this.data.songIndex].singer
        audio.src = this.data.songs[this.data.songIndex].url
        console.log("单曲循环")
      }
      this.suijitouxiang()
    })
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