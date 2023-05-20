<script>
  import { getDownloadURL, ref } from 'firebase/storage';
  import { storage, db } from '../../fire-db.js';
  import { getDoc, doc } from 'firebase/firestore/lite';
  import { onMount } from 'svelte';
  import PromptHandler from '../components/prompt-handler.svelte';

  let promptedImage;
  let imagePrompt;

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
      // throw an error
    }
  })


</script>

{#if promptedImage && imagePrompt}
<div class='landing-container'>
  <h1>Guess the Prompt</h1>
  <img alt='generated' src={`data:image/png;base64,${promptedImage}`} />
  <PromptHandler imagePrompt={imagePrompt} />
</div>
{:else}
<div class='landing-container'>
  <h1>Loading Image...</h1>
</div>
{/if}

<style>
  p, h1, h2, h3, h4, h5 {
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
</style>