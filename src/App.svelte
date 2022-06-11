<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { favorites } from './stores';
  import fetchPokemons from './utils';

  import Slider from './Slider.svelte';
  import Pokemon from './Pokemon.svelte';

  let promise;
  let pokemons = [];
  let current;
  let showFavs = false;

  onMount(() => {
    promise = fetchPokemons().then(p => (pokemons = p));
  });

  $: toDisplay = showFavs
    ? pokemons?.filter(p => $favorites.has(p.id))
    : pokemons;

  $: if (showFavs && $favorites.size === 0) {
    current = null;
  }
  $: hasCurrent = current != null;
</script>

<header>
  <h1 on:click={() => (current = null)}>
    {hasCurrent ? 'Retour' : 'Pokedex'}
  </h1>
  <button class:active={showFavs} on:click={() => (showFavs = !showFavs)}>
    Favorites ({$favorites.size})
  </button>
</header>
<main class:centered={hasCurrent}>
  {#await promise}
    <div class="loader">Loading...</div>
  {:then}
    {#if hasCurrent}
      <Slider items={toDisplay} {current} let:item>
        <Pokemon infos={item} />
        <img
          src={previous.sprites.front_default}
          alt="Previous pokemon"
          slot="previous"
          let:previous
        />
        <img
          src={next.sprites.front_default}
          alt="Next pokemon"
          slot="next"
          let:next
        />
      </Slider>
    {:else}
      {#each toDisplay as pokemon, i (pokemon.id)}
        {@const {
          id,
          name,
          sprites: { front_default: src },
        } = pokemon}
        {#key showFavs}
          <div class="mini" in:fade={{ delay: showFavs ? 0 : 50 * i }}>
            <img
              {src}
              class:favorite={$favorites.has(id)}
              alt={name}
              on:click={() => (current = i)}
            />
            <button on:click={() => favorites.toggle(id)}>Fav</button>
          </div>
        {/key}
      {:else}
        Pas de pokémons
      {/each}
    {/if}
  {/await}
</main>

<style>
  main {
    display: flex;
    overflow: auto;
    flex: 1;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  main.centered {
    align-content: center;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .active {
    background: orange;
  }

  h1 {
    cursor: pointer;
  }

  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .mini {
    position: relative;
  }
  .mini button {
    position: absolute;
    inset: 1rem 1rem auto auto;
    cursor: pointer;
  }

  .mini img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    object-position: 0 0;
    margin: 1rem;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
  }
  img.favorite {
    background: orange;
  }
  img:hover {
    box-shadow: 0px 0px 10px -5px #000000;
  }
</style>
