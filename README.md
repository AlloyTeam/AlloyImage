[AlloyImage](http://alloyteam.github.com/AlloyPhoto/) - 基于HTML5技术的专业图像处理库
===========================

### 功能特性

####强大功能
1. 基于多图层操作             -- 一个图层的处理不影响其他图层
2. 与PS对应的17种图层混合模式 -- 便于PS处理教程的无缝迁移
3. 多种基本滤镜处理效果       -- 基本滤镜不断丰富、可扩展
4. 基本的图像调节功能         -- 色相、饱和度、对比度、亮度、曲线等


####便捷开发
1. 简单快捷的API              -- 链式处理、API简洁易用、传参灵活
2. 多种组合效果封装           -- 一句代码轻松实现一种风格
3. 友好参数支持               -- 中、英文参数双向支持，降低专业词汇记忆门槛
4. 接口一致的单、多线程支持   -- 单、多线程切换无需更改一行代码，多线程保持快捷API特性
5. 可预见的错误友好提醒       -- 对一些可能出现错误的地方提醒，方便开发与调试


####丰富扩展
1. 方便的添加功能扩展         -- 轻松添加滤镜插件
2. 为扩展提供数学封装         -- 封装了一些数学模块供扩展调用

###建议使用场景
1.桌面软件客户端内嵌网页运行方式
        >>>打包webkit内核: 用户较大头像上传风格处理、用户相册风格处理(处理时间平均<1s)

2.Win8 Metro应用
        >>>用户上传头像，比较小的图片风格处理后上传（Win8下IE10支持多线程）

3.Mobile APP
        >>>Andriod平台、IOS平台小图风格web处理的需求，如phoneGap应用, 在线头像上传时的风格处理、mobile web端分享图片时风格处理等

### 如何构建源码？

首先使用git clone复制一份AlloyPhoto的代码到本地：
```sh
 git clone git://github.com/AlloyTeam/AlloyPhoto.git
```
然后使用npm安装[modjs](https://github.com/modulejs/modjs)：
```sh
 npm install -g modjs
```
安装成功后:
```sh
cd AlloyPhoto && mod dist
```
构建成功后会在 `./js/combined`目录下生成`alloyimage.js`文件

### 变更历史
#### AlloyImage 1.2开发版代码 获取
> 在release目录下获取开发版

#### AlloyImage 1.2 开发中
1. 更改代码架构，分离Filter
2. 添加工具方法支持：色系提取
3. 添加下载文件方法
4. 添加 棕褐色 滤镜
5. 添加 色调分离 滤镜
6. 添加 Gamma 调节
7. 更改代码，分离Alteration
8. 添加仿射变换（缩放、平移、旋转）、裁切
9. 增加可选颜色调节
10. 曲线命令支持通道调节
11. 优化IOS下性能，修复变形的bug


##### 新增API 1.2以上

>###$AI 或 AlloyImage
初始化一个AlloyImage对象<br />
增加新的参数适配 AIObj $AI(HTMLImageObj img[, Number width, Number height]);<br />
{img} 图片元素<br />
{width} 缩放的宽度 可选<br />
{height} 缩放的高度 可选<br />
如果width 或height一个为null，则使用等比缩放，如果都没有，使用img宽度
tips: 在IOS下请使用width参数来缩放相册中的图片，IOS下不使用缩放，图片太大可能无法绘制到Canvas上<br />

示例
```javascript
var ps = $AI(img, 600).save('jpg', 0.6);
```

>###save
将合成图片保存成base64格式字符串<br />
base64String save(String filetype [, Number comRatio]);<br /><br />
{filetype}  图片格式类型，支持png,jpg,gif等<br />
{comRatio}  对于jpg格式的图片，图片压缩比率或者图片质量，0 - 1的小数<br /><br />
返回  base64的字符串

示例
```javascript
var string = AlloyImage(img).save('jpg', 0.8);
```
>###saveFile
将合成图片下载到本地<br />
void saveFile(String fileName[, Number comRatio]);<br /><br />
{fileName}  图片文件名，如果不带后缀，默认为png格式<br />
{comRatio}  对于jpg格式的图片，图片压缩比率或者图片质量，0 - 1的小数<br /><br />
返回  空

示例
```javascript
img.onclick = function(){
        AlloyImage(this).saveFile('处理后图像.jpg', 0.8);
}
```

>###download
功能与使用同saveFile

&nbsp;

>###transform
进行仿射变换<br />
AIObj transform(Array Matrix); <br /><br />
{Matrix} 变换矩阵 数组 [a1, a2, b1, b2, dx, dy]<br />
如水平翻转 [-1, 0, 0, 1, 0, 0]<br />
示例
```javascript
//将图层垂直翻转
AlloyImage(img).transform([1, 0, 0, -1, 0, 0]).show();
```

&nbsp;
>###scaleTo
将图层或合成图像缩放到指定宽高<br />
AIObj scaleTo(Number width, Nubmer height);<br /><br />
{width} 宽度<br />
{height} 高度<br />
如果不指定某一参数，则使用等比缩放
<br /><br />
返回 AIObj

示例
```javascript
//将图层缩放放到100px * 100px
AlloyImage(img).scaleTo(100, 100).show();

//将图层等比缩放到高50px
AlloyImage(img).scaleTo(null, 100).show();
```
>###scale
将图层或合成图像缩放指定倍数<br />
AIObj scale(Number xRatio, Nubmer yRatio);<br /><br />
{xRatio} 横向缩放倍数<br />
{yRatio} 纵向缩放倍数<br />
如果不指定某一参数，则使用等比缩放
<br /><br />
返回 AIObj

示例
```javascript
//将图层缩放放2 * 2倍
AlloyImage(img).scale(2, 2).show();

//将图层等比缩放3倍
AlloyImage(img).scale(3).show();
```
>###rotate
将图层或合成图像旋转一定的角度<br />
AIObj rotate(Numbe degree);<br /><br />
{degree} 顺时旋转角度，以度为单位<br />
<br /><br />
返回 AIObj

示例
```javascript
//将图层旋转30度
AlloyImage(img).rotate(30).show();

```

>###clip
将图层或合成图像裁剪<br />
AIObj rotate(Numbe x0, Number y0, Number width, Number height);<br /><br />
{x0} 起始横坐标<br />
{y0} 起始纵坐标<br />
{width} 裁剪图像宽度<br />
{height} 裁剪图像高度<br />
<br /><br />
返回 AIObj

示例
```javascript
//将图层从(30, 30)开始裁剪宽100px高100px的图像，并获取图像base64代码
var imgString = AlloyImage(img).clip(30, 30, 100, 100).save('jpg', 0.8);

```

>###drawRect
画出合成像的直方图<br />
void drawRect(String seletor, String channel);<br /><br />
{seletor} 直方图绘制的wrapper<br />
{channel} 要绘制的通道， 比如 'RG', 'GB', 默认为'RGB'
<br /><br />
返回 空

示例
```javascript
var imgString = AlloyImage(img).drawRect('#p');

```

##预览、撤销、重做
>###doView
保存view的中间结果，下次使用view将会根据上次doView之前的结果进行处理，与undoView结合，可进行撤销操作<br />
AIObj doView();<br />
返回 AIObj<br />
示例参照undoView方法

&nbsp;

>###undoView
撤销上次view的执行结果
AIObj undoView();
返回 AIObj

示例
```javascript
var layer = $AI(img);
layer.view("setHSI", 10, 0, 0).show();

// 再次调节 这次还是基于原图调节
layer.view("setHSI", -10, 0, 0).show();

//调节好了 保存这次结果
layer.doView();

// 基于上次的调节结果进行计算
layer.view("brightness", 10, 0, 0).show();

// 不满意 撤销亮度调节操作
layer.undoView().show();

// 回到最原始的图像
layer.undoView().show();

```





#### AlloyImage 1.1
1. 优化代码，组合效果处理性能提升80%
2. 添加木雕组合效果

#### AlloyImage 1.0

### 目录结构
>--build  构建目录  一些项目的构建工具

>--combined  中间构建合成的项目代码，用于测试和发布

>--demo      demo文件

>--doc       目录文档

>--release   已发布的文件版本

>--res       一些测试用的静态资源

>--src       项目JS源码

>>    alloyimage.base.js   core文件 base文件

>>    --module             模块文件

>>       --alteration     调节模块

>>        --filter         滤镜插件
>--test      测试文件

### 这些产品使用了AlloyImage

[AlloyDesigner](http://alloyteam.github.io/AlloyDesigner/)

[AlloyClip](https://github.com/AlloyTeam/AlloyClip)

[AlloyPhoto](https://github.com/AlloyTeam/AlloyPhoto)
