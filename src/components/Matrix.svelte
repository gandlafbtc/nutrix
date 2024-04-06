<script>
	import {width as charWidth, height as charHeight} from './Character.svelte';
	import Column from "./Column.svelte";

	let frameDurationMS = 80;
	let fontSize = 20;

	let width = Math.floor( innerWidth / charWidth );
	let height = Math.floor( innerHeight / charHeight );
	let time = 0;

	function tick() {
		time++;
	}

	let interval = setInterval(tick, frameDurationMS);

	function setNewInterval(frameDurationMS) {
		window.clearInterval(interval);
		interval = setInterval(tick, frameDurationMS);
	}

	$: setNewInterval(frameDurationMS);
</script>

<!-- This how you can specify style properties that come from JS -->
<main style="--char-width:{charWidth}px; --char-height:{charHeight}px; --font-size:{fontSize}px;">

	<!-- This is a way to do a loop when there's nothing to iterate over. Svelte will iterate anything with .length -->
	{#each {length: width} as _, x}
		<Column {x} {height} {time} />
	{/each}

</main>


<style>
	:global(body) {
		background: black;
		padding: 0;
	}
</style>