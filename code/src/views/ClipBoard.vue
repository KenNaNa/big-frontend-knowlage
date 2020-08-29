<template>
  <!-- 粘贴面板组件 -->
  <div class="fy-clip-board-wrap">
    <div class="clip-board-text">{{titleInfo}}</div>
    <!-- copy文本 -->
    <div class="copy-text-wrap">
      <!-- 超链接文字 -->
      <div class="copy-url-text" :class="{'copy-url-bg' : urlBg}" ref="copyUrl" id="copyUrl">{{copyUrl}}</div>

      <!-- 复制链接文字 -->
      <div @click="handleClick" class="copy-link">{{copyLink}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "kClipBoard",
  props: {
    // 复制链接说明
    titleInfo: {
      type: String,
      default: ""
    },
    // url链接
    copyUrl: {
      type: String,
      default: ""
    },
    // url 背景颜色
    urlBg: {
      type: Boolean,
      default: false
    },
    // copy 文字
    copyLink: {
      type: String,
      default: "复制链接"
    }
  },
  setup() {
    const handleClick = () => {
      window.getSelection().removeAllRanges();
      const copyDOM = document.getElementById('copyUrl');
      const range = document.createRange();
      range.selectNode(copyDOM);
      window.getSelection().addRange(range);
      try {
        let successful = document.execCommand("copy");
        console.log(successful);
        alert("复制成功");
      } catch (err) {
        alert("无法复制");
      }
      window.getSelection().removeAllRanges();
    };
    return {
      handleClick
    };
  }
};
</script>

<style lang="scss" scoped>
$font-size-14: 14px;
$font-weight-400: 400;
$font-weight-600: 600;
$color-666: #666;
$color-fff: #fff;
$font-size-16: 16px;
$color-333: #333;
$color-cli-board-dcdcdc: #dcdcdc;

.fy-clip-board-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  .clip-board-text {
    margin-bottom: 8px;
    font-size: $font-size-14;
    font-weight: $font-weight-400;
    color: $color-666;
  }
  .copy-text-wrap {
    display: flex;
    align-items: center;
    .copy-url-text {
      width: 434px;
      padding: 9px 20px;
      background: $color-fff;
      border-radius: 10px;
      font-size: $font-size-16;
      color: $color-333;
      &.copy-url-bg {
        background: $color-cli-board-dcdcdc;
      }
    }
    .copy-link {
      margin-left: 30px;
      font-size: $font-size-14;
      font-weight: $font-weight-600;
      color: $color-333;
      cursor: pointer;
    }
  }
}
</style>