/**
 * 悬停菜单栏
 * @author dxl
 * @module FixedMenu
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * 悬停菜单栏
 *
 * @class
 * @extends React.Component
*/
class FixedMenu extends React.Component {
/**
 * Creates an instance of FixedMenu
 * @memberof FixedMenu
 * @param {Object}   props
 * @param {Number}   [props.showHeight]        悬停菜单出现的滚动高度
 * @param {Function} [props.onClickTop]        点击顶部触发事件
 * @param {Boolean}  [props.isShow]            初始是否默认显示悬停菜单
 * @param {Boolean}  [props.isAlways]          悬停菜单栏是否一直存在
 * @param {String}   [props.className]         悬停菜单盒子的类名
 * @param {String}   [props.topClassName]      悬停菜单上部盒子类名
 * @param {String}   [props.bottomClassName]   悬停菜单底部盒子类名
 * @param {Function} [props.topDom]            悬停菜单顶部传入自定义dom
 * @param {Function} [props.bottomDom]         悬停菜单底部传入自定义dom
 * @param {Function} [props.onClickBottom]     底部自定义事件
 * @param {Boolean}  [props.useChange]         是否使用初始动效
*/
  constructor(props){
    super(props);
    this.state = {
      isShow: this.props.isShow || false,
      isChange: false,
    };
  }
  componentDidMount(){
    document.addEventListener('scroll', this.debounce(this.onScroll, 50));
  }


  toogelStyleChange = () => {
    const useChange = this.props.useChange;
    if (useChange) {
      const isChange = !this.state.isChange;
      this.setState({ isChange });
    }
  };

  componentWillUnmount(){
    document.removeEventListener('scroll', this.onScroll);
  }
  render(){
    const topDom = this.props.topDom ? this.props.topDom : null;
    const bottomDom = this.props.bottomDom ? this.props.bottomDom : null;
    const isChange = this.state.isChange;
    const useChange = this.props.useChange;
    return (
      <div className={`${this.sideBlockClassName} kant-fixedmenu-content ${this.props.className}`}>
        <div className={`kant-side-block-list`}>
          <div
            onClick={ this.props.onClickTop
              ? () => {this.props.onClickTop(); this.toogelStyleChange();}
              : this.toogelStyleChange
            }
            className={
              !useChange ? `kant-changetop  ${this.props.topClassName} kant-cp`
                : `${'kant-side-block-list-weixin'}
              ${this.props.topClassName}
              kant-cp `}>
            { topDom ? topDom(isChange, this.scrollToTop) : '' }
          </div>

          <div
            onClick={(e) => {
              this.props.onClickBottom && useChange && isChange ? this.props.onClickBottom()
                : this.scrollToTop(); e.stopPropagation();
            }}
            className={
              `${'kant-side-block-list-arrow'}
              ${this.props.bottomClassName}
              kant-cp `}>
            { bottomDom ? bottomDom(isChange) : '' }
          </div>
        </div>
      </div>
    );
  }

  // 获取 document.scrollTop
  get scrollTop(){
    return (
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop
    );
  }

  // 计算样式
  get sideBlockClassName(){
    let className = 'kant-side-block';
    this.state.isShow
      ? (className = `${className} kant-show`)
      : (className = `${className} kant-hidden`);
    return className;
  }

  // 滚动到顶部
  scrollToTop = () => {
    // speed: 速度（时间）, span 跨度(每次递减数值)
    const animate = (speed = 10, span = 100) => {
      setTimeout(() => {
        let pretreatment = this.scrollTop - span;
        pretreatment < 0 ? (pretreatment === 0) : animate(speed, span);
        this.setScrollTop(pretreatment);
      }, speed);
    };
    // （时间， 跨度）
    animate(10, 100);
  }

  setScrollTop(value){
    document.documentElement.scrollTop = value;
    window.pageYOffset = value;
    document.body.scrollTop = value;
  }

  /**
   * e
   * @param {Event} e
   */
  onScroll = (e) => {
    const showHeight = this.props.showHeight || 0;
    if (this.props.isAlways === true) {
      this.setState({ isShow: true });
    } else if (!this.props.isAlways && this.scrollTop > showHeight && !this.state.show ){
      this.setState({ isShow: true });
    } else if ( !this.props.isAlways && this.scrollTop < showHeight && this.state.show ){
      this.setState({ isShow: false });
    }
  }

  /**
   * 防抖
   *
   * @memberof FixedMenu
   * @param {Function} func 方法
   * @param {Number} wait 时间
   * @returns {Function}
   */
  debounce = (func, wait) => {
    let timeout;
    return function () {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
}

FixedMenu.propTypes = {
  onClickTop: PropTypes.func,
  isShow: PropTypes.bool,
  isAlways: PropTypes.bool,
  className: PropTypes.string,
  topClassName: PropTypes.string,
  bottomClassName: PropTypes.string,
  topDom: PropTypes.func,
  bottomDom: PropTypes.func,
  onClickBottom: PropTypes.func,
  useChange: PropTypes.bool,
};

FixedMenu.defaultProps = {
  onClickTop: null,
  onClickBottom: null,
  isShow: false,
  bottomDom: null,
  topDom: null,
  useChange: false,
};

export default FixedMenu;

