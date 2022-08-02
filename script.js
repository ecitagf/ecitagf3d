import {GLTFLoader} from "./GLTFLoader.js";
import {OrbitControls} from "./OrbitControls.js"
		    
			var scene = new THREE.Scene();
			scene.background = new THREE.Color(0xdddddd);
			
			scene.add(new THREE.AxesHelper(500));
			
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(30, 60, 30);
			
			var hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
			scene.add(hemiLight);
			
			var spotLight = new THREE.SpotLight(0xffa95c, 4);
			spotLight.castShadow = true;
			spotLight.shadow.bias = -0.0001;
			spotLight.shadow.mapSize.width = 1024;
			spotLight.shadow.mapSize.height = 1024;
			scene.add(spotLight);

			var renderer = new THREE.WebGLRenderer({antialias:true});
			renderer.setSize( window.innerWidth, window.innerHeight );
			document.body.appendChild( renderer.domElement );
			renderer.toneMapping = THREE.ReinhardToneMapping;
			renderer.toneMappingExposure = 2.3;
			renderer.shadowMap.enabled = true;
			
			var controls = new OrbitControls( camera, renderer.domElement );
			controls.enableDamping = true;

			var loader = new GLTFLoader();
			
			var obj;
			loader.load('ecit3d.glb', function (gltf) {
			obj = gltf.scene;
			obj.traverse(n => {
			    if (n.isMesh) {
			        n.castShadow = true;
			        n.receiveShadow = true;
			        if (n.material.map) n.material.map.anisotropy = 16;
			    }
			});
			scene.add(gltf.scene);
			});
			

			function animate() {
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
				spotLight.position.set(
				    camera.position.x + 10,
				    camera.position.y + 10,
				    camera.position.z + 10
				)
			};

			animate();e();