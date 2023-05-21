<script>
  import { getDownloadURL, ref } from 'firebase/storage';
  import { storage, db } from '../../fire-db.js';
  import { getDoc, doc } from 'firebase/firestore/lite';
  import { onMount } from 'svelte';
  import PromptHandler from '../components/prompt-handler.svelte';

  let promptedImage;
  let imagePrompt;
  let loadingMessage = 'Loading image...';
  let guessCount = 0;

  onMount(async () => {
    const dateObj = new Date();
    const generationDate = `${dateObj.getUTCMonth() + 1}-${dateObj.getUTCDate()}-${dateObj.getUTCFullYear()}`;

    // getting our image
    const pathRef = ref(storage, `${generationDate}.png`);

    const imageFileUrlPromise = await getDownloadURL(ref(storage, pathRef));
    const image64 = await fetch(imageFileUrlPromise);
    promptedImage = await image64.text();

    // now get our imagePrompt
    const docRef = doc(db, 'daily', generationDate);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      imagePrompt = docSnap.data().prompt;
    } else {
      loadingMessage = 'Oops. Something went wrong and we couldn\'t load the image :(';
    }
  })


</script>

{#if promptedImage && imagePrompt}
<div class='landing-container'>
  <div class='header-container'>
    <div class='header-item'></div>
    <h1 class='header-item'>Guess the Prompt</h1>
    <h2 class='header-item guess-item'>Guesses: {guessCount}</h2>
  </div>
  <img alt='generated' src={`data:image/png;base64,${promptedImage}`} />
  <PromptHandler imagePrompt={imagePrompt} bind:guessCount={guessCount} />
</div>
{:else}
<div class='landing-container'>
  <h1>{loadingMessage}</h1>
</div>
{/if}

<style>
  h1, h2 {
    font-family: 'Heebo', sans-serif;
  }

  h1 {
    font-size: 3em;
  }

  .landing-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(207, 207, 207);
    height: 100%;
  }

  .header-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    text-align: center;
  }

  .header-item {
    width: 30%;
  }

  .guess-item {
    text-align: right;
  }
</style>