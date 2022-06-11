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
    Loading...
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
      <ul class:empty={!toDisplay.length}>
        {#each toDisplay as pokemon, i (pokemon.id)}
          {@const {
            id,
            name,
            sprites: { front_default: src },
          } = pokemon}
          {#key showFavs}
            <li
              class="mini"
              class:favorite={$favorites.has(id)}
              in:fade={{ delay: showFavs ? 0 : 50 * i }}
            >
              <img {src} alt={name} on:click={() => (current = i)} />
              <button on:click={() => favorites.toggle(id)}>Fav</button>
            </li>
          {/key}
        {:else}
          Pas de pokémons
        {/each}
      </ul>
    {/if}
  {/await}
</main>

<style>
  main {
    display: flex;
    overflow: auto;
    flex: 1;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
  }

  ul {
    display: flex;
    height: 100%;
    width: 100%;
    overflow: auto;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
  }
  ul.empty {
    align-content: center;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .active {
    border-color: orange;
  }

  h1 {
    cursor: pointer;
  }

  .mini {
    position: relative;
    margin: 1rem;
    border-radius: 50%;
    cursor: pointer;
  }
  .mini button {
    position: absolute;
    inset: 1rem 1rem auto auto;
    cursor: pointer;
  }

  .mini.favorite {
    background: orange;
  }

  .mini img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    object-position: 0 0;
    border: 2px solid transparent;
  }
  .mini:hover {
    box-shadow: 0px 0px 10px -5px #000000;
  }

  :global(main .Slider button img) {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 50%;
    padding: 1rem;
    filter: contrast(0%) brightness(200%);
    transition: filter 0.1s ease-in-out;
  }
  :global(.Slider button img:hover) {
    filter: contrast(100%) brightness(100%) opacity(60%);
  }
</style>
