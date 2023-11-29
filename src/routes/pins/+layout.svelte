<script>
    export let data;
</script>

<div>
    <h2>Flipperliste</h2>
    <p>{JSON.stringify(data)}</p>
    <slot />
</div>