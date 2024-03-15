<template>
  <div id="app">
    <!-- <HeaderBar /> -->
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from '@/components/ThemePicker';
import HeaderBar from '@/components/HeaderBar';
import { deptTreeSelect } from '@/api/system/user';
import { getToken } from '@/utils/auth';

export default {
  name: 'App',
  dicts: ['sys_worship_tuiyijunrenanzhileibie'],
  components: { ThemePicker, HeaderBar },
  computed: {},
  mounted() {
    const token = getToken();
    if (Boolean(token)) {
      console.log('App mounted', token);
      this.$store.dispatch('getDivisionsTreeData');
      this.$store.dispatch('getPersonType');
      this.$store.dispatch('getTodoSignData');
      this.getAnZhiType();
      this.getDeptTreeSelectDict();
    }
  },
  methods: {
    getAnZhiType() {
      setTimeout(() => {
        let list = JSON.parse(JSON.stringify(this.dict.type.sys_worship_tuiyijunrenanzhileibie));
        let arr = [
          {
            label: '退役干部',
            value: '1',
            children: [],
          },
          {
            label: '退役士兵',
            value: '2',
            children: [],
          },
          {
            label: '复员军人',
            value: '3',
            children: [],
          },
        ];
        arr.forEach((e, index) => {
          let key = index + 1;
          e.children = list.filter((f) => f.value.indexOf(key) == 0);
        });
        console.log(arr);
        this.$store.commit('SET_ANZHITYPEDICT', arr);
      }, 2000);
    },
    getDeptTreeSelectDict() {
      deptTreeSelect({
        whetherStock: 1,
      }).then((res) => {
        this.$store.commit('SET_DEPTTREESELECTDICT', res.data);
      });
    },
  },
  metaInfo() {
    return {
      title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE;
      },
    };
  },
};
</script>
<style scoped lang="scss">
#app .theme-picker {
  display: none;
}
</style>
