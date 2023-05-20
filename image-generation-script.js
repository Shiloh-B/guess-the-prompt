import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore/lite';
import { getStorage, ref, uploadString } from "firebase/storage";
import { Configuration, OpenAIApi } from 'openai';
import imageToBase64 from 'image-to-base64';
import { firebaseConfig, ai_key, orgId } from './secrets.js';

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

const configuration = new Configuration({
  organization: orgId,
  apiKey: ai_key
});

const openai = new OpenAIApi(configuration);

const dateObj = new Date();
const generationDate = `${dateObj.getUTCMonth() + 1}-${dateObj.getUTCDate()}-${dateObj.getUTCFullYear()}`;

// get our prompt
const completion = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: [{role: 'user', content: 'Create a four to six word sentence with at least one singular subject, one adjective, and one verb'}]
});

console.log(completion.data.choices[0].message);

const imagePrompt = completion.data.choices[0].message.content;

const res = await openai.createImage({
  prompt: imagePrompt,
  n: 1,
  size: '1024x1024'
});

const image_url = res.data.data[0].url;
console.log(image_url);

const imageRes = await imageToBase64(image_url);

// create a ref to our image in cloud storage
const imageRefInCloud = ref(storage, generationDate);

uploadString(imageRefInCloud, imageRes).then(() => {
  console.log('uploaded to cloud');
});


// set our data
await setDoc(doc(db, 'daily', generationDate), {
  prompt: imagePrompt
});