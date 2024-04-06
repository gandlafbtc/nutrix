<script>
      import "../app.css";
	import Header from "../components/Header.svelte";
	import Matrix from "../components/Matrix.svelte";
</script>

<Header>
      
</Header>
<div class="w-screen h-screen flex bg-black fixed -z-10">
	<Matrix></Matrix>
</div>
<div class="w-screen h-screen fixed flex items-center justify-center">
<slot></slot>
</div>