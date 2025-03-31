
<script lang="ts">
    import {onMount} from "svelte";
    import {setup} from "$lib/renderer";

    let canvas: HTMLCanvasElement;

   onMount(() => {
        setup(canvas);
   })

</script>
<div class="flex flex-col w-full">
    <canvas class="w-100 h-100 rounded-2xl" bind:this={canvas}></canvas>
</div>