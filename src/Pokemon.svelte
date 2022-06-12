<script>
  import { bag } from './stores';

  export let infos;

  $: ({
    id,
    name,
    sprites: { front_default: src },
  } = infos);
  $: caught = $bag.has(id);
</script>

<div class="Pokemon" class:caught>
  <div class="id">#{id}</div>
  <img {src} alt={name} />
  <div class="name">{name}</div>
  <button on:click={() => bag.toggle(id)}>
    {caught ? 'Release' : 'Catch'}
  </button>
</div>

<style>
  .Pokemon {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 15rem;
    margin: auto;
  }

  .caught img {
    filter: none;
  }

  img {
    height: 15rem;
    object-fit: cover;
    filter: contrast(0%) brightness(200%);
  }

  button {
    margin-top: 0.2rem;
  }

  .name,
  .id {
    font-size: 1.5rem;
    text-transform: capitalize;
  }
</style>
