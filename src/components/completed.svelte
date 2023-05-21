<script>
  export let imagePrompt;
  export let guessCount;
</script>

<div class='win-container'>
  <h2>{imagePrompt}</h2>
  <h1>You guessed the prompt! It took you {guessCount} guesses.</h1>
</div>

<style>
  .win-container {
    font-size: 1em;
    font-family: 'Heebo', sans-serif;
    text-align: center;
  }
</style>