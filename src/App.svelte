<script>
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';

  import { bag } from './stores';
  import fetchPokemons from './utils';

  import Slider from './Slider.svelte';
  import Pokemon from './Pokemon.svelte';

  let promise;
  let pokemons = [];
  let current;
  let showCaught = false;

  onMount(() => {
    promise = fetchPokemons().then(p => (pokemons = p));
  });

  $: toDisplay = showCaught ? pokemons?.filter(p => $bag.has(p.id)) : pokemons;

  $: if (showCaught && $bag.size === 0) {
    current = null;
  }
  $: hasCurrent = current != null;
</script>

<header>
  <h1 class:back={hasCurrent} on:click={() => (current = null)}>
    {hasCurrent ? 'Retour' : 'Pokedex'}
  </h1>
  {#await promise then}
    <button class:active={!showCaught} on:click={() => (showCaught = false)}>
      All
    </button>
    <button class:active={showCaught} on:click={() => (showCaught = true)}>
      Caught
    </button>
    <div class="nb">
      ({$bag.size} / {pokemons.length})
    </div>
  {/await}
</header>
<main class:centered={hasCurrent}>
  {#await promise}
    <p class="info">Loading...</p>
  {:then}
    {#if hasCurrent}
      <Slider items={toDisplay} {current} let:item>
        <Pokemon infos={item} />
        <img
          src={previous.sprites.front_default}
          class:caught={$bag.has(previous.id)}
          alt="Previous pokemon"
          slot="previous"
          let:previous
        />
        <img
          src={next.sprites.front_default}
          class:caught={$bag.has(next.id)}
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
          {@const caught = $bag.has(id)}
          {#key showCaught}
            <li
              class="mini"
              class:caught
              in:fade={{ delay: showCaught ? 0 : 50 * i }}
            >
              <img {src} alt={name} on:click={() => (current = i)} />
              <button on:click={() => bag.toggle(id)}>
                {caught ? 'Release' : 'Catch'}
              </button>
            </li>
          {/key}
        {:else}
          <p class="info">Pas de pokémons</p>
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
    background: #bbb;
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
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem;
    background: #333;
    color: white;
  }
  header button {
    color: white;
    margin: 0;
  }

  .info {
    font-size: 1.5rem;
  }

  h1 {
    text-transform: uppercase;
    margin: 0;
  }

  h1.back {
    cursor: pointer;
  }

  h1.back:hover {
    text-decoration: underline;
  }

  header button {
    color: #555;
    background: none;
  }

  header button:not(.active):hover {
    background-color: #bbb;
  }

  header button.active {
    cursor: initial;
    color: white;
  }

  .nb {
    margin-left: auto;
  }

  .mini {
    position: relative;
    margin: 1rem;
    cursor: pointer;
  }
  .mini button {
    position: absolute;
    inset: 0 0 auto auto;
    outline: none;
    border: none;
  }

  .mini.caught img,
  img.caught {
    filter: none;
  }

  .mini img {
    width: 10rem;
    height: 10rem;
    object-fit: cover;
    object-position: 0 0;
  }
  .mini:hover img {
    filter: contrast(0%) brightness(200%) drop-shadow(5px 5px 0px #333);
  }

  .mini.caught:hover img {
    filter: drop-shadow(5px 5px 0px #333);
  }

  .mini img {
    filter: contrast(0%) brightness(200%);
  }

  :global(main .Slider button img) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 1rem;
    filter: contrast(0%) brightness(200%);
  }
</style>
