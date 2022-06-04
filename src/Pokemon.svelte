<script>
  import { favorites } from './stores';

  export let infos;

  $: ({
    id,
    name,
    sprites: { front_default: src },
  } = infos);
  $: favorite = $favorites.has(id);
</script>

<div class="Pokemon" class:favorite>
  <div class="id">#{id}</div>
  <img {src} alt={name} />
  <div class="name">{name}</div>
  <button on:click={() => favorites.toggle(id)}>Fav</button>
</div>

<style>
  .Pokemon {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 15rem;
    margin: auto;
  }

  .favorite .name {
    color: orange;
  }

  img {
    height: 15rem;
    object-fit: cover;
  }

  button {
    position: absolute;
    inset: 0 0 auto auto;
    cursor: pointer;
  }

  .name,
  .id {
    font-size: 1.5rem;
    text-transform: capitalize;
  }
</style>
