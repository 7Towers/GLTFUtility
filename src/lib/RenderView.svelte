
<script lang="ts">
    import {onMount} from "svelte";
    import {colorsStore, setup} from "$lib/renderer";
    import MeshSelector from "$lib/MeshSelector.svelte";
    import type {Mesh, Scene} from "@babylonjs/core";
    import {selectedMeshStore} from "$lib/renderer.js";
    import ColorPicker from "$lib/ColorPicker.svelte";

    let canvas: HTMLCanvasElement;
    let scene: Scene;
    let selectedMesh: Mesh | null;
    let colors: string[] = [];

   onMount(() => {
        setup(canvas);
        scene = setup(canvas);
       selectedMeshStore.subscribe((value: Mesh | null) => {
           selectedMesh = value;
       });
       colorsStore.subscribe((value: string[]) => {
           colors = value;
       });
   })

</script>
<div class="flex flex-col w-full">
    <canvas class="w-100 h-100 rounded-2xl" bind:this={canvas}></canvas>
    <ColorPicker bind:colors={colors}/>
</div>