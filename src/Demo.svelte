<script>
  let money = 10;
  let height = 180;

  $: moneyInYens = money * 94;
  $: heightInM = height / 100;

  $: rich = money > 10;
  $: tall = height > 200;
</script>

<main>
  <section class:rich>
    <p>Argent</p>
    <button on:click={() => money--}>-</button>
    <div>{money} €</div>
    <button on:click={() => money++}>+</button>
    <div>{moneyInYens} ¥</div>
  </section>

  {#if rich}
    <img
      src="https://media.giphy.com/media/LdOyjZ7io5Msw/giphy.gif"
      alt="Sponge bob gif"
    />
  {/if}

  <section style:color={tall ? 'blue' : 'initial'}>
    <p>Taille</p>
    <button on:click={() => (height -= 10)}>-</button>
    <div>{height} cm</div>
    <button on:click={() => (height += 10)}>+</button>
    <div>{heightInM} m</div>
  </section>
</main>

<style>
  * {
    font-size: 4rem;
  }

  .rich {
    color: orange;
  }

  section {
    display: flex;
    align-items: center;
  }

  button {
    margin-inline: 1rem;
  }

  main {
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    font-size: 4rem;
  }
</style>
