<script>
  import { blur } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { expoOut } from 'svelte/easing';

  const position = tweened(null, { duration: 800, easing: expoOut });

  export let items = [];
  export let current = 0;

  let factor = 1;

  function getFactor(position) {
    return Math.abs(position) === length ? -1 / (length - 1) : 1;
  }

  function showPrev() {
    const futurePosition = current - 1;
    factor = getFactor(futurePosition);
    current = futurePosition % length;
  }
  function showNext() {
    const futurePosition = current + 1;
    factor = getFactor(futurePosition);
    current = futurePosition % length;
  }

  $: position.set(current);

  $: length = items.length;
  $: previous = (current - 1 + length) % length;
  $: current = current % length;
  $: current = Number.isNaN(current) ? 0 : current;
  $: next = (current + 1) % length;
  $: currentItem = items.at(current);
  $: offset = factor * (current - $position);
</script>

<div class="Slider" in:blur={{ duration: 200 }}>
  <div class="button-container">
    <button on:click={showPrev}>
      <slot name="previous" previous={items.at(previous)} />
    </button>
  </div>
  <div
    class="content"
    style:transform={items.length === 1 ? '' : `translate(${100 * offset}%, 0)`}
  >
    <div class="item previous">
      <slot item={items.at(previous)} />
    </div>
    <div class="item current">
      <slot item={currentItem} />
    </div>
    <div class="item next">
      <slot item={items.at(next)} />
    </div>
  </div>
  <div class="button-container">
    <button on:click={showNext}>
      <slot name="next" next={items.at(next)} />
    </button>
  </div>
</div>

<style>
  .Slider {
    display: flex;
    height: 20rem;
    margin: auto;
    overflow: hidden;
    align-items: center;
  }

  .content {
    position: relative;
    width: 30rem;
    height: 100%;
  }

  .item {
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    flex: 1 0 100%;
  }

  .current {
    z-index: 1;
  }
  .previous {
    right: 100%;
  }
  .next {
    right: -100%;
  }

  .button-container {
    display: flex;
    align-items: center;
    background: white;
    height: 100%;
    z-index: 1;
  }

  button {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    z-index: 1;
    border: none;
    background: darkslategrey;
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
