// ==========================================================================
// $Id: camera.js,v 1.3 2020/02/12 23:06:21 jlang Exp $
// Simple camera modelling example.
// ==========================================================================
// (C)opyright:
//
//    Jochen Lang
//    EECS, University of Ottawa
//    800 King Edward Ave.
//    Ottawa, On., K1N 6N5
//    Canada.
//    http:www.eecs.uottawa.ca
//
// Creator: Jochen Lang
// Email:   jlang@uottawa.ca
// ==========================================================================
// $Log: camera.js,v $
// Revision 1.3  2020/02/12 23:06:21  jlang
// Added skeleton (added coordinate axes and made lights brighter).
//
// Revision 1.2  2020/02/12 20:46:28  jlang
// Camera controls with lookAt and frustum or ortho semantics.
//
// Revision 1.1  2020/02/12 05:07:30  jlang
// Intermediate draft.
//
// ==========================================================================


// All drawing will be organized in a scene graph
var scene = new THREE.Scene();

var object;

var tiger = true;
var dino = false;
var trice = false;
var tigerStringMtl = '../../models/tiger.mtl';
var tigerStringObj = '../../models/tiger.obj';
var dinoStringMtl = '../../models/dino50K.mtl';
var dinoStringObj = '../../models/dino50K.obj';
var triceStringMtl = '../../models/triceratops1Text.mtl';
var triceStringObj = '../../models/triceratops1Text.obj';


//TEST
function changeTiger() {
  if (tiger){
    tiger = false;
  } else {
    tiger = true;
  }
}

function changeDino() {
  if (dino){
    dino = false;
  } else {
    dino = true;
  }
}

function changeTrice() {
  if (trice){
    trice = false;
  } else {
    trice = true;
  }
}

function changeString(){
  if (tiger && !trice){
    actualStringMtl = tigerStringMtl;
    actualStringObj = tigerStringObj;
  } else if(dino && !trice) {
    actualStringMtl = dinoStringMtl;
    actualStringObj = dinoStringObj;
  } else {
    actualStringMtl = triceStringMtl;
    actualStringObj = triceStringObj;
  }
}
//TEST

function main() {

	function loadModel() {
		//object.traverse( function ( child ) {
			//if ( child.isMesh ) { child.material.map = texture; }
		//});

		// Scale object to size 2 and center it		
		const box = new THREE.Box3().setFromObject(object);
		const boxSize = box.getSize(new THREE.Vector3());
		// Find maximum dimension
		const boxSizeln = Math.max( boxSize.x, boxSize.y, boxSize.z );
		// Find box center	
		const boxCenter = box.getCenter(new THREE.Vector3());
		// set position and scale
		object.position.set( -2.0*boxCenter.x/boxSizeln, 
							 -2.0*boxCenter.y/boxSizeln, 
							 -2.0*boxCenter.z/boxSizeln );
    object.scale.set( 2.0/boxSizeln, 2.0/boxSizeln, 2.0/boxSizeln ); 
		scene.add( object );
  }

	var manager = new THREE.LoadingManager( loadModel );
	manager.onProgress = function ( item, loaded, total ) {
		console.log( item, loaded, total );
	};
  
  //MTLOBJLoader-Begin
  function modelloader(){
  scene.remove(object);
  changeString();
  var mtlLoader = new THREE.MTLLoader(manager);
  var loader = new THREE.OBJLoader(manager);

  mtlLoader.load(actualStringMtl, (materials) => {
    materials.preload()
    loader.setMaterials(materials)
    loader.load(actualStringObj,
      function ( obj ) {object = obj;},
      onProgress, onError );
  })
}
modelloader();
//MTLOBJLoader-ENDS

  function onProgress( xhr ) {
		if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
		}
  }

  function onError() {}
  //init();
  
}


// initialization of Three.js
function init() {
  main();
  // Check if WebGL is available see Three/examples
  // No need for webgl2 here - change as appropriate
  if (THREE.WEBGL.isWebGLAvailable() === false) {
    // if not print error on console and exit
    document.body.appendChild(THREE.WEBGL.getWebGLErrorMessage());
  }
  // add our rendering surface and initialize the renderer
  var container = document.createElement('div');
  document.body.appendChild(container);

  //Ajout Viewpoint
  const canvas = document.querySelector('#c');
  const view1Elem = document.querySelector('#view1');
  const view2Elem = document.querySelector('#view2');
  //Ajout Viewpoint


  //const renderer = new THREE.WebGLRenderer({canvas});
  // WebGL2 examples suggest we need a canvas
  // canvas = document.createElement( 'canvas' );
  // var context = canvas.getContext( 'webgl2' );
  // var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
  renderer = new THREE.WebGLRenderer({canvas});
  // set some state - here just clear color
  renderer.setClearColor(new THREE.Color(0x333333));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // add the output of the renderer to the html element
  container.appendChild(renderer.domElement);

  
  // need a camera to look at the object
  // calculate aspectRatio
  var aspectRatio = window.innerWidth / window.innerHeight;
  // Default constants
  var eye = new THREE.Vector3( 0.0, 0.0, 5.0 );
  var at = new THREE.Vector3( 0.0, 0.0, 0.0);
  var up = new THREE.Vector3( 0.0, 1.0, 0.0);

  var d_width = 2.0;
  var d_height = 2.0;
  var d_near = 4.0;
  var d_far = 6.0;
  
  // Camera needs to be global
  camera = new THREE.OrthographicCamera(-d_width/2.0 * aspectRatio, d_width/2.0 *aspectRatio, d_height/2.0, -d_height/2.0, d_near, d_far);
  //Ajout Viewpoint
  //cameraPerspective = new THREE.PerspectiveCamera(Math.atan(d_height/d_near/2.0)*360.0/Math.PI,d_width/d_height * aspectRatio, d_near, d_far);
  // add a lightsource - at the camera
  //let pointLight = new THREE.PointLight(0xeeeeee);
  //cameraPerspective.add(pointLight);
  //Ajout Viewpoint
  // camera = new THREE.PerspectiveCamera(Math.atan(1.0/4.0)*360.0/Math.PI, aspectRatio, 4, 6);
  // position the camera - remainder is default
  camera.position.copy(eye);

  // add a lightsource - at the camera
  let pointLight = new THREE.PointLight(0xeeeeee);
  camera.add(pointLight);

  // add a bit of ambient light to make things brighter
  let ambientLight = new THREE.AmbientLight(0x909090)
  scene.add(ambientLight)

  var axes = new THREE.AxesHelper(10);
  scene.add(axes);

  //Ajout Viewpoint
  var activeCameraHelper = new THREE.CameraHelper(camera);
  scene.add(activeCameraHelper);

  var camera2Group = new THREE.Group();
  scene.add(camera2Group);
  camera2Group.position.set(0,0,0);

  height_ortho = 10 * 2 * Math.atan( 60*(Math.PI/180) / 2 );
  console.log(height_ortho);
  width_ortho  = height_ortho * 2;


  const camera2 = new THREE.OrthographicCamera(width_ortho/-2,width_ortho/2, height_ortho/2, height_ortho/-2,0.1,100);
  camera2Group.add(camera2);
  camera2.position.set(10, 5, 5);
  camera2.lookAt(0, 0, 0);


  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  //Fin Ajout Viewpoint

	const epsilon = 1e-5;

  var controls = new function () {
    this.perspective = "Orthographic";
    //Ajout Assignment
    this.model = "Tiger";

    this.rotation = 0
    this.redraw = function () {
    };
    this.radius = 9.65
    this.redraw = function () {
    };
    //Ajout Assignment
    this.eye_x = eye.x + epsilon;
    this.eye_y = eye.y + epsilon;
    this.eye_z = eye.z + epsilon;
    this.at_x = at.x + epsilon;
    this.at_y = at.y + epsilon;
    this.at_z = at.z + epsilon;
    this.up_x = up.x + epsilon;
    this.up_y = up.y + epsilon;
    this.up_z = up.z + epsilon;
    this.width = d_width + epsilon;
    this.height = d_height + epsilon;
    this.near = d_near + epsilon;
    this.far = d_far + epsilon;
	
    this.update = function() {
      if(controls.eye_x )
        eye.x = controls.eye_x;
      if(controls.eye_y)
        eye.y = controls.eye_y;
      if(controls.eye_z)
        eye.z = controls.eye_z;
      if(controls.at_x)
        at.x = controls.at_x;
      if(controls.at_y)
        at.y = controls.at_y;
      if(controls.at_z)
        at.z = controls.at_z;
      if(controls.up_x)
        up.x = controls.up_x;
      if(controls.up_y)
        up.y = controls.up_y;
      if(controls.up_z)
        up.z = controls.up_z;
			updateLookAt();
    };

		this.updateCamera = function( isPerspective ) {
			var aspectRatio = window.innerWidth / window.innerHeight;
			if ( isPerspective ) {
        camera = new THREE.PerspectiveCamera(Math.atan(this.width*this.height/this.near/4.0)*360.0/Math.PI,(2*this.width)/this.height * aspectRatio, this.near, this.far);
        activeCameraHelper.camera = camera;
        activeCameraHelper.matrix = camera.matrixWorld;
        activeCameraHelper.update();
        this.perspective = "Perspective";
			} else {
        camera = new THREE.OrthographicCamera(-this.width/2.0 * aspectRatio, this.width/2.0 *aspectRatio, this.height/2.0, -this.height/2.0, this.near, this.far);
        activeCameraHelper.camera = camera;
        activeCameraHelper.matrix = camera.matrixWorld;
        activeCameraHelper.update();
        this.perspective = "Orthographic";
	    } 
			camera.updateProjectionMatrix();
		};

		this.switchCamera = function () {
			if (camera instanceof THREE.PerspectiveCamera) {
				this.updateCamera(false);
	    } else {
				this.updateCamera(true);
      }
		};

    this.frustum = function () {
      if(controls.width )
        d_width = controls.width;
      if(controls.height)
        d_height = controls.height;
      if(controls.near)
        d_near = controls.near;
      if(controls.far)
        d_far = controls.far;
			updateFrustum();
		}
		
		this.updateFrustum = function() {
			if (camera instanceof THREE.PerspectiveCamera) {
				this.updateCamera(true);
	    } else {
				this.updateCamera(false);
			}
    };

    this.switchModel = function() {
      if (tiger && !trice){
        this.model = "Dino";
        changeTiger();
        changeDino();
        changeString();
        main();
      } else if (dino && !trice){
        this.model = "Triceratops";
        changeDino();
        changeTrice();
        changeString();
        main();
      } else {
        this.model = "Tiger";
        changeTrice();
        changeTiger();
        changeString();
        main();
      }
    }
  };

  function updateFrustum( ) {
		controls.updateFrustum()
	}
	

  var gui = new dat.GUI();
  gui.add(controls, 'rotation', 0, 2*(Math.PI)).onChange(controls.redraw);
  gui.add(controls, 'radius', 5, 30).onChange(controls.redraw);
  gui.add(controls, 'eye_x', -5.0, 5.0).onChange(controls.update);
  gui.add(controls, 'eye_y', -5.0, 5.0).onChange(controls.update);
  gui.add(controls, 'eye_z', -5.0, 5.0).onChange(controls.update);
  gui.add(controls, 'at_x', -5.0, 5.0).onChange(controls.update);
  gui.add(controls, 'at_y', -5.0, 5.0).onChange(controls.update);
	gui.add(controls, 'at_z', -5.0, 5.0).onChange(controls.update);
  gui.add(controls, 'up_x', -1.0, 1.0).onChange(controls.update);
	gui.add(controls, 'up_y', -1.0, 1.0).onChange(controls.update);
	gui.add(controls, 'up_z', -1.0, 1.0).onChange(controls.update);
	gui.add(controls, 'switchCamera');
  gui.add(controls, 'perspective').listen();
  gui.add(controls, 'switchModel');
  gui.add(controls, 'model').listen();
  gui.add(controls, 'width', 0.01, 20.0).onChange(controls.frustum);	
  gui.add(controls, 'height', 0.01, 20.0).onChange(controls.frustum);	
  gui.add(controls, 'near', 0.01, 20.0).onChange(controls.frustum);
  gui.add(controls, 'far', 0.01, 20.0).onChange(controls.frustum);
	gui.add(controls, 'updateFrustum');

	render();

  function onResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  window.addEventListener('resize', onResize, true);

  //Ajout Viewpoint
  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();
 
    // compute a canvas relative rectangle
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);
 
    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);
 
    // setup the scissor to only render to that part of the canvas
    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);
 
    // return the aspect
    return width / height;
  }
  //Ajout Viewpoint


  function render() {
    // render using requestAnimationFrame - register function
    //requestAnimationFrame(render);
    //renderer.render(scene, camera);

    //Camera2Rotation
    rotation = controls.rotation;
    camera2Group.rotation.y = rotation;
    radius = controls.radius;
    ww = radius * 2;
    camera2.top = radius / 2;
    camera2.bottom = radius / -2;
    camera2.left = ww / -2;
    camera2.right = ww / 2;


    //updateLookAt();
    resizeRendererToDisplaySize(renderer);

    // turn on the scissor
    renderer.setScissorTest(true);

    {
      const aspect = setScissorForElement(view1Elem);
 
      //adjust the camera for this aspect
      camera.aspect = aspect;

      //camera.left = -aspect;
      //camera.right = aspect;
      camera.updateProjectionMatrix();
 
      // don't draw the camera helper in the original view
      activeCameraHelper.visible = false;
 
      //scene.background.set(0x000000);

      updateLookAt();
 
      // render
      renderer.render(scene, camera);
    }

      // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);
 
      // adjust the camera for this aspect
      camera2.aspect = aspect;

      //camera2.left = -aspect;
      //camera2.right = aspect;

      camera2.updateProjectionMatrix();
 
      // draw the camera helper in the 2nd view
      activeCameraHelper.visible = true;
 
      //scene.background.set(0x000040);
      updateLookAt();
      //render
      renderer.render(scene, camera2);
    }

    requestAnimationFrame(render);

  }

  requestAnimationFrame(render);

  function updateLookAt() {
			camera.position.copy(eye);
			camera.up.copy(up);
	    camera.lookAt(at);
      camera.updateMatrix();
	}
}

//window.onload = main;
window.onload = init;

// register our resize event function
// window.addEventListener('resize', onResize, true);
