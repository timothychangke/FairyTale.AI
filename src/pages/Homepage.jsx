import { React, useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import footer from '../assets/footer.png';
import '../App.css';
import GSAPAnimation from './GASPAnimation';
import { AiOutlineAudio } from 'react-icons/ai';
import { AiFillAudio } from 'react-icons/ai';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';

export default function Homepage() {
    const [buttonState, setButtonState] = useState('button');
    const [buttonText, setButtonText] = useState('Talk to me!');
    const {
        transcript,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
    
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
                language: 'en-US',
            });
           
            
        
        } else {
            setButtonText('Talk to me!');

            SpeechRecognition.stopListening();
            /*settranslated([...translatedtranscript, {'role': 'user', 'content':transcript}]);*/
            console.log(transcript)
                /*makeAPIRequest({'role': 'user', 'content':transcript});
             
                response_txt = response_txt.concat(translatedtranscript);*/
        }
        setButtonState('button animate');
        setTimeout(() => {
            setButtonState('button');
        }, 1000);
    };
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
                            <span className={buttonText == 'Talk to me!' ? 'pl-2': ''}>{buttonText}</span>
                        </button>
                    </div>
                    <div className="mt-auto">
                        <img src={footer} className="max-w-full m-0 p-0" />
                    </div>
                </div>
            </div>
        </div>
    );
}