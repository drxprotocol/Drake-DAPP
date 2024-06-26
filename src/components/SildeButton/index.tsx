import * as React from 'react';
import './index.scss';

interface SilderButtonProps {
    onChange: Function;
    wordsList: string[];
    active?: string;
    device?: 'mobile' | 'pc';
}

export const SildeButton: React.FC<SilderButtonProps> = ({ onChange, wordsList, active, device }) => {
    // 1.41rem = 141px and mobile design silde button width is 288px, the pc design silde button width is 340px
    const stepMax = device === 'mobile' ? 123 : 168;
    const stepMin = device === 'mobile' ? 0.01 : 1;
    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    const [step, setStep] = React.useState<number>(active === wordsList[0] ? stepMin : stepMax);

    const handleChange = () => {
        if (step === stepMin) {
            setStep(stepMax);
            onChange(wordsList[1]);
            setActiveIndex(1);
        } else {
            setStep(stepMin);
            onChange(wordsList[0]);
            setActiveIndex(0);
        }
    };

    React.useEffect(() => {
        setActiveIndex(wordsList.indexOf(active ? active : wordsList[0]));
        if (wordsList.indexOf(active ? active : wordsList[0]) === 0) {
            setStep(stepMin);
        } else {
            setStep(stepMax);
        }
    }, [active]);

    React.useEffect(() => {
        if (wordsList.length !== 2) {
            throw new Error('In the silde button wordsList length must be 2 !');
        }
    }, []);

    return (
        <div className={device === 'pc' ? 'silde-button-pc' : 'silde-button-mobile mt-8'}>
            <div
                style={{
                    left: 1,
                    transform: `translateX(${step}px`,
                }}
                className="active"
            >
                {wordsList[activeIndex]}
            </div>
            {wordsList.map((e, i) => (
                <span className="btn-item" key={i} onClick={handleChange}>
                    {e}
                </span>
            ))}
        </div>
    );
};
