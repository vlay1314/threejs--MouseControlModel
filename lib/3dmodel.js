/*
 * @Author: vlay1314 403964975@qq.com
 * @Date: 2022-01-24 09:37:36
 * @LastEditors: vlay1314 403964975@qq.com
 * @LastEditTime: 2022-09-23 10:37:01
 * @FilePath: /threejs_model_view-master/lib/3dmodel.js
 * @Description: 
 * 
 * Copyright (c) 2022 by vlay1314 403964975@qq.com, All Rights Reserved. 
 */

if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var container, stats, controls;
var camera, scene, renderer, light, bbox, directionalLight;
var rotating = false;
let mixer,mixer2;
var clock = new THREE.Clock();//用于clock.getDelta()
//存放路径对象
let curve = null, CurvePath = null;
let model = null, model2 = null;
//物体运动时在运动路径的初始位置，范围0-1
let progress = 0;
//影响运动速率的一个值，范围0-1，需要和渲染频率结合计算才能得到真正的速率
const velocity = 0.0002;

let gui,labelRenderer;


init();
makeCurve();
// createArcCurve();
animate();
// pauseRotation();

function init() {
    if (!schoolUrl) {
        return false;
    }
    // container = document.createElement( 'div' );
    // document.body.appendChild( container );
    container = document.getElementById('modelBorder');
    //创建空间场景
    scene = new THREE.Scene();
    scene.rotation.y = 1.6
    bbox = new THREE.Box3();

    // scene.background = new THREE.Color( 0xeeeeee );
    scene.background = new THREE.Color( 0x000000 );
    const axesHelper = new THREE.AxesHelper( 25 );
    scene.add( axesHelper );
    //添加环境光
    light = new THREE.HemisphereLight( 0xbbbbff, 0x444422, 1 );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    //添加平行光
    directionalLight = new THREE.DirectionalLight(0xffffff,1)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.near = 10
    directionalLight.shadow.camera.far = 500
    directionalLight.shadow.camera.left = -10
    directionalLight.shadow.camera.right = 10
    directionalLight.shadow.camera.top = 10
    directionalLight.shadow.camera.bottom = -10
    directionalLight.position.set(10, 30, -18)
    scene.add(directionalLight)

    var loader = new THREE.GLTFLoader();
    loader.load( schoolUrl, function ( gltf ) {
        // gltf.scene.name = '3dmodel';
        this.setContent(gltf.scene);
        gltf.scene.position.y = 0
        scene.add( gltf.scene );
    }, undefined, function ( e ) {
        console.error( e );
    });

    // 加载人模型
    var peopleLoader = new THREE.GLTFLoader();
    peopleLoader.load(peoperUrl, function(gltf){
        gltf.scene.rotation.y = Math.PI
        gltf.scene.scale.set(0.4,0.4,0.4)
        gltf.scene.traverse(function (object){
            if(object.isMesh){
                object.castShadow = true
                object.receiveShadow = true
            }
        })
        mixer = startAnimation(gltf.scene, gltf.animations, gltf.animations[1].name)
        scene.add( gltf.scene )
        model = gltf.scene
    },undefined,function(e){
        console.error(e)
    })

    var peopleLoader2 = new THREE.GLTFLoader();
    peopleLoader2.load(peoperUrl2, function(gltf){
        // gltf.scene.rotation.y = Math.PI/2
        // gltf.scene.rotation.x = Math.PI/2
        gltf.scene.scale.set(0.4,0.4,0.4)
        // gltf.scene.position.x = -3
        // gltf.scene.position.y = -3
        // gltf.scene.position.z = -10
        gltf.scene.traverse(function (object){
            if(object.isMesh){
                object.castShadow = true
                object.receiveShadow = true
            }
        })
        mixer2 = startAnimation(gltf.scene, gltf.animations, gltf.animations[0].name)
        scene.add( gltf.scene )
        model2 = gltf.scene
    },undefined,function(e){
        console.error(e)
    })

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    camera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight,	0.01,1000);
    controls = new THREE.OrbitControls(camera);
    // to disable pan
    controls.enablePan = false;
    // to disable zoom
    //controls.enableZoom = false;
	controls.enableZoom = true;
    controls.target.set(0,0,0);
    controls.update();

}

/**
 * 启动特定网格对象的动画，在三维模型的动画数组中按名称查找动画
 * @param skinnedMesh {THREE.SkineedMesh}要设置动画的网格
 * @param animations {array}数组，包含此模型的所有动画
 * @param animationName {string}要启动的动画名称
 * @return {THREE.AnimationMixer}要在渲染循环中使用的混合器
 * */
function startAnimation(skinnedMesh, animations, animationName) {
    const m_mixer = new THREE.AnimationMixer(skinnedMesh)
    const clip = THREE.AnimationClip.findByName(animations,animationName)
    if(clip){
        const action = m_mixer.clipAction(clip)
        action.play()
    }
    return m_mixer
}

//创建物体路径
function makeCurve(){
    curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3( -1.5, 0, 8 ),
        new THREE.Vector3( -1.5, 0, -12 ),
        new THREE.Vector3( 8, 0, -12 ),
        new THREE.Vector3( 8, 0, 8 ),
    ])
    curve.curveType = "catmullrom"
    curve.closed = true
    curve.tension = 0.6

    // const points = curve.getPoints(80)
    // const geometry = new THREE.BufferGeometry().setFromPoints(points)
    // const material = new THREE.LineBasicMaterial({color:0x000000})
    // const curveObject = new THREE.Line(geometry,material)
    // curveObject.position.x = 3.3
    // curveObject.position.z = -1.8
    // scene.add(curveObject)
}

//物体沿着线移动
function moveCurve(pmodel){
    if(curve == null || pmodel == null){
        console.log("Loading")
    }else{
        if(progress <= 1 - velocity){
            //获取曲线指定点坐标
            const point = curve.getPointAt(progress)
            const pointBox = curve.getPointAt(progress + velocity)
            if(point && pointBox){
                pmodel.position.set(point.x, point.y, point.z)
                //目标位置点
                var targetPos = pointBox
                //目标移动时间的朝向偏移
                var offsetAngle = 0
                //创建一个4维矩阵
                var mtx = new THREE.Matrix4()
                mtx.lookAt(pmodel.position,targetPos,pmodel.up)
                mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0,offsetAngle,0)))
                //计算需要进行旋转的值
                var toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)
                pmodel.quaternion.slerp(toRot,0.2)
            }
            progress += velocity
        }else{
            progress = 0
        }
    }
}

function createArcCurve(){
    // 绘制一个U型轮廓
    var R = 6;//圆弧半径
    var arc = new THREE.ArcCurve(0, 0, R, 0, Math.PI, true);
    var arc2 = new THREE.ArcCurve(0, 15, R, -Math.PI, 0, true);
    // 半圆弧的一个端点作为直线的一个端点
    var line1 = new THREE.LineCurve(new THREE.Vector2(R, 15, 0), new THREE.Vector2(R, 0, 0));
    var line2 = new THREE.LineCurve(new THREE.Vector2(-R, 0, 0), new THREE.Vector2(-R, 15, 0));
    // 创建组合曲线对象CurvePath
    CurvePath = new THREE.CurvePath();
    // 把多个线条插入到CurvePath中
    CurvePath.curves.push(line1, arc, line2, arc2);
    //分段数200
    var points = CurvePath.getPoints(200);
    // setFromPoints方法从points中提取数据改变几何体的顶点属性vertices
    var geometry = new THREE.BufferGeometry().setFromPoints(points) //声明一个几何体对象Geometry
    //材质对象
    var material = new THREE.LineBasicMaterial({
        color: 0x000000
    });
    //线条模型对象
    var line = new THREE.Line(geometry, material);
    line.rotation.x = -Math.PI/2
    line.position.z = 5
    line.position.x = 3.3
    scene.add(line); //线条对象添加到场景中
}

//物体沿着线移动
function moveCurvePath(pmodel){
    if(CurvePath == null || pmodel == null){
        console.log("Loading")
    }else{
        if(progress <= 1 - velocity){
            //获取曲线指定点坐标
            const point = CurvePath.getPointAt(progress)
            const pointBox = CurvePath.getPointAt(progress + velocity)
            if(point && pointBox){
                pmodel.position.set(point.x, point.y, point.z)
                //目标位置点
                var targetPos = pointBox
                //目标移动时间的朝向偏移
                var offsetAngle = 0
                //创建一个4维矩阵
                var mtx = new THREE.Matrix4()
                mtx.lookAt(pmodel.position,targetPos,model.up)
                mtx.multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0,offsetAngle,0)))
                //计算需要进行旋转的值
                var toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)
                pmodel.quaternion.slerp(toRot,0.2)
            }
            progress += velocity
        }else{
            progress = 0
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    if (rotating) {
        scene.rotation.y += -0.005;
    } else {
        scene.rotation.y = scene.rotation.y;
    }
    //更新动画帧
    if(mixer){
        mixer.update(clock.getDelta())
    }
    if(mixer2){
        mixer2.update(clock.getDelta())
    }
    moveCurve(model)
    moveCurve(model2)
    // moveCurvePath(model)
    renderer.render( scene, camera );
}

function pauseRotation() {
    var modelBorder = document.getElementById("modelBorder");
    modelBorder.addEventListener("mouseenter", function( event ) {
        rotating = false;
    });
    modelBorder.addEventListener("mouseleave", function( event ) {
        rotating = true;
    });
    modelBorder.addEventListener('touchmove', function(e) {
        rotating = false;
    }, false);
    modelBorder.addEventListener('touchstart', function(e) {
        rotating = false;
    }, false);
    modelBorder.addEventListener('touchend', function(e) {
        rotating = true;
    }, false);
}

function setContent(object) {
    object.updateMatrixWorld();

    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3()).length();
    const boxSize = box.getSize();
    const center = box.getCenter(new THREE.Vector3());

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    this.camera.position.copy(center);
    if (boxSize.x > boxSize.y) {
        this.camera.position.z = boxSize.x * -2.85
    } else {
        this.camera.position.z = boxSize.y * -2.85
    }
    this.camera.lookAt(0, 0, 0);
}