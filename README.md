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
        begin: 'begin', //表示v-animate指令修饰符中动画开始之前的挂钩点的名称，可以通过方式`.begin:onBegin`注入钩子函数，它可以是async function
        after: 'complete', // 表示v-animate指令修饰符中动画结束之后的挂钩点的名称，`.complete:onComplete`方式注入钩子，它可以是async function
        callback: null // 表示v-animate指令中，动画部分（包括之后的衔接部分）完全执行完毕后的钩子函数注入口
    });

当然代码中的options部分一般都不需要特别配置，特殊情况除外。
