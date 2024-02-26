import { React, useState, useEffect } from 'react';
import footer from '../assets/footer.png';
import '../App.css';
import GSAPAnimation from '../components/GSAPAnimation';
import { AiOutlineAudio } from 'react-icons/ai';
import { AiFillAudio } from 'react-icons/ai';
import OpenAI from 'openai';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import '../Modal.css';
import DropDown from '../components/Dropdown';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
});

export default function Homepage() {
    const [buttonState, setButtonState] = useState('button');
    const [url, setUrl] = useState([]);
    const [urlTraverse, setUrlTraverse] = useState(-1);
    const [buttonText, setButtonText] = useState('Talk to me!');
    const [story, setStory] = useState([]);
    const [count, setCount] = useState(0);
    const [subtitles, setSubtitles] = useState('');
    const [lastIndex, setLastIndex] = useState(0);
    const [start, setStart] = useState(0);
    const [selectedOption, setSelectedOption] = useState('en-US');
    const [modal, setModal] = useState(true);
    const [title, setTitle] = useState('');
    var pinyin = require('chinese-to-pinyin');
    let {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        finalTranscript,
    } = useSpeechRecognition();

    useEffect(() => {
        let SUBTITLE_MAX_LENGTH;
        if (
            selectedOption.value === 'zh-CN' ||
            selectedOption === 'ko' ||
            selectedOption === 'ta-IN'
        ) {
            SUBTITLE_MAX_LENGTH = 10;
            if (transcript.length > SUBTITLE_MAX_LENGTH + lastIndex) {
                setLastIndex(transcript.length);
            }
            setSubtitles(transcript.slice(lastIndex));
        } else {
            SUBTITLE_MAX_LENGTH = 20;
            if (finalTranscript.length > SUBTITLE_MAX_LENGTH + lastIndex) {
                setLastIndex(finalTranscript.length);
            }
            setSubtitles(transcript.slice(lastIndex));
        }
    }, [transcript, subtitles, finalTranscript, lastIndex, selectedOption]);

    useEffect(() => {
        if (finalTranscript.length - start > 100) {
            setStory([
                ...story,
                finalTranscript.slice(start, finalTranscript.length),
            ]);
            console.log(finalTranscript.slice(start, finalTranscript.length));
            setStart(finalTranscript.length);
            generateImage();
        }
        console.log(story);
    }, [finalTranscript, story]);

    const options = [
        { value: 'en-US', label: 'English' },
        { value: 'zh-CN', label: 'Chinese 中文' },
        { value: 'es-US', label: 'Spanish española' },
        { value: 'ta-IN', label: 'Tamil தமிழ்' },
        { value: 'ko', label: 'Korean 한국어' },
    ];

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const buttonClickHandler = () => {
        if (buttonText === 'Talk to me!') {
            console.log(selectedOption);
            setButtonText("I'm listening...");
            resetTranscript();
            console.log('listening start');
            SpeechRecognition.startListening({
                continuous: true,
                language: selectedOption,
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
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `
            Create a cartoon image for childrens' viewing of {title}. Each hue is carefully chosen to evoke feelings of happiness, warmth, and wonder, captivating young hearts with their vibrant allure
            Amidst the vibrancy and color, the characters retain their essence while being immersed in the joyous world of {title}.
            title: ${title}`,
            n: 1,
            size: '1024x1024',
        });
        setUrl([...url, response.data[0].url.toString()]);
        console.log(response.data[0].url, urlTraverse);
        setUrlTraverse(urlTraverse + 1);
    }

    const toggleModal = () => {
        setModal(!modal);
    };

    async function generateImage() {
        console.log('loading..');
        console.log(story);
        console.log(count);
        console.log(story[count - 1]);
        const text = story[count - 1];
        setCount(count + 1);
        if (selectedOption.value === 'zh-CN') {
            text = pinyin(text);
        }
        const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: `Create a cartoon image for childrens' viewing of {title} based on {text}.All images are to evoke feelings and emotions of the text provided. The characters retain their essence while being immersed in the world of {title}. Make sure the pictures are engaging to children. Do not have any words in the image.
            title: ${title}
            text: ${text}`,
            n: 1,
            size: '1024x1024',
        });
        console.log(response.data[0].url, urlTraverse);
        setUrl([...url, response.data[0].url]);
        setUrlTraverse(urlTraverse + 1);
    }

    function goBack() {
        const toSet = urlTraverse > 1 ? urlTraverse - 1 : 0;
        setUrlTraverse(toSet);
        console.log('hi');
    }

    function goForward() {
        console.log(url);
        const toSet = urlTraverse < url.length ? urlTraverse + 1 : urlTraverse;
        setUrlTraverse(toSet);
    }

    return (
        <div>
            <div className="flex">
                <div className="bg-[#a8d0fa] flex-1">
                    <div className="flex flex-col items-center justify-center text-white h-screen p-0 max-w-max ">
                        <div className="flex space-x-1">
                            {!modal && <GSAPAnimation />}
                        </div>
                        <div>
                            <button
                                onClick={buttonClickHandler}
                                class={buttonState}
                            >
                                {buttonText === 'Talk to me!' ? (
                                    <AiOutlineAudio className="size-5" />
                                ) : (
                                    <AiFillAudio className="size-5" />
                                )}
                                <span
                                    className={
                                        buttonText === 'Talk to me!'
                                            ? 'pl-2'
                                            : ''
                                    }
                                >
                                    {buttonText}
                                </span>
                            </button>
                        </div>
                        {urlTraverse != -1 && (
                            <div className="flex items-center max-w-max max-h-60 z-10 gap-8 pt-64">
                                <div
                                    onClick={goBack}
                                    class="material-symbols-outlined"
                                >
                                    arrow_back_ios
                                </div>
                                <div className="flex-1">
                                    <img
                                        src={url[urlTraverse]}
                                        alt="Story Image"
                                        className="p-0 m-0 h-[430px]"
                                    />
                                </div>

                                <div
                                    onClick={goForward}
                                    class="material-symbols-outlined"
                                >
                                    arrow_forward_ios
                                </div>
                            </div>
                        )}

                        <div className="mt-auto max-w-full m-0 relative top-28 text-xl text-white text-8vmin px-2vmin bg-slate-600 font-serif">
                            {subtitles}
                        </div>
                        {/* <div class="font-sans font-normal text-white text-8vmin bg-black bg-opacity-40 py-2 px-2vmin rounded-4vmin">
                            Your Content Here
                        </div> */}

                        <div style={{ marginTop: '0px' }} className="mt-auto">
                            <img
                                src={footer}
                                className="max-w-full m-0 p-0 "
                                alt="footer"
                            />
                        </div>
                    </div>
                </div>
                {modal && (
                    <div class={modal ? 'active-modal' : 'modal'}>
                        <div class="overlay"></div>
                        <div class="modal-content">
                            <h2 className="text-3xl font-bold text-center mb-2">
                                Welcome to FairyTale.AI
                            </h2>
                            <p className="m-1 mb-3">
                                Before we begin story telling...
                            </p>
                            <div className="flex gap-12">
                                <div class="inputBox">
                                    <input
                                        type="text"
                                        required
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                        }}
                                    />
                                    <span>Story Title</span>
                                </div>
                                <div>
                                    <DropDown
                                        options={options}
                                        setSelectedOption={setSelectedOption}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    toggleModal();
                                    titleImage();
                                }}
                                className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                                type="submit"
                            >
                                Tell me a story!
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
