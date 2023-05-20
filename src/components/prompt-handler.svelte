<script>
  export let imagePrompt;

  let hiddenPrompt;
  let guess;

  // remove a period if it exists
  if(imagePrompt[imagePrompt.length - 1] === '.') {
    imagePrompt = imagePrompt.slice(0, -1);
  }

  hiddenPrompt = imagePrompt.replace(/[a-z]/gi, '_');

  const guessHandler = (e) => {
    e.preventDefault();
    const indices = getIndices();
    if(indices.length) {
      const splitHiddenPrompt = hiddenPrompt.split(' ');
      indices.map((i) => {
        if(splitHiddenPrompt[i].includes('_'))
        splitHiddenPrompt[i] = guess;
      });
      hiddenPrompt = splitHiddenPrompt.join(' ');
    }
    guess = '';
  }

  const getIndices = () => {
    let startIndex = 0, index, indices = [];
    let lowPrompt = imagePrompt.toLowerCase().split(' ');
    let lowGuess = guess.toLowerCase();

    while((index = lowPrompt.indexOf(lowGuess, startIndex)) > -1) {
      indices.push(index);
      startIndex = index + lowPrompt.length;
    }

    return indices;
  }
</script>

<div class='prompt-container'>
  <h1 class='prompt'>{hiddenPrompt}</h1>
  <div>
    <form on:submit={guessHandler}>
      <input placeholder='Guess a word in the prompt!' bind:value={guess} type='text' />
    </form>
    <!-- <button>Guess</button> -->
  </div>
</div>

<style>
  .prompt-container {
    font-size: 2em;
    font-family: 'Heebo', sans-serif;
    text-align: center;
  }

  .prompt {
    letter-spacing: .05em;
  }

  input {
    background: rgb(226, 226, 226);
    outline: none;
    border: 2px solid black;
    border-bottom: 2px solid black;
    font-size: .75em;
    text-align: center;
    padding: .2em;
    width: 50%;
  }

  /* button {
    background: none;
    border: 2px solid black;
    border-radius: 5px;
    font-size: .75em;
  } */
</style>