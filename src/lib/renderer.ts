import {
    Engine,
    Scene,
    ArcRotateCamera,
    HemisphericLight,
    Vector3,
    Color4,
    type IDataBuffer,
    AppendSceneAsync,
    Mesh,
    Color3,
    PBRMaterial
} from '@babylonjs/core';
import '@babylonjs/loaders';
import {GLTFFileLoader, type IGLTF} from "@babylonjs/loaders/glTF/2.0";
import type {IGLTFLoaderData} from "@babylonjs/loaders";
import {registerBuiltInLoaders} from "@babylonjs/loaders/dynamic";
import '@babylonjs/loaders';
import { GLTF2Export } from '@babylonjs/serializers';

let _engine: Engine | null;
let _scene: Scene | null;
let _selectedMesh: Mesh | null = null;
let colors: string[] = ['#ff0000', '#00ff00', '#0000ff']; // Default colors

registerBuiltInLoaders();

export function setup(htmlCanvas: HTMLCanvasElement) {
    // Create the Babylon.js engine
    const engine = new Engine(htmlCanvas, true);

    // Create a basic scene
    const scene = new Scene(engine);

    // Set the background color to light blue
    scene.clearColor = new Color4(0.68, 0.85, 0.90, 1.0);

    // Create a camera with orbit controls
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), scene);
    camera.attachControl(htmlCanvas, true);

    // Create a hemispheric light
    const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);

    // Render loop
    engine.runRenderLoop(() => {
        scene.render();
    });

    // Resize the engine on window resize
    window.addEventListener('resize', () => {
        engine.resize();
    });

    _engine = engine;
    _scene = scene;
}

export function loadGLTF(gltf: IGLTF) {
    if (!_engine) {
        throw new Error('Engine not initialized. Call setup() first.');
    }

    if (!_scene) {
        throw new Error('Scene not found.');
    }

    // Load the GLTF model
    const gltfLoader = new GLTFFileLoader();
    const loaderData = {json: gltf, bin: null} as IGLTFLoaderData;
    gltfLoader.loadAsync(_scene, loaderData, '').then(() => {
        console.log('GLTF model loaded into the scene');
    }).catch((error) => {
        console.error('Error loading GLTF model:', error);
    });
}

export function shutdown() {
    if (_engine) {
        _engine.dispose();
        _engine = null;
        _scene = null;
    }
}

export async function loadGLBIntoScene(file: File): Promise<boolean> {
    if (!_engine) {
        console.error('Engine not initialized. Call setup() first.');
        return false;
    }

    if (!_scene) {
        console.error('Scene not found.');
        return false;
    }
    try {
       await AppendSceneAsync(file, _scene);
       return true;
    } catch (e: any) {
        console.error('Error loading GLB model:', e);
        return false;
    }
}

export function applyMaterialVariants()  {
    if (!_selectedMesh || !_selectedMesh.material) return;

    const material = _selectedMesh.material.clone("cloned_material") as PBRMaterial;
    if (!material) return;

    material.albedoColor = Color3.FromHexString(colors[0]);
    material.emissiveColor = Color3.FromHexString(colors[2]);

    _selectedMesh.material = material;
}

export async function exportGLBModel(){
    if (!_scene) return;

    const glbData = await GLTF2Export.GLBAsync(_scene, 'updated_model.glb');
    glbData.downloadFiles();
}

export async function exportGLTFModel(){
    if (!_scene) return;

    const gltfData = await GLTF2Export.GLTFAsync(_scene, 'updated_model.gltf');
    gltfData.downloadFiles();
}
