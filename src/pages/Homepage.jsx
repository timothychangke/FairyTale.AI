import { React, useState, useEffect } from 'react';
import footer from '../assets/footer.png';
import '../App.css';
import GSAPAnimation from '../components/GSAPAnimation';
import { AiOutlineAudio } from 'react-icons/ai';
import { AiFillAudio } from 'react-icons/ai';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import Select from 'react-select';
import '../Modal.css';
import DropDown from '../components/Dropdown';

export default function Homepage() {
    const [buttonState, setButtonState] = useState('button');
    const [buttonText, setButtonText] = useState('Talk to me!');
    const [subtitles, setSubtitles] = useState('');
    const [lastIndex, setLastIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState('en-US');
    const [modal, setModal] = useState(true);
    const [title, setTitle] = useState('');
    let {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
        finalTranscript,
    } = useSpeechRecognition();

    useEffect(() => {
        let SUBTITLE_MAX_LENGTH;
        if (selectedOption.value === 'zh-CN' || selectedOption === 'ko' || selectedOption === 'ta-IN') {
            SUBTITLE_MAX_LENGTH = 10;
            if (transcript.length > SUBTITLE_MAX_LENGTH + lastIndex) {
                setLastIndex(transcript.length);
            }
            setSubtitles(transcript.slice(lastIndex));
        } else {
            SUBTITLE_MAX_LENGTH = 30;
            if (finalTranscript.length > SUBTITLE_MAX_LENGTH + lastIndex) {
                setLastIndex(finalTranscript.length);
            }
            setSubtitles(transcript.slice(lastIndex));
        }
    }, [transcript, subtitles, finalTranscript, lastIndex, selectedOption]);
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

    const toggleModal = () => {
        setModal(!modal);
    };
    return (
        <div>
            <div className="flex">
                <div className="bg-[#a8d0fa] flex-1">
                    <div className="flex flex-col items-center justify-center text-white h-screen p-0 ">
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
                        <div className="mt-auto max-w-full m-0 pt-96">
                            {subtitles}
                        </div>
                        <div className="mt-auto">
                            <img
                                src={footer}
                                className="max-w-full m-0 p-0 "
                                alt="footer"
                            />
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
            {modal && (
                <div class={modal ? 'active-modal' : 'modal'}>
                    <div class="overlay"></div>
                    <div class="modal-content">
                        <h2 className="text-3xl font-bold text-center mb-2">
                            Welcome to FairyTale.AI
                        </h2>
                        <p className="m-1 mb-3">Before we begin story telling...</p>
                        <div className='flex gap-12'>
                        <div class='inputBox'>
                            <input type='text' required value={title} onChange={(e) => setTitle(e.target.value)}/>
                            <span>Story Title</span>
                        </div>
                        <div>
                            <DropDown options={options} setSelectedOption={setSelectedOption}/>
                        </div>
                        </div>
                        
                        <button
                            onClick={toggleModal}
                            className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                            type='submit'
                        >
                            Tell me a story!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
