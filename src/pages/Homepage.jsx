import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import footer from '../assets/footer.png';
import '../App.css';
import GSAPAnimation from './GASPAnimation';
import { AiOutlineAudio } from 'react-icons/ai';
import { AiFillAudio } from 'react-icons/ai';
import OpenAI from 'openai';
import Queue from '../queue/queue';

const API_KEY = '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';
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function Homepage() {
    const [buttonState, setButtonState] = useState('button');
    const [image, setImage] = useState(null);
    const [buttonText, setButtonText] = useState('Talk to me!');
    const [story,setStory] = useState([
        //"나는 행복한 소녀입니다. 난 클럽에 가서 남자들과 어울리는 걸 좋아해"
        "Little Red Riding Hood lived in a wood with her mother. One day Little Red Riding Hood went to visit her granny.","She had a nice cake in her basket. On her way Little Red Riding Hood met a wolf.","‘Hello!’ said the wolf. ‘Where are you going?’ ‘I’m going to see my grandmother. She lives in a house behind those trees.’","The wolf ran to Granny’s house and ate Granny up. He got into Granny’s bed.","A little later, Little Red Riding Hood reached the house. She looked at the wolf. ‘Granny, what big eyes you have!’ ‘All the better to see you with!’ said the wolf."
    ])
    const [count, setCount] = useState(0)
    const buttonClickHandler = () => {
        if (buttonText == 'Talk to me!') {
            setButtonText("I'm listening...");
        } else {
            setButtonText('Talk to me!');
        }
        setButtonState('button animate');
        setTimeout(() => {
            setButtonState('button');
        }, 1000);
    };

    async function generateImage() {
        const text = story[count];
        setCount(count + 1);
        console.log(text)
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `Create cartoon image for childrens' viewing aide during story telling of the following text.
            text: ${text}`,
            n: 1,
            size: '1024x1024',
        });
        setImage(response.data[0].url);
    }

    return (
        <div className="flex">
            <div className="bg-[#a8d0fa] flex-1">
                <div className="flex flex-col items-center justify-center text-white h-screen p-0 ">
                    <div className="flex space-x-1">
                        <GSAPAnimation />
                    </div>
                    <div>
                        <button
                            onClick={buttonClickHandler}
                            class={buttonState}
                        >
                            {buttonText == 'Talk to me!' ? (
                                <AiOutlineAudio className="size-5" />
                            ) : (
                                <AiFillAudio className="size-5" />
                            )}
                            <span
                                className={
                                    buttonText == 'Talk to me!' ? 'pl-2' : ''
                                }
                            >
                                {buttonText}
                            </span>
                        </button>
                    </div>
                    <div>
                        <button onClick={generateImage}>
                            <span>Try</span>
                        </button>
                    </div>
                    {image && <img src={image} style={{height : "60vh"}} />}
                    <div className="mt-auto">
                        <img src={footer} className="max-w-full m-0 p-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}
