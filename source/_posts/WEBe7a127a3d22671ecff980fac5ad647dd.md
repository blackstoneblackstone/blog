title: 解决使用react-image-lightbox组件，关闭后元素自动滑动问题（tabindex）
tags: 
  - Code
categories: 
  - Code
comments: true
count: 13
date: 2018/12/4
---
  > 这个问题让你有必要深刻的看看`tabindex="-1"`的原理。

由于这个问题实在不好描述，那就直接上图。

## 问题如下

![](http://user-gold-cdn.xitu.io/2018/12/4/167751fc9c9b1bc9?w=770&h=578&f=gif&s=2305962)

## 解决后

![](http://user-gold-cdn.xitu.io/2018/12/4/167751ffb4df5134?w=566&h=580&f=gif&s=3887706)

那我是怎么解决的呢？先来看看下面的使用代码。

## 测试代码
> 你可以在github上看到：https://github.com/lihongbin100/use-react-image-lightbox

主要代码

```javascript

import React, { Component } from 'react'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css' // This only needs to be imported once in your app

const images = [
  '//placekitten.com/1500/500',
  '//placekitten.com/4000/3000',
  '//placekitten.com/800/1200',
  '//placekitten.com/1500/1500'
]

export default class LightboxExample extends Component {
  constructor (props) {
    super(props)

    this.state = {
      photoIndex: 0,
      isOpen: false
    }
  }

  render () {
    const { photoIndex, isOpen } = this.state

    return (
      <div>
        <div style={{ height: '100px', width: '400px', background: '#ccc' }}>

        </div>
        <div tabIndex="-1" style={{ height: '1000px', width: '400px', background: '#ddd' }}
             onClick={() => this.setState({ isOpen: true })}>
          Open Lightbox
        </div>

        {isOpen && (
          <Lightbox
            // 该prop解决关闭弹窗后下层元素滑动
            reactModalProps={{ shouldReturnFocusAfterClose: false }}
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}
      </div>
    )
  }
}
```

## 解决这个问题
> 这个问题就是tabindex的坑，由于底部高度为1000px的div，会有滑动条，而且用了tabindex=-1，react-image-lightbox 也使用了tabindex=-1，于是当关闭lightBox以后，会把焦点移到底部的div，底部div被获得焦点，于是浏览器把它置顶了。

这个问题官方也有答案，但是我真的是找了一天啊！怪我。

## 官方解决
> 来看看这个问题的答案吧：
https://github.com/frontend-collective/react-image-lightbox/issues/60


## 总结
> 使用 
```
reactModalProps={{ shouldReturnFocusAfterClose: false }}
```
完美解决，这个属性是react-modal的props。

----
> 欢迎访问我的Blog：http://yondu.vip