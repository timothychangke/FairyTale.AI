import { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import gsap from 'gsap';

export default function GASPAnimation() {
    useEffect(() => {
        let textAnimation = gsap.timeline();
        textAnimation.from('.word', {
            y: -80,
            stagger: {
                each: 0.08,
            },
        });
    }, []);
    return (
        <div
            className="w-100 p-3 vh-20 d-flex align-items-center text-white justify-column-center flex-column"
            class="text-animation"
        >
            <div className="d-flex">
                {`FairyTale.AI`.split('').map((word, i) => {
                    let text;
                    if (word === ' ') {
                        return (
                            <div className="word" key={i}>
                                &nbsp;
                            </div>
                        );
                    } else {
                        if (i === 1 || i === 2) {
                            return (
                                <div
                                    className="word drop-shadow-[0_3px_5px_rgba(255,255,0,0.6)]"
                                    key={i}
                                >
                                    {word}
                                </div>
                            );
                        } else {
                            return (
                                <div
                                    className="word drop-shadow-[0_2px_2px_rgba(0,0,0,1)]"
                                    key={i}
                                >
                                    {word}
                                </div>
                            );
                        }
                    }
                })}
            </div>
        </div>
    );
}
