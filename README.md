# threejs_model_view

#### 介绍
使用threejs和原生javascript对glb模型进行预览展示的小应用，目前只支持glb格式，对于gltf暂不支持。


#### 软件架构
1、Threejs+WebGL+javascript+GLB


#### 安装教程

1.  下载代码至本地仓库，可以部署至任意的web服务器，如nginx或者apache及tomcat等。

#### 使用说明

1.  以nginx部署为例，将nginx启动后，输入http://localhost:port/xxx/index.html
2.  可以看到以下效果
![输入图片说明](https://images.gitee.com/uploads/images/2022/0124/091949_502d9c6e_481512.jpeg "model1.jpg")
3.  替换模型代码如下：

```
<div id="modelBorderContainer">
    <div id="modelBorder"></div>
</div>
<script type="application/javascript">
    var modelUrl = 'models/GroundVehicle.glb';     //定义所使用模型路径
</script>
<script src="lib/three.min.js?v=2.0.3"></script>
<script src="lib/OrbitControls.js?v=2.0.3"></script>
<script src="lib/GLTFLoader.js?v=2.0.3"></script>
<script src="lib/WebGL.js?v=2.0.3"></script>
<script src="lib/stats.min.js?v=2.0.3"></script>
<script src="lib/3dmodel.js?v=2.0.3"></script>
```
4、本案例参考了[three.js加载3D模型](https://blog.csdn.net/qq_41787619/article/details/94719331),将博主的代码进行一些精简

5、实例代码在使用thymeleaf等模板引擎开发时，可能会发生鼠标点击后，模型消失的问题，如果发生这种情况，可以在展示页面的html标记结束后天添加一行注释可解决此问题。如下：

```
...
</html>
<%-- xxx-->
```



#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
