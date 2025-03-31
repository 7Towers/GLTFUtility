<script lang="ts">
    import type { Scene, Mesh } from '@babylonjs/core';

    export let scene: Scene | undefined;
    export let selectedMesh: Mesh | null;

    let meshes: Mesh[] = [];

    $: meshes = scene ? scene.meshes.filter((mesh) => mesh.isPickable) : [];

    const selectMesh = (meshIndex: number) => {
        if (!scene || !meshes[meshIndex]) return;

        selectedMesh?.showBoundingBox && (selectedMesh.showBoundingBox = false); // Hide previous bounding box
        selectedMesh = meshes[meshIndex];
        selectedMesh.showBoundingBox = true; // Highlight selected mesh
    };
</script>

<div>
    <label>Select a Mesh:</label>

    <select on:change="{(e) => selectMesh(Number(e.target.value))}">
        <option value="" disabled selected>Select a mesh</option>

        {#each meshes as mesh, index}
            <option value="{index}">{mesh.name}</option>
        {/each}
    </select>
</div>
