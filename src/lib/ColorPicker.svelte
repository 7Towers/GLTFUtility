<script lang="ts">
    import {onMount} from "svelte";
    import {selectedMeshStore, colorsStore} from "$lib/renderer";
    import type {Mesh, PBRMaterial} from "@babylonjs/core";
    import {get} from "svelte/store";

    let colors = get(colorsStore);
    let showUI = $state(false);

    const updateColor = (index: number, color: string) => {
        colors[index] = color;
        colorsStore.set(colors);
    };

    onMount(() => {
        selectedMeshStore.subscribe((mesh: Mesh | null) => {
            if (mesh) {
                const material = mesh.material as PBRMaterial;
                if (material) {
                    const baseColor = material.albedoColor;
                    colors[0] = baseColor.scale(0.8).toHexString(); // Darker shade
                    colors[1] = baseColor.toHexString(); // Original color
                    colors[2] = baseColor.scale(1.2).toHexString(); // Lighter shade
                    colorsStore.set(colors);
                    showUI = true;
                }
            } else {
                showUI = false;
            }
        });
    });
</script>

{#if showUI}
    <div>
        <label>Variant Colors:</label>
        {#each $colorsStore as color, index}
            <input
                    type="color"
                    bind:value={$colorsStore[index]}
                    on:input={(e) => updateColor(index, (e.target as HTMLInputElement).value)}
            />
        {/each}
    </div>
{/if}