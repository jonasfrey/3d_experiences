import {

    f_add_css,
    f_s_css_prefixed,
    o_variables, 
    f_s_css_from_o_variables

} from "https://deno.land/x/f_add_css@1.2/mod.js"

f_add_css(
    `
    *{
        margin: 0;
        padding:0;
    }
    canvas{
        width:100vw;
        height:100vh;
    }
    `
)

import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let o_state = {
    n_ms_wpn : window.performance.now()
}
let n_tau = Math.PI*2;
let f_n_sin = Math.sin;
let f_n_cos = Math.cos;
let f_n_fract = (n)=>{return n%1.};

const o_scene = new THREE.Scene();
const o_camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const o_renderer = new THREE.WebGLRenderer();
o_renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( o_renderer.domElement );

const o_axes_helper = new THREE.AxesHelper( 5 );
o_scene.add( o_axes_helper );

const o_orbit_controls = new OrbitControls( o_camera, o_renderer.domElement );

document.body.appendChild( VRButton.createButton( o_renderer ) );
o_renderer.xr.enabled = true;

let n_its = 66;
let a_o_object = new Array(n_its).fill(0).map(
    (n, n_idx)=>{
        let n_it = parseInt(n_idx);
        let n_it_nor = n_it/n_its;

        let n_amp = 1.;
        let n_size = n_tau/n_its;
        const o_geometry = new THREE.BoxGeometry(n_size, n_size, n_size);
        const o_material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        o_material.wireframe = true
        const o_cube = new THREE.Mesh( o_geometry, o_material );
        o_cube.userData = {
            s_name: 'cube', 
            n_it_nor, 
            n_it, 
            n_its 
        }
        o_cube.userData.n_it_nor = n_it_nor

        o_cube.position.set(
            f_n_sin(n_tau*n_it_nor),
            0.,
            f_n_cos(n_tau*n_it_nor), 
        ).multiplyScalar(n_amp)
        o_scene.add( o_cube );

    }
)


o_camera.position.z = 5;

function f_render() {
    o_state.n_ms_wpn = window.performance.now();
    let n_t = o_state.n_ms_wpn*0.001;
    o_scene.children.forEach(o=> {
        if(o.userData?.s_name == 'cube'){
            o.rotation.x = n_t*0.2+o.userData.n_it_nor*n_tau;
            o.position.y = f_n_fract(n_t*0.2+o.userData.n_it_nor*2)*2.-1.
        }
    });
	o_renderer.render( o_scene, o_camera );
}
o_renderer.setAnimationLoop( f_render );


Object.assign(
    o_state,
    {
        o_scene,
        o_camera,
        o_renderer,
        o_axes_helper,
        o_orbit_controls
    }
)
window.o_state = o_state