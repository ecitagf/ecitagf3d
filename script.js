import {GLTFLoader} from "./GLTFLoader.js";
import {OrbitControls} from "./OrbitControls.js";
import {Sky} from "./Sky.js";
import {GUI} from "./lil-gui.module.min.js"
		    
		    function initSky() {
		    //adicionar céu
		        
		        var sky = new Sky ();
		        sky.scale.setScalar ( 450000 );
		        scene.add( sky );
		        
		        var sun = new THREE.Vector3();
		        
		        const effectController = {
		            
		            turbidity : 10,
		            rayleigh : 3,
		            mieCoefficient : 0.005,
		            mieDirectionalG : 0.7,
		            elevation : 2,
		            azimuth : 180,
		            exposure: renderer.toneMappingExposure
		        };
		        
		        function guiChanged() {
		            
		        const uniforms = sky.material.uniforms;
					uniforms[ 'turbidity' ].value = effectController.turbidity;
					uniforms[ 'rayleigh' ].value = effectController.rayleigh;
					uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
					uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;
					
					const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
					const theta = THREE.MathUtils.degToRad( effectController.azimuth );
					
					sun.setFromSphericalCoords( 1, phi, theta );
					
					uniforms[ 'sunPosition' ].value.copy( sun );
					
					renderer.toneMappingExposure = 					effectController.exposure;
					renderer.render( scene, camera );


		        }
		        
		        const gui = new GUI();
		        
		        gui.add( effectController, 'turbidity', 0.0, 20.0, 0.1 ).onChange( guiChanged );
				gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged );
				gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged );
				gui.add( effectController, 'elevation', 0, 90, 0.1 ).onChange( guiChanged );
				gui.add( effectController, 'azimuth', - 180, 180, 0.1 ).onChange( guiChanged );
				gui.add( effectController, 'exposure', 0, 1, 0.0001 ).onChange( guiChanged );
				
				guiChanged();

		    }
			var scene = new THREE.Scene();
			scene.background = new THREE.Color(0xdddddd);
			
			scene.add(new THREE.AxesHelper(500));
			
			var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
			camera.position.set(-100, 60, -10);
			
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
			
			initSky();

			var loader = new GLTFLoader();
			
			var obj;
			loader.load('ecit3d.glb', function (gltf) {
			obj = gltf.scene;
			obj.traverse(n => {
			    if (n.isMesh) {
			        n.castShadow = true;
			        n.receiveShadow = true;
			        if (n.material.map) n.material.map.anisotropy = 8;
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

			animate();
