var bmap = require('../../utils/bmap-wx.js');

var util = require('../../utils/util.js');
var address = require('../../utils/city.js');
let City = require('../../utils/allcity.js');
Page({
  data: {
    loaddingHide: false,//正在加载框
    backgroundC:'#87CEFA',//背景颜色
    backgroundImg:'',//背景图片
    modal: { showModal: false, contnet: '', showshade: false, showModal2:false},
    pickerCity: { addressMenuIsShow: false, animationAddressMenu: {}, value: [0, 0, 0], provinces: address.provinces, citys: address.citys[address.provinces[0].id], areas: address.areas[address.citys[address.provinces[0].id][0].id], areaInfo: ''},
    pm25Show: 'hidden', //是否显示pm2.5详情
    pm25bg: '#00CD00', //pm2.5详情背景
    city: City,
    currentCity: '定位中...',//定位城市：'广州'
    currentWeather: { temperature: '--', weather: '', pm25: '' },//天气信息：{ temperature: '26', weather:'中雨转中到大雨', pm25:'优 48'}
    updateDatetime: '',//更新时间：'更新于 2018-10-16 10:11:20',
    future: [{ date: '-', }, { date: '-', }, { date: '-', }, { date: '-', }], //未来几天天气：[{ date: '今天', dayPictureUrl: 'https://api.map.baidu.com/images/weather/day/zhongyu.png', nightPictureUrl: 'https://api.map.baidu.com/images/weather/night/dayu.png', weather: '中雨转中到大雨', wind: '无持续风向微风', temperature: '27 ~ 21℃' }, { date: '明天', dayPictureUrl: 'https://api.map.baidu.com/images/weather/day/zhongyu.png', nightPictureUrl: 'https://api.map.baidu.com/images/weather/night/dayu.png', weather: '中雨转中到大雨', wind: '无持续风向微风', temperature: '27 ~ 21℃'}, { date: '后天', dayPictureUrl: 'https://api.map.baidu.com/images/weather/day/zhongyu.png', nightPictureUrl: 'https://api.map.baidu.com/images/weather/night/dayu.png', weather: '中雨转中到大雨', wind: '无持续风向微风', temperature: '27 ~ 21℃'}, { date: '周日', dayPictureUrl: 'https://api.map.baidu.com/images/weather/day/zhongyu.png', nightPictureUrl: 'https://api.map.baidu.com/images/weather/night/dayu.png', weather: '中雨转中到大雨', wind: '无持续风向微风', temperature: '27 ~ 21℃'}],
    index: [{ title: 'none', }, { title: 'none', }, { title: 'none', }, { title: 'none', }, { title: 'none', }],//建议列表信息 index: [{ title: '穿衣', tipt: '穿衣指数', zs: '舒适', des: '建议着长袖T恤、衬衫加单裤等服装。年老体弱者宜着针织长袖衬衫、马甲和长裤。' }, { title: '洗车', tipt: '洗车指数', zs: '不宜', des: '不宜洗车，未来24小时内有雨，如果在此期间洗车，雨水和路上的泥水可能会再次弄脏您的爱车。' }, { title: '感冒', tipt: '感冒指数', zs: '较易发', des: '天气转凉，空气湿度较大，较易发生感冒，体质较弱的朋友请注意适当防护。' }, { title: '运动', tipt: '运动指数', zs: '较不宜', des: '有较强降水，建议您选择在室内进行健身休闲运动。' }, { title: '紫外线强度', tipt: '紫外线强度指数', zs: '最弱', des: '属弱紫外线辐射天气，无需特别防护。若长期在户外，建议涂擦SPF在8-12之间的防晒护肤品。' }]
  },
  onLoad: function() {
    refresh(this);
  },
  binddetail(e) {
    console.log(e.detail);
    var that=this;
    refresh(that, e.detail.name);
    this.setData({
      modal: { showshade: false }
    });
    // 返回 例 :{name: "北京", key: "B", test: "testValue"}
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh')
    wx.stopPullDownRefresh({ success:refresh(this)})
  },

  onShareAppMessage: function() {
    return {
      title: '天气',
      path: '/pages/weather/weather',
      // desc: '描述性文字',
    }
  },

  pm25tap: function () {
    showTips(this, '空气质量');
  },

  tips: function (e) {
    // console.log(e);
    showTips(this, e.currentTarget.id);
  },

  maskTap: function () {
    this.setData({
      modal: { showModal: false, contnet: '' }
    });
  },
  maskTap2: function () {
    this.setData({
      modal: { showModal2: false }
    });
  },
  // 显示城市选择
  changecityTap: function () {
    
    this.setData({
      modal: { showshade: true}
    });
  },
  selectchangecityTap(){
    startAddressAnimation(this, true);
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function (e) {
    startAddressAnimation(this, false);
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    startAddressAnimation(this, false);
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    startAddressAnimation(this, false);

    var that = this;
    var value = that.data.pickerCity.value;
    var province = that.data.pickerCity.provinces[value[0]].name;
    var city = that.data.pickerCity.citys[value[1]].name;
    var area = that.data.pickerCity.areas[value[2]].name;
    // 将选择的城市信息显示到输入框
    var areaInfo = province + ',' + city + ',' + area;
    // that.setData({
    //   areaInfo: areaInfo,
    // })
    // console.log(areaInfo);
    if (province.endWith('市')) {
      refresh(that, province);
    } else if (city.endWith("市")) {
      refresh(that, city);
    } else {
      refresh(that, area);
    }
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e);
    var value = e.detail.value
    var provinces = this.data.pickerCity.provinces
    var citys = this.data.pickerCity.citys
    var areas = this.data.pickerCity.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.pickerCity.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        'pickerCity.value': [provinceNum, 0, 0],
        'pickerCity.citys': address.citys[id],
        'pickerCity.areas': address.areas[address.citys[id][0].id],
      })
    } else if (this.data.pickerCity.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        'pickerCity.value': [provinceNum, cityNum, 0],
        'pickerCity.areas': address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        'pickerCity.value': [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },
})

function refresh(that, city) {
  console.log(city)
  that.setData({
    loaddingHide: false,
  });
  var BMap = new bmap.BMapWX({
    ak: 'PK7NXMQEjVDzBf8BsY6ilSucIMY53lVb'
  });
  var fail = function (data) {
    console.log('fail!!!!');
    that.setData({
      loaddingHide: true,
    });
    wx.showModal({ title: '提示', content: '获取数据失败', showCancel: false });
  };
  var success = function (data) {
    console.log('success!!!');
    wx.stopPullDownRefresh;
    var res = data.originalData.results[0];
    console.log(res)
    var temperature = res.weather_data[0].date.match(/实时：(\S*)℃/)[1];
    var weather = res.weather_data[0].weather;
    var now = new Date();
    var hour = now.getHours() 
    if (weather.indexOf("阴") >= 0 && weather.indexOf("雨") < 0) {
      that.setData({
        backgroundImg: 'overcast',
        backgroundC: '#6d8eb1'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#6d8eb1',
      })
    }else if (weather.indexOf("晴") >= 0 && weather.indexOf("多云")<0){
      if (hour>=6&&hour<19){
        that.setData({
          backgroundImg: 'sunny',
          backgroundC: '#51c0f8'
        })
        wx.setNavigationBarColor ({
          frontColor: '#ffffff',
          backgroundColor: '#51c0f8',
        })
      }else{
        that.setData({
          backgroundImg: 'sunny_night',
          backgroundC: '#7f9ee9'
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff', 
          backgroundColor: '#7f9ee9', 
        })
        
      }
    } else if (weather.indexOf("多云") >= 0 && weather.indexOf("雨")<0) {
      if (hour >= 6 && hour < 19) {
          that.setData({
            backgroundImg: 'cloudy',
            backgroundC: '#4cbfee'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#4cbfee',
          })
        } else {
          that.setData({
            backgroundImg: 'cloudy_night',
            backgroundC: '#7f9ee9'
          })
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#7f9ee9',
          })

        }
    } else if (weather.indexOf("雷") >= 0){
      that.setData({
        backgroundImg: 'rain2',
        backgroundC: '#7187dc'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#7187dc',
      })
    }else if (weather.indexOf("雨") >= 0) {
      that.setData({
        backgroundImg: 'rain',
        backgroundC: '#6288db'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#6288db',
      })
    } else if (weather.indexOf("雨") >= 0 && weather.indexOf("雪") >= 0) {
      that.setData({
        backgroundImg: 'sleet',
        backgroundC: '#5697d7'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#5697d7',
      })
    } else if (weather.indexOf("雪") >= 0) {
      that.setData({
        backgroundImg: 'snow',
        backgroundC: '#62b1fe'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#62b1fe',
      })
    } else if (weather.indexOf("雹") >= 0) {
      that.setData({
        backgroundImg: 'hail',
        backgroundC: '#0cb399'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#0cb399',
      })
    } else if (weather.indexOf("雾") >= 0 && weather.indexOf("霾") < 0) {
        that.setData({
          backgroundImg: 'fog',
          backgroundC: '#8badd3'
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#8badd3',
        })
    } else if (weather.indexOf("霾") >= 0){
      that.setData({
        backgroundImg: 'haze',
        backgroundC: '#7f8295'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#7f8295',
      })
    } else if (weather.indexOf("沙") >= 0) {
      that.setData({
        backgroundImg: 'sandstorm',
        backgroundC: '#e89e3b'
      })
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#e89e3b',
      })
    }
    var city_ = res.currentCity;
    if(city_.indexOf("市")>=0){
      city_ = city_.split("市")[0]
    }
    var pm25 = res.pm25;
    var pm25bg = '#67AD03';
    if (pm25 <= 50) {
      pm25 = '优 ' + pm25;
      pm25bg = '#67AD03';
    } else if (pm25 <= 100) {
      pm25 = '良 ' + pm25;
      pm25bg = '#FDAE16';
    } else if (pm25 <= 150) {
      pm25 = '轻度污染 ' + pm25;
      pm25bg = '#B66506';
    } else if (pm25 <= 200) {
      pm25 = '中度污染 ' + pm25;
      pm25bg = '#E10016';
    } else if (pm25 <= 300) {
      pm25 = '重度污染 ' + pm25;
      pm25bg = '#A10048';
    } else {
      pm25 = '严重污染 ' + pm25;
      pm25bg = '#4C0003';
    }
    res.weather_data[0].date = '今天';
    var updateDatetime = '更新于 ' + new Date().Format('MM-dd hh:mm');

    that.setData({
      loaddingHide: true,
      pm25Show: 'visible',
      pm25bg: pm25bg,
      currentCity: city_,
      currentWeather: { temperature: temperature, weather: weather, pm25: pm25 },
      updateDatetime: updateDatetime,
      future: res.weather_data,
      index: res.index,
    });

    /*wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 500
    })*/
    
  }
  BMap.weather({
    fail: fail,
    success: success,
    location: city
  });
}

function showTips(that, index) {
  var content = '';
  if(index === '穿衣') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;穿衣指数：根据自然环境对人体感觉温度影响最主要的天空状况、气温、湿度及风等气象条件，对人们适宜穿着的服装进行分级，以提醒人们根据天气变化适当着装。';
  } else if (index === '洗车') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;洗车指数：是指过去12小时和未来48小时有无雨雪天气，路面是否有积雪和泥水，是否容易使汽车溅上泥水，是否有沙尘等天气条件，给广大爱车族提供是否适宜洗车的建议。洗车指数共分为4级，级数越高，就越不适宜洗车。';
  } else if (index === '感冒') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;感冒指数：是气象部门就气象条件对人们发生感冒的影响程度，根据当日温度、湿度、风速、天气现象、温度日较差等气象因素提出来的，以便市民们，特别是儿童、老人等易发人群可以在关注天气预报的同时，用感冒指数来确定感冒发生的几率和衣服的增减及活动的安排等。';
  } else if (index === '运动') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;运动指数：考虑气象因素和环境对人体的影响，包括紫外线、风力、气压、温度、光照以及雨雪沙尘等，为广大老百姓提供的是否适宜运动的建议。';
  } else if (index === '紫外线强度') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;紫外线指数：指当太阳在天空中的位置最高时（一般是在中午前后，即从上午十时至下午三时的时间段里），到达地球表面的太阳光线中的紫外线辐射对人体皮肤的可能损伤程度。';
  } else if (index === '空气质量') {
    content = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;空气质量指数：将环境空气质量标准和各项污染物对人体健康、生态、环境的影响进行分级表示：\n一级(优)：污染指数 ≤50\n二级(良)：污染指数 ≤100\n三级(轻度)：污染指数 ≤150\n四级(中度)：污染指数 ≤200\n五级(重度)：污染指数 ≤300\n六级(严重)：污染指数 >300';
  }
  if (content != '') {
    that.setData({
      modal: { showModal: true, contnet: content }
    });
  }
}

// 执行动画
function startAddressAnimation(that, isShow) {
  // if (isShow) {
  //   // vh是用来表示尺寸的单位，高度全屏是100vh
  //   that.animation.translateY(0 + 'vh').step()
  // } else {
  //   that.animation.translateY(40 + 'vh').step()
  // }
  // that.setData({
  //   'pickerCity.animationAddressMenu': that.animation.export(),
  //   'pickerCity.addressMenuIsShow': isShow,
  // });

  that.setData({
    'pickerCity.addressMenuIsShow': isShow,
  })
}
