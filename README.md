# vue-animate

这是一个VUE插件，安装后提供v-animate指令。基础动画基于velocity-animate包，让写动画特效变得简单方便。


# 意图

>`*为什么要做vue-animate插件包？*`

在平时的VUE组件开发过程当中，我逐渐发现写动画是一件不那么轻松愉快的事情。官方推荐使用transition节点内部嵌套v-if/v-show绑定的元素的方式来体现元素入场及退场，以及使用初始值到目标值加setTimeout/setInterval的方式实现动画效果。我觉得这样的处理方式还不够简单，那么以现有的手段，能不能有一个指令并且使用该指令来实现状态到视图的同步，而且这样的指令是一个**可声明式的**、**可配置的**以及**可衔接的**动画同步指令？

答案是肯定的，我选择了VUE官方推荐的动画包velocity-animate。因为使用了**Promise**、**async/await**语法，使用之前请确保**babel插件的配置正确**。


# 安装

>`npm i --save vue-animate-plugin`


# 使用

## 注册

    import Vue from 'vue';
    import VueAnimate from 'vue-animate-plugin';
    
    Vue.use(VueAnimate, {
        valueof: ':', // 表示v-animate指令修饰符中键与值使用什么字符分割，默认使用':'
        begin: 'begin', // 表示v-animate指令修饰符中动画开始之前的挂钩点的名称，可以通过方式`.begin:onBegin`注入钩子函数，它可以是async function
        after: 'complete', // 表示v-animate指令修饰符中动画结束之后的挂钩点的名称，`.complete:onComplete`方式注入钩子，它可以是async function
        callback: null // 表示v-animate指令中，动画部分（包括之后的衔接部分）完全执行完毕后的钩子函数注入口
    });

当然代码中的options部分一般都不需要特别配置，特殊情况除外。

## 指令绑定

下面列出了一些需要注意的事项：

+ 指令必须作用在style属性上，就像这样v-animate:style，并且这样的绑定在一个元素上可以写多次。
+ 指令修饰符是一组键值对的集合，值可以是一个单纯的值，也可以是一个当前context内存在的方法名称。
+ 因为使用了velocity-animate，所以状态绑定部分可以直接使用书写velocity的方式书写。

### Examples

    <div v-animate:style.duration:200.loop:2.delay:1000="{ width: width, height: height }"></div>
    // 表示当div插入文档或者绑定的状态width或height变化时，首先停顿一秒，然后做timeout为200毫秒的动画，并且循环播放两次，最后回到初始状态。

    <div v-if="show" v-animate:style.duration:200.delay:500="{ height: height, opacity: opacity }"></div>
    // 表示当上下文状态show初始值或者变化为true时，动画同步视图，效果是首先停顿500毫秒，然后以timeout为200毫秒的动画，同步height和opacity的值。

    <div v-if="show" v-animate:style.duration:200.complete:onTestComplete="{ translateX: test.positionX, opacity: test.opacity }"></div>
    // 提供了声明式的元素入场及退场动画，退场时除了首先修改test.positionX和test.opacity状态的值，还需要在当前上下文methods中提供onTestComplete钩子函数，并且实现把状态show赋值为false同时修改test.positionX和test.opacity为初始值，以备下次的元素出场。

    <hr v-animate:style.duration:100.progress:onProgress.complete:onComplete="{ width: width }" />
    // 通过在当前上下文中实现钩子函数onProgress可以为进度条提供百分比功能，并且通过实现onComplete钩子函数做进度条的收尾工作。

    <div v-animate:style.duration:100.complete:onSizeComplete="{ width: width, height: height }"
         v-animate:style.duration:300.complete:onOpacityComplete="{ opacity: opacity }"
    ></div>
    // 动画是可衔接的，可以通过实现onSizeComplete或者onOpacityComplete钩子函数，改变opacity或者width和height的状态值。


## 关于钩子函数

指令提供了动画开始前和动画结束后的钩子注入口，可以在指令的修饰符中进行配置。并且注入的钩子可以是普通的function（同步执行）或者是async function（异步串行执行）。

function(veloc, cmd, el, binding, vn, oldvn){}

参数说明：

1. veloc: 表示通过改造为promiseify后的velocity函数，如果要访问原生velocity函数，请调用veloc.naiver。
2. cmd: 表示animate指令钩子的当前实例。
3. el: 表示当前涉及到的元素的实例。
4. binding: 表示指令绑定到元素的信息。比如arg、modifiers、value、oldValue和expression等...
5. vn: 当前的虚拟节点。
6. oldvn: 上一个虚拟节点，在元素插入文档时不可用。

    
    




