import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gsap from 'gsap';


export default function GASPAnimation() {
    useEffect(() => {
        let textAnimation = gsap.timeline();
        textAnimation.from('.word', {
            y: -100,
            stagger: {
                each: 0.1,
            },
        });
    }, []);
    return (
        <div className="w-100 p-3 vh-20 d-flex align-items-center text-white justify-column-center flex-column" class='text-animation'>
            <div className="d-flex" >
                {`FairyTale.AI`.split('').map((word, i) => {
                    let text;
                    if (word === ' ') {
                        return (<div className="word" key={i}>
                        &nbsp;
                    </div>)
                    } else {
                        if (i === 1 || i === 2) {
                            return <div className="word text-sky-200" key={i}>
                            {word}
                        </div>
                        } else {
                            return (<div className="word" key={i}>
                            {word}
                        </div>)
                        }
                    }
                })}
            </div>
        </div>
    );
}
