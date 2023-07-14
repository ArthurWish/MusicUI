import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

function Music() {
    const [isHovered, setIsHovered] = useState(false);
    const [buttonAState, setButtonAState] = useState(false);
    const [buttonBState, setButtonBState] = useState(false);
    const [buttonCState, setButtonCState] = useState(false);
    const [buttonDState, setButtonDState] = useState(false);
    const [images, setImages] = useState([]);
    const [audioSrc, setAudioSrc] = useState('');
    const [nextButtonClickCount, setNextButtonClickCount] = useState(0);
    const [showFinishButton, setShowFinishButton] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const fetchData = async () => {
        const imageRes = await axios.get('http://10.73.3.223:55231/api/getImages');
        const audioRes = await axios.get('http://10.73.3.223:55231/api/getAudio');

        setImages(imageRes.data.images.map(image => `data:image/png;base64,${image}`));
        setAudioSrc(`data:audio/mp3;base64,${audioRes.data.audio}`);
    };

    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        if (nextButtonClickCount === 10) {
            setShowFinishButton(true);
        }
    }, [nextButtonClickCount]);
    const handleClick = () => {
        setButtonAState(false);
        setButtonBState(false);
        setButtonCState(false);
        setButtonDState(false);
        fetchData(); // 重新获取图片和音乐
        setNextButtonClickCount(prevCount => prevCount + 1);
        console.log("nextButtonClickCount", nextButtonClickCount)

    };
    const handleFinish = async () => {
        // Perform finish button functionality here
        await axios.get('http://10.73.3.223:55231/api/finish');
    };
    const handleSelection = async (data) => {
        if (data === 'A1') {
            setButtonAState(true);
            setButtonBState(false);
        } else if (data === 'B1') {
            setButtonAState(false);
            setButtonBState(true);
        } else if (data === 'A2') {
            setButtonCState(true);
            setButtonDState(false);
        } else if (data === 'B2') {
            setButtonCState(false);
            setButtonDState(true);
        }
        // const selection = '1' + option;
        var formData = new FormData()
        formData.append('data', data)
        await axios.post('http://10.73.3.223:55231/api/sendSelection', formData);
    };

    return (
        <div class="container">
            <div class="image-container">
                {images.map((img, index) => (
                    <div key={index}>
                        <img src={img} alt='' />
                    </div>
                ))}
            </div>
            <div class="image-container">
                <div class="image-label">Typography A</div>
                <div class="image-label">Typography B</div>
            </div>
            <div>
                <p>1. Listen to the following music and select which typography is most related to the music.</p>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc} controls />
                </div>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonAState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A1')}>A. Select!</button>
                    <button style={{ backgroundColor: buttonBState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B1')}>B. Select!</button>
                </div>

            </div>
            <div>
                <p>2. Which typography most likely to arouse your emotions?</p>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonCState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A2')}>A. Select!</button>
                    <button style={{ backgroundColor: buttonDState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B2')}>B. Select!</button>
                </div>
            </div>
            <div className="button-container-next">
                {showFinishButton ? (
                    <button style={{ backgroundColor: isHovered ? '#4CAF50': '#f4eeee'}} onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} onClick={handleFinish}>Finish</button>
                ) : (
                    <button style={{ backgroundColor: isHovered ? '#4CAF50': '#f4eeee'}} onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} onClick={handleClick}>Next</button>
                )}
            </div>
        </div>
    );
}

export default Music;