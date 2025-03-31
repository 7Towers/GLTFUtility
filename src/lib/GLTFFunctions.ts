import type {IGLTF} from "@babylonjs/loaders/glTF/2.0";

export function sortGLTF(gltf: IGLTF): IGLTF {
    if (gltf.materials) {
        gltf.materials.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (gltf.meshes) {
        gltf.meshes.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (gltf.nodes) {
        gltf.nodes.sort((a, b) => a.name.localeCompare(b.name));
    }
    return gltf;
}

export function downloadSortedGLTF(gltfData: IGLTF) {
    if (gltfData) {
        const sortedGLTF = JSON.stringify(gltfData, null, 2);
        const blob = new Blob([sortedGLTF], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sorted_output.gltf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        alert('No sorted GLTF file to download');
    }
}

export async function loadAndSortGLTF(inputUrl: string) {
    const response = await fetch(inputUrl);
    const gltfData: IGLTF = await response.json();
    const sortedGLTF = sortGLTF(gltfData);
    const blob = new Blob([JSON.stringify(sortedGLTF, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted_output.gltf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}