import { React, useState, useEffect } from 'react';
import footer from '../assets/footer.png';
import '../App.css';
import GSAPAnimation from '../components/GSAPAnimation';
import { AiOutlineAudio } from 'react-icons/ai';
import { AiFillAudio } from 'react-icons/ai';
import OpenAI from 'openai';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Select from 'react-select';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';

const API_KEY = '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';
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function Homepage() {
    const SUBTITLE_MAX_LENGTH = 30;
    const [buttonState, setButtonState] = useState('button');
    const [url, setUrl] = useState([]);
    const [urlTraverse, setUrlTraverse] = useState(-1);
    const [buttonText, setButtonText] = useState('Talk to me!');
    const [story, setStory] = useState([]);
    const [count, setCount] = useState(0);
    const [subtitles, setSubtitles] = useState('');
    const [lastIndex, setLastIndex] = useState(0);
    const [start, setStart] = useState(0);
    let {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        finalTranscript,
    } = useSpeechRecognition();

    useEffect(() => {
        if (finalTranscript.length > SUBTITLE_MAX_LENGTH + lastIndex) {
            setLastIndex(finalTranscript.length);
        }
        setSubtitles(transcript.slice(lastIndex));
    }, [transcript, subtitles, finalTranscript]);

    useEffect(() => {
        console.log(finalTranscript);
        if (finalTranscript.length - start > 100) {
            setStory([
                ...story,
                finalTranscript.slice(start, finalTranscript.length),
            ]);
            setStart(finalTranscript.length);
            generateImage();
        }
        console.log(story);
    }, [finalTranscript, story]);

    const options = [
        { value: 'en-US', label: 'English' },
        { value: 'zh-CN', label: 'Chinese 中文' },
        { value: 'ko', label: 'Korean 한국어' },
    ];

    const [selectedOption, setSelectedOption] = useState('en-US');

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    const buttonClickHandler = () => {
        if (buttonText == 'Talk to me!') {
            setButtonText("I'm listening...");
            resetTranscript();
            console.log('listening start');
            SpeechRecognition.startListening({
                continuous: true,
                language: selectedOption.value,
            });
        } else {
            setButtonText('Talk to me!');
            SpeechRecognition.stopListening();
        }
        setButtonState('button animate');
        setTimeout(() => {
            setButtonState('button');
        }, 1000);
    };

    async function titleImage() {
        const title = 'Humpty Dumpty';
        const response = await openai.images.generate({
            model: 'dall-e-2',
            prompt: `
            Create a cartoon image for childrens' viewing of {title}. Each hue is carefully chosen to evoke feelings of happiness, warmth, and wonder, captivating young hearts with their vibrant allure
            Amidst the vibrancy and color, the characters retain their essence while being immersed in the joyous world of {title}.
            title: ${title}`,
            n: 1,
            size: '1024x1024',
        });
        setUrl([...url, response.data[0].url.toString()]);
        console.log(url);
        setUrlTraverse(urlTraverse + 1);
    }

    async function generateImage() {
        console.log('loading..');
        const text = story[count];
        const title = 'Winnie the Pooh';
        setCount(count + 1);
        console.log(text);
        const response = await openai.images.generate({
            model: 'dall-e-2',
            prompt: `Create a cartoon image for childrens' viewing of {title} based on the {text}.Each hue is carefully chosen to evoke feelings of happiness, warmth, and wonder, captivating young hearts with their vibrant allure
            Amidst the vibrancy and color, the characters retain their essence while being immersed in the joyous world of {title}.
            title: ${title}
            text: ${text}`,
            n: 1,
            size: '1024x1024',
        });
        setUrl([...url, response.data[0].url]);
        setUrlTraverse(urlTraverse + 1);
    }

    const goBack = () => {
        const toSet = urlTraverse > 1 ? urlTraverse - 1 : 0;
        setUrlTraverse(toSet);
    };
    const goForward = () =>{
        const toSet = urlTraverse < url.length ? urlTraverse + 1 : url.length -1
        setUrlTraverse(toSet)
    }

    return (
        <div className="flex">
            <div className="bg-[#a8d0fa] flex-1">
                <div className="flex flex-col items-center justify-center text-white h-screen p-0 ">
                    <div className="flex space-x-1">
                        <GSAPAnimation />
                    </div>
                    <div>
                        <button onClick={titleImage}>Click</button>
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
                    {urlTraverse != -1 && (
                        <div style={{ height: '40px' }}>
                            <span
                                onClick={goBack}
                                class="material-symbols-outlined"
                            >
                                arrow_back_ios
                            </span>
                            <img
                                src={url[urlTraverse]}
                                style={{ height: '70vh'}}
                            />
                            <span
                                onClick={goForward}
                                class="material-symbols-outlined"
                            >
                                arrow_forward_ios
                            </span>
                        </div>
                    )}
                    <div className="mt-auto max-w-full m-0 pt-96">
                        {subtitles}
                    </div>
                    <div  className="mt-auto">
                        <img src={footer}  className="max-w-full m-0 p-0 " />
                    </div>
                    <div className="bg-[#a8d0fa]">
                        <Select
                            className="color-[#a8d0fa] text-black"
                            defaultValue={options[0]}
                            onChange={setSelectedOption}
                            options={options}
                            isSearchable={true}
                            placeholder={'English'}
                        ></Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
