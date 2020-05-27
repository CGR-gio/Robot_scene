
var selectedObjects = [];//渲染对象
THREE.ThreeJs_Composer =function (_renderer, _scene , _camera) {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var composer = new THREE.EffectComposer(_renderer);
    var renderPass = new THREE.RenderPass(_scene,_camera);
    composer.addPass(renderPass);

    var outlinePass = new THREE.OutlinePass(new THREE.Vector2( window.innerWidth, window.innerHeight ), _scene, _camera );
    outlinePass.edgeStrength = 10;//包围线浓度
    outlinePass.edgeGlow = 5;//边缘线范围
    outlinePass.edgeThickness =10;//边缘线浓度
    outlinePass.pulsePeriod =2;//包围线闪烁频率
    outlinePass.visibleEdgeColor.set('#1625ff');//包围线颜色
    outlinePass.hiddenEdgeColor.set('#1625ff');//被遮挡的边界线颜色
    composer.addPass(outlinePass);

    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
    effectFXAA.renderToScreen = true;
    composer.addPass( effectFXAA );

    document.addEventListener('click',onMouseClick);

    var door_state_left1 = true; //默认是门是关闭的
    var door_state_right1 = true; //默认是门是关闭的
    var door_state_left2 = true; //默认是门是关闭的
    var door_state_right2 = true; //默认是门是关闭的

    function onMouseClick(event) {
        var x,y;
        if (event.changedTouches){
            x = event.changedTouches[ 0 ].pageX;
            y = event.changedTouches[ 0 ].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = ( x / window.innerWidth ) * 2 - 1;
        mouse.y = - ( y / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, _camera );

        var intersects = raycaster.intersectObjects(_scene.children,true);

        //显示标签和 模型外部轮廓
        if(intersects.length == 0){
            $('#label').attr("style","display:none");//隐藏说明性标签
            return;
        }else {
            $("#label").attr("style","display:block;");// 显示说明性标签
            $("#label").css({left: x, top: y-40});// 修改标签的位置
            $("#label").text(intersects[0].object.name);// 显示模型信息

            selectedObjects.pop();
            selectedObjects.push( intersects[0].object );
            outlinePass.selectedObjects = selectedObjects;
        }
    }

    return composer;
}