import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import Modal from 'react-modal';
function Music() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        // console.log("index", index)
        var formData = new FormData()
        formData.append('index', nextButtonClickCount+1)
        const imageRes = await axios.post('http://10.73.3.223:55231/api/getImages', formData);
        const audioRes = await axios.post('http://10.73.3.223:55231/api/getAudio', formData);

        setImages(imageRes.data.images.map(image => `data:image/png;base64,${image}`));
        setAudioSrc(`data:audio/mp3;base64,${audioRes.data.audio}`);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const formData = new FormData();
            formData.append('index', 0);
      
            const imageRes = await axios.post('http://10.73.3.223:55231/api/getImages', formData);
            const audioRes = await axios.post('http://10.73.3.223:55231/api/getAudio', formData);
      
            setImages(imageRes.data.images.map(image => `data:image/png;base64,${image}`));
            setAudioSrc(`data:audio/mp3;base64,${audioRes.data.audio}`);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

    useEffect(() => {
        if (nextButtonClickCount === 5) {
            setShowFinishButton(true);
        }
    }, [nextButtonClickCount]);
    const handleClick = () => {
        setButtonAState(false);
        setButtonBState(false);
        setButtonCState(false);
        setButtonDState(false);
        setNextButtonClickCount(prevCount => prevCount + 1);
        fetchData(); // 重新获取图片和音乐
        console.log("nextButtonClickCount", nextButtonClickCount)

    };
    const handleFinish = async () => {
        // Perform finish button functionality here
        await axios.get('http://10.73.3.223:55231/api/finish');
        setIsModalOpen(true);
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
                <p>问题1：下面哪一个文字版式形式与听到的音乐节奏变化最匹配（如音乐节奏变化越大字体排版形式变化越大）？</p>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc} controls />
                </div>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonAState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A1')}>A. Select!</button>
                    <button style={{ backgroundColor: buttonBState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B1')}>B. Select!</button>
                </div>

            </div>
            <div>
                <p>问题2：下面哪个文字版式形式更能引起你的喜好？</p>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonCState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A2')}>A. Select!</button>
                    <button style={{ backgroundColor: buttonDState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B2')}>B. Select!</button>
                </div>
            </div>
            <div className="button-container-next">
                {showFinishButton ? (
                    <button style={{ backgroundColor: isHovered ? '#4CAF50' : '#f4eeee' }} onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} onClick={handleFinish}>Finish</button>

                ) : (
                    <button style={{ backgroundColor: isHovered ? '#4CAF50' : '#f4eeee' }} onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave} onClick={handleClick}>Next</button>
                )}
            </div>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2>感谢您完成本次实验！</h2>
                <button onClick={() => setIsModalOpen(false)}>关闭</button>
            </Modal>
        </div>
    );
}

export default Music;