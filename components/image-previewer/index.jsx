/**
 * 图片预览组件
 * @author xyk
 * @module ImagePreviewer
 */
import React, { useState, useEffect, useMemo } from "react";
import { Button, Icon, Divider, message } from 'antd';
import PropTypes from "prop-types";


/**
 * 图片预览组件
 * @param {Object}    props
 * @param {{Object}[]}  [props.imgList]               图片url数组,{title:string, url:string}[]
 * @param {Boolean}   [props.visible=false]         是否显示
 * @param {Function}  [props.onClose]               点击关闭事件
 * @param {Number}    [props.currentImg]            首次显示图片在数组中index
 * @param {Boolean}   [props.loop=false]            当前图片为最后一张时，是否跳至第一张
 * @param {String}    [props.controlBar='normal']   控制条样式:none,不显示;lite,精简（默认）;normal,正常
 * @returns {ReactComponent} 图片预览
 */
const ImagePreviewer = (props) => {

  // size.width: 当前播放图片实际width, size.height: 当前播放图片实际height
  const [size, setSize] = useState({ width: 100, height: 100 });
  // margin: 图片容器样式margin-left、margin-top属性，控制图片默认居中
  const [margin, setMargin] = useState({ left: 0, top: 0 });
  // zoomRate: 图片缩放比例，控制缩放
  const [zoomRate, setZoomRate] = useState(1);
  // imgIndex: 显示图片在imgList中index
  const [imgIndex, setImgIndex] = useState(props.currentImg);
  // mouseUp：拖拽图片控制参数，左键是否按下
  const [mouseUp, setMouseUp] = useState(true);
  // mouseX，mouseY：拖拽时，左键KeyDown时坐标
  const [mouseX, setMouseX] = useState();
  const [mouseY, setMouseY] = useState();
  // showZoomRte，控制中心缩放显示区是否显示
  const [showZoomRte, setShowZoomRate] = useState(false);

  // 图片切换
  const changImg = (index) => {
    setImgIndex((index > 0 && index < props.imgList.length) ? index : 0);
    let img = new Image();
    img.src = props.imgList[imgIndex].url;

    let pageWidth = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    let pageHeight = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;

    // 图片加载完成，居中显示
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let zoom = 100;
      zoom = (pageHeight / height) < (pageWidth / width) 
        ? (pageHeight / height) : (pageWidth / width);
      zoom = Math.ceil(zoom * 100);
      zoom = zoom < 100 ? zoom : 100;
      setZoomRate(zoom / 100);
      setSize({ width: width, height: height });
      setMargin({ left: width * zoom / -200, top: height * zoom / -200 });
    };
  };

  // 上一张图片 
  const prev = () => {
    if (props.loop !== true && imgIndex === 0) {
      message.warning('已经是第一张');
      return;
    };
    let index = (imgIndex + props.imgList.length - 1) % props.imgList.length;
    setImgIndex(index);
  };

  // 下一张图片
  const next = () => {
    if (props.loop !== true && imgIndex === props.imgList.length - 1) {
      message.warning('已经是最后一张');
      return;
    };
    let index = (imgIndex + 1) % props.imgList.length;
    setImgIndex(index);
  };

  // 在中心显示缩放比例，duration毫秒后消失
  const zoomRateToast = (duration) => {
    setShowZoomRate(true);
    setTimeout(() => {
      setShowZoomRate(false);
    }, duration);
  };

  // 图片相对实际尺寸放大10%
  const zoomIn = () => {
    zoomRateToast(1000);
    setZoomRate(zoomRate + 0.1);
    setMargin(
      { left: margin.left + size.width * 0.1 / -2, top: margin.top + size.height * 0.1 / -2 }
    );
  };

  // 图片相对实际尺寸缩小10%
  const zoomOut = () => {
    zoomRateToast(1000);
    if (zoomRate <= 0.1) {
      return;
    }
    setZoomRate(zoomRate - 0.1);
    setMargin(
      { left: margin.left - size.width * 0.1 / -2, top: margin.top - size.height * 0.1 / -2 }
    );
  };

  // 滚轮缩放
  const handleWheel = (e) => {
    e.stopPropagation();
    if (e.deltaY > 0) {
      zoomOut();
    }
    else if (e.deltaY < 0) {
      zoomIn();
    }
  };

  // 鼠标左键KeyDowm事件
  const dragDown = (e) => {
    let event = e || window.event;
    event.preventDefault();
    setMouseX(event.clientX);
    setMouseY(event.clientY);
    setMouseUp(false);
  };

  // 鼠标移动事件
  const dragMove = (e) => {
    let event = e || window.event;
    event.preventDefault();
    if (mouseUp === true) {
      return;
    }
    setMouseX(event.clientX);
    setMouseY(event.clientY);
    let leftOffset = event.clientX - mouseX;
    let topOffset = event.clientY - mouseY;
    setMargin({ left: margin.left + leftOffset, top: margin.top + topOffset });
  };

  // 鼠标左键KeyUp事件
  const dragUp = () => {
    setMouseUp(true);
  };

  useEffect(() => {
    setImgIndex(props.currentImg);
    console.log(imgIndex);
  }, [props.currentImg, props.imgList]);

  useEffect(() => {
    changImg(imgIndex);
  }, [imgIndex, props.imgList]);

  return (
    <div>
      <div
        className = {`kant-image-previewer-mask${props.visible === true ? '' : '-none'}`}
        onWheel = {handleWheel}>
        <span className = 'kant-image-previewer-quit'
          onClick = {props.onClose}>
          <Icon type = "close" className = 'kant-image-previewer-quit-icon'/>
        </span>
        <div
          className= 'kant-image-previewer-body' >
          <div 
            className = 'ant-image-previewer-header'>
            <div className = {'kant-image-previewer-title'}>
              <span
                style = {{ fontSize: '18px',color: '#fff' }}>
                {props.imgList[imgIndex].title || ""}
              </span>
            </div>
          </div>
          <div
            className = {`kant-image-previewer-zoom-rate${showZoomRte === true ? '' : '-hide'}`}>
            <span
              style = {{ fontSize: '18px',color: '#fff' }}>
              { `${Math.round(zoomRate * 100)}%` }
            </span>
          </div>
          <div 
            className = 'kant-image-previewer-footer'>
            <ControlBar
              type = {props.controlBar}
              loop = {props.loop}
              zoomRate = {zoomRate}
              current = {imgIndex + 1}
              total = {props.imgList.length}
              zoomIn = {zoomIn}
              zoomOut = {zoomOut}
              prev = {prev}
              next = {next}/>
          </div>
          <div
            className = 'kant-image-previewer-container'
            onMouseDown = {dragDown}
            onMouseMove = {dragMove}
            onMouseUp = {dragUp}
            onMouseOut = {dragUp}
            style={{
              width: size.width * zoomRate,
              height: size.height * zoomRate,
              marginLeft: margin.left,
              marginTop: margin.top
            }}>
            <img
              className = 'kant-image-previewer-img'
              src = {props.imgList[imgIndex].url}
              alt = {'图片读取错误！'} />
          </div>
          <div
            className = 'kant-image-previewer-prev'
            onClick = {prev}>
            <Icon type="left" className = 'kant-image-previewer-prev-icon'/>
          </div>
          <div
            className = 'kant-image-previewer-next'
            onClick = {next}>
            <Icon type = "right" className = 'kant-image-previewer-next-icon' />
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlBar = (props) => {

  return(
    <div
      className = {`kant-image-previewer-control-bar${props.type == 'none' ? '-none' : ''}`}>
      <Button 
        type = {'link'} 
        className = 'bar-item'
        onClick = {props.zoomOut}>
        <Icon type="zoom-out" />
      </Button>
      <Divider type="vertical" style = {{ height: '34px' }}/>
      { props.type === 'normal' ? 
        <React.Fragment>
          <Button 
            type = {'link'} 
            className = 'bar-item-zoom'
            disabled>
            {`${Math.round(props.zoomRate * 100)}%`}
          </Button> 
          <Divider type="vertical" style = {{ height: '34px' }}/>
        </React.Fragment>
        :
        ""
      }
      <Button 
        type = {'link'} 
        className = {'bar-item'}
        onClick = {props.zoomIn}>
        <Icon type="zoom-in" />
      </Button>
      <Divider type="vertical" style = {{ height: '48px' }}/>
      <Button 
        type = {'link'} 
        className = {'bar-item'}
        onClick = {props.prev}
        disabled = {props.loop === false && props.current === 1 ? true : false}>
        <Icon type="left" />
      </Button>
      <Divider type="vertical" style = {{ height: '34px' }}/>
      { props.type === 'normal' ? 
        <React.Fragment>
          <Button 
            type = {'link'} 
            className = {'bar-item-page'}
            disabled>
            {`${props.current}/${props.total}`}
          </Button> 
          <Divider type="vertical" style = {{ height: '34px' }}/>
        </React.Fragment>
        :
        ""
      }
      <Button 
        type = {'link'} 
        className = {'bar-item'}
        onClick = {props.next}
        disabled = {props.loop === false && props.current === props.total ? true : false}>
        <Icon type="right" />
      </Button>
    </div>
  );
};

ImagePreviewer.propTypes = {
  imgList: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.any,
    url: PropTypes.string.isRequired
  })),
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  currentImg: (props, propName, componentName) => {
    let { currentImg } = props;
    if (currentImg < 0 || currentImg < props.imgList.length){
      return new Error(`组件${componentName}的${propName}大于imgList长度或小于0`);
    }
  },
  loop: PropTypes.bool,
  controlBar: PropTypes.oneOf(['none', 'normal', 'lite']),
};

ImagePreviewer.defaultProps = {
  visible: false,
  currentImg: 0,
  bool: false,
  controlBar: 'lite',
};

export default ImagePreviewer;