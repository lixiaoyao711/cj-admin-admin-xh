<script>
export default {
  name: 'MenuItem',
  functional: true,
  data() {
    return {
      currentIndex: true,
    };
  },
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    item: {
      type: Object,
    },
    todoList: {
      type: Object,
    },
  },

  render(h, context) {
    const { icon, title, todoList, item } = context.props;
    const vnodes = [];
    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      for (const key in todoList) {
        if (key === '待转出' && item.path === 'carePersonList' && todoList[key] != 0) {
          vnodes.push(
            <span slot="title" title={title}>
              {title}
              <span class="title">{todoList[key]}</span>
            </span>
          );
          return vnodes;
        }
        if (title === key && todoList[key] != 0) {
          vnodes.push(
            <span slot="title" title={title}>
              {title}
              <span class="title">{todoList[key]}</span>
            </span>
          );
          return vnodes;
        }
      }

      if (title.length > 5) {
        vnodes.push(
          <span slot="title" title={title}>
            {title}
          </span>
        );
      } else {
        vnodes.push(<span slot="title">{title}</span>);
      }
    }
    return vnodes;
  },
};
</script>
<style lang="scss" scoped>
.title {
  color: #fff;
  margin: 0 0 0 6px;
  width: 18px;
  height: 18px;
  border: 1px solid #fff;
  border-radius: 30px;
  background: red;
  display: inline-block;
  text-align: center;
  line-height: 16px;
}
</style>
