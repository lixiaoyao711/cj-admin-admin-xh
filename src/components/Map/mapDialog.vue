<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      title="选择地址"
      @close="$emit('close')"
      :visible.sync="mapDialogVisible"
      append-to-body
      width="70%"
    >
      <slot name="search"> </slot>
      <div class="map">
        <div ref="container" id="container" :key="propCenter">
          <!-- 点转换经纬度和地址右下角组件 -->
          <PointToaddress v-if="isInfo" :address="address" :latLong="latLong" />
        </div>
        <!-- 地址转换点左上角组件 -->
        <AddressToPoint v-if="isSearch" />
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveMap">确 定</el-button>
        <el-button @click="$emit('close')">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 高德地图
import AMapLoader from '@amap/amap-jsapi-loader';

// 组件
import PointToaddress from '@/components/Map/pointToaddress';
import AddressToPoint from '@/components/Map/addressToPoint';

export default {
  props: {
    //radio单选 checkbox多选 chosen标记
    type: {
      type: String,
      default: 'radio',
    },
    propCenter: {
      type: Array,
      default: () => [120.152477, 30.266623],
    },
    propAddress: {
      type: String,
    },
    markers: {
      type: Array,
      default: () => [],
    },
    isCheck: {
      type: Boolean,
      default: false,
    },
    //控制右下角经纬度和地址显隐
    isInfo: {
      type: Boolean,
      default: true,
    },
    //控制左上角搜索框显隐
    isSearch: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    PointToaddress,
    AddressToPoint,
  },
  data() {
    return {
      mapDialogVisible: true,
      map: null,
      auto: null,
      placeSearch: null,
      geocoder: null,
      search: '',
      marker: [],
      markerOne: [],
      center: [],
      latLong: null,
      address: '',
      addressIsChange: true,
      icon: require('../../assets/images/map/blueMarker.png'),
    };
  },
  computed: {},
  watch: {},
  created() {},
  beforeCreate() {},
  mounted() {
    if (this.type === 'chosen') {
      this.center = this.markers;
    } else {
      this.center = this.propCenter;
      if (this.propAddress) {
        this.address = this.propAddress;
        this.addressIsChange = false;
      }
      this.latLong = `${this.propCenter[0]},${this.propCenter[1]}`;
    }

    AMapLoader.load({
      key: '1a5d681f38e53105624e0a2a2227604f', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Geocoder'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      AMapUI: {
        // 是否加载 AMapUI，缺省不加载
        version: '1.1', // AMapUI 缺省 1.1
        plugins: [], // 需要加载的 AMapUI ui插件
      },
      Loca: {
        // 是否加载 Loca， 缺省不加载
        version: '1.3.2', // Loca 版本，缺省 1.3.2
      },
    })
      .then((AMap) => {
        this.$nextTick(() => {
          if (this.type === 'radio') {
            this.radioInitMap(AMap);
          } else if (this.type === 'checkbox') {
            this.checkboxInitMap(AMap);
          } else if (this.type === 'chosen') {
            this.chosenInitMap(AMap);
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
  },
  methods: {
    // 地图的渲染最好写在init后,避免地图渲染不成功
    radioInitMap(AMap) {
      this.map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始地图级别
        center: this.center, //初始地图中心点
        showIndoorMap: false, //关闭室内地图
      });
      // 地址位置转换工具
      this.geocoder = new AMap.Geocoder({
        radius: 1000, //范围，默认：500
      });
      //输入提示
      AMap.plugin(['AMap.Geocoder', 'AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        //异步同时加载多个插件
        let autoOptions = {
          input: 'tipinput',
        };
        let auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
        }); //构造地点查询类
        AMap.event.addListener(auto, 'select', this.select); //注册监听，当选中某条记录时会触发
      });
      // 地图加载完成回调
      this.map.on('complete', (e) => {
        this.marker = new AMap.Marker({
          position: this.center,
          offset: new AMap.Pixel(-13, -30),
          icon: this.icon,
        });
        !this.isCheck && this.marker.setMap(this.map);
        this.regeoCode(this.latLong);
      });
      // //为地图注册click事件获取鼠标点击出的经纬度坐标
      this.map.on('click', (e) => {
        this.latLong = `${e.lnglat.lng},${e.lnglat.lat}`;
        this.regeoCode(this.latLong);
        // 如果又点标记先删除上一次的标记
        this.marker && this.map.remove(this.marker);
        this.marker = new AMap.Marker({
          position: [e.lnglat.lng, e.lnglat.lat],
          offset: new AMap.Pixel(-13, -30),
          icon: this.icon,
        });
        this.marker.setMap(this.map);
      });
    },
    checkboxInitMap(AMap) {
      this.map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始地图级别
        center: this.center, //初始地图中心点
        showIndoorMap: false, //关闭室内地图
      });
      // 地址位置转换工具
      this.geocoder = new AMap.Geocoder({
        radius: 1000, //范围，默认：500
      });
      //输入提示
      AMap.plugin(['AMap.Geocoder', 'AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        //异步同时加载多个插件
        let autoOptions = {
          input: 'tipinput',
        };
        let auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
        }); //构造地点查询类
        AMap.event.addListener(auto, 'select', this.select); //注册监听，当选中某条记录时会触发
      });
      // 地图加载完成回调
      this.map.on('complete', (e) => {
        // this.marker = new AMap.Marker({
        //     position: this.center,
        //     offset: new AMap.Pixel(-13, -30),
        //   });
        //   !this.isCheck && this.marker.setMap(this.map);
        //   this.regeoCode(this.latLong);
      });
      // //为地图注册click事件获取鼠标点击出的经纬度坐标
      this.map.on('click', (e) => {
        this.latLong = `${e.lnglat.lng},${e.lnglat.lat}`;
        this.regeoCode(this.latLong);
        this.marker = new AMap.Marker({
          position: [e.lnglat.lng, e.lnglat.lat],
          offset: new AMap.Pixel(-13, -30),
          icon: this.icon,
        });
        this.marker.setMap(this.map);
        this.marker.on('click', (e) => this.markerClick(e));
      });
    },
    chosenInitMap(AMap) {
      let center = [this.markers[0].longitude, this.markers[0].latitude];
      this.map = new AMap.Map('container', {
        resizeEnable: true, //是否监控地图容器尺寸变化
        zoom: 13, //初始地图级别
        center: center, //初始地图中心点
        showIndoorMap: false, //关闭室内地图
      });
      // 地址位置转换工具
      this.geocoder = new AMap.Geocoder({
        radius: 1000, //范围，默认：500
      });
      //输入提示
      AMap.plugin(['AMap.Geocoder', 'AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
        //异步同时加载多个插件
        let autoOptions = {
          input: 'tipinput',
        };
        let auto = new AMap.Autocomplete(autoOptions);
        this.placeSearch = new AMap.PlaceSearch({
          map: this.map,
        }); //构造地点查询类
        AMap.event.addListener(auto, 'select', this.select); //注册监听，当选中某条记录时会触发
      });
      // 地图加载完成回调
      this.map.on('complete', (e) => {
        this.center.map((item, index) => {
          this.marker[index] = new AMap.Marker({
            position: [item.longitude, item.latitude],
            offset: new AMap.Pixel(-13, -30),
            icon: this.icon,
          });
          this.marker[index].setMap(this.map);
          this.marker[index].on('click', (e) => this.markerClick(e, index));
        });
      });
    },

    saveMap() {
      console.log(this.latLong, this.address);
      // 如果是单点需要返回经纬度和地址  多选只返回经纬度

      if (this.type === 'radio') {
        this.$emit('saveMap', this.latLong, this.address);
      }
      if (this.type === 'checkbox') {
        let arr = [];
        this.map.getAllOverlays('marker').forEach((item) => {
          const lngLat = [item.getPosition().lng, item.getPosition().lat];
          let name = '';
          this.geocoder.getAddress(lngLat, (status, result) => {
            if (status === 'complete' && result.regeocode) {
              console.log('result', result.regeocode.formattedAddress);
              name = result.regeocode.formattedAddress;
              console.log('name', name);
            } else {
              this.$message.error('根据经纬度查询位置失败');
            }
          });
          arr.push({
            name,
            lngLat,
          });
        });
        this.$emit('saveMap', arr);
      }
      if (this.type === 'chosen') {
        const data = this.center.filter((item) => item.color === 'red');
        this.$emit('saveMap', data);
      }
    },
    select(e) {
      this.placeSearch.setCity(e.poi.adcode);
      this.placeSearch.search(e.poi.name, (status, result, SearchResult) => {
        let center = e.poi.location;
        // 如果又点标记先删除上一次的标记
        if (!this.isCheck) {
          this.marker && this.map.remove(this.marker);
        }
        this.marker = new AMap.Marker({
          icon: this.icon,

          position: [e.poi.location.lng, e.poi.location.lat],
          offset: new AMap.Pixel(-13, -30),
        });
        this.regeoCode(center);
        this.marker.setMap(this.map);
        this.map.setCenter(center); //设置地图中心点
        // 清除maker多余的maker
        this.placeSearch.render.markerList.clear(); // 这个为清除搜索结果的点，不想清除注释即可
        this.markerOne && this.map.remove(this.markerOne);
      }); //关键字查询查询
    },
    // 经纬度转换获取经纬度
    regeoCode(center) {
      console.log('center', center);
      if (center.lat && center.lng) {
        this.latLong = `${center.lng},${center.lat}`;
      } else {
        this.latLong = center;
      }
      this.geocoder.getAddress(center, (status, result) => {
        if (status === 'complete' && result.regeocode) {
          if (this.addressIsChange) {
            this.address = result.regeocode.formattedAddress;
          } else {
            this.addressIsChange = true;
          }
        } else {
          this.$message.error('根据经纬度查询位置失败');
        }
      });
    },
    markerClick(e, index) {
      console.log('e', e, index);
      if (this.type === 'chosen') {
        this.center[index].color = this.center[index].color === 'red' ? 'blue' : 'red';
        let icon = require(`../../assets/images/map/${this.center[index].color}Marker.png`);
        console.log(this.center);
        this.map.remove(e.target);
        this.marker[index] = new AMap.Marker({
          position: [this.center[index].longitude, this.center[index].latitude],
          offset: new AMap.Pixel(-13, -30),
          icon,
          color: 'red',
        });
        this.marker[index].setMap(this.map);
        this.marker[index].on('click', (e) => this.markerClick(e, index));
      }
      if (this.type === 'checkbox') {
        this.map.remove(e.target);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.map {
  height: 500px;
  background: #ffffff;
  position: relative;
  margin: 16px 0 0 0;
  #container {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
<style>
html,
body,
#container {
  height: 100%;
  width: 100%;
}

.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
}

.custom-content-marker img {
  width: 100%;
  height: 100%;
}

.custom-content-marker .close-btn {
  position: absolute;
  top: -6px;
  right: -8px;
  width: 15px;
  height: 15px;
  font-size: 12px;
  background: #ccc;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  line-height: 15px;
  box-shadow: -1px 1px 1px rgba(10, 10, 10, 0.2);
}

.custom-content-marker .close-btn:hover {
  background: #666;
}
</style>
