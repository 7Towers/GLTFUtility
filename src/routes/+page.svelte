<script lang="ts">
    import {Button} from 'flowbite-svelte';
    import {onMount} from 'svelte';
    import type {IGLTF} from "@babylonjs/loaders/glTF/2.0";
    import {uploadGLB, sortGLTF, downloadGLTF} from "$lib/GLTFFunctions";
    import RenderView from "$lib/RenderView.svelte";
    import {loadGLTF} from "$lib/renderer";
    import {downloadSortedGLTF} from "$lib/GLTFFunctions";

    let fileInput: HTMLInputElement;
    let gltfUrl: string = '';
    let gltfData: IGLTF | null = null;
    let sorted = false;
    let glbLoaded = false;

    async function handleFileSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            if (file.name.includes('gltf')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    gltfData = JSON.parse(content);
                    if (gltfData) {
                        loadGLTF(gltfData);
                    } else {
                        alert('Failed to load GLTF file');
                    }
                };
                reader.readAsText(file);
            } else if (file.name.includes('glb')) {
                glbLoaded = await uploadGLB(file);
            } else {
                alert('Please select a valid .gltf or .glb file');
            }
        }
    }

    async function fetchGLTF() {
        if (gltfUrl) {
            try {
                const response = await fetch(gltfUrl);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const gltf: IGLTF = await response.json();
                console.log('Fetched GLTF:', gltf);
            } catch (error: any) {
                alert('Failed to fetch GLTF file: ' + error.message);
            }
        } else {
            alert('Please enter a valid URL');
        }
    }

    onMount(() => {
        fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.gltf, .glb';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', handleFileSelect);
        document.body.appendChild(fileInput);
    });

    function openFileDialog() {
        fileInput.click();
    }

    async function sortGLTFFile() {
        if (gltfData) {
            sortGLTF(gltfData);
            sorted = true;
        } else {
            alert('No GLTF file to sort');
        }
    }


</script>

<div class="flex flex-col gap-5 m-5">
    {#if gltfData}
        <Button class="bg-green-700" on:click={sortGLTFFile}>Sort GLTF File</Button>
        {#if sorted}
            <Button on:click={downloadGLTF}>Download Sorted GLTF</Button>
        {/if}
    {:else}
        <hr>
        <Button on:click={openFileDialog}>Upload GLTF / GLB File</Button>
        <!--        <hr>-->
        <!--        <input type="text" bind:value={gltfUrl} placeholder="Enter GLTF file URL" class="p-2 border rounded" />-->
        <!--        <Button class="bg-blue-500" on:click={fetchGLTF}>Fetch GLTF File</Button>-->
    {/if}
    <RenderView/>
</div>