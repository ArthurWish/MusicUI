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
    const [buttonEState, setButtonEState] = useState(false);
    const [buttonFState, setButtonFState] = useState(false);
    const [images, setImages] = useState([]);
    const [audioSrc1, setAudioSrc1] = useState('');
    const [audioSrc2, setAudioSrc2] = useState('');
    const [nextButtonClickCount, setNextButtonClickCount] = useState(0);
    const [showFinishButton, setShowFinishButton] = useState(false);
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [audio1Played, setAudio1Played] = useState(false);
    const [audio2Played, setAudio2Played] = useState(false);
    const [audio3Played, setAudio3Played] = useState(false);
    const [audio4Played, setAudio4Played] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleAudio1Ended = () => {
        setAudio1Played(true);
    };

    const handleAudio2Ended = () => {
        setAudio2Played(true);
    };

    const handleAudio3Ended = () => {
        setAudio3Played(true);
    };

    const handleAudio4Ended = () => {
        setAudio4Played(true);
    };

    const fetchData = async () => {
        // console.log("index", index)
        var formData = new FormData()
        formData.append('index', nextButtonClickCount + 1)
        const imageRes = await axios.post('http://10.73.3.223:55231/api/getImages', formData);
        const audioRes = await axios.post('http://10.73.3.223:55231/api/getAudio', formData);

        setImages(imageRes.data.images.map(image => `data:image/png;base64,${image}`));
        setAudioSrc1(`data:audio/mp3;base64,${audioRes.data.audio[0]}`);
        setAudioSrc2(`data:audio/mp3;base64,${audioRes.data.audio[1]}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const formData = new FormData();
                formData.append('index', 0);

                const imageRes = await axios.post('http://10.73.3.223:55231/api/getImages', formData);
                const audioRes = await axios.post('http://10.73.3.223:55231/api/getAudio', formData);

                setImages(imageRes.data.images.map(image => `data:image/png;base64,${image}`));
                setAudioSrc1(`data:audio/mp3;base64,${audioRes.data.audio[0]}`);
                setAudioSrc2(`data:audio/mp3;base64,${audioRes.data.audio[1]}`);
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
    const handleClick = async (event) => {
        event.preventDefault();
        if (audio1Played && audio2Played && audio3Played && audio4Played) {
            setButtonAState(false);
            setButtonBState(false);
            setButtonCState(false);
            setButtonDState(false);
            setButtonEState(false);
            setButtonFState(false);
            setNextButtonClickCount(prevCount => prevCount + 1);
            var formData = new FormData();
            formData.append('selections', JSON.stringify(selectedButtons));
            console.log("selectedButtons", selectedButtons)
            await axios.post('http://10.73.3.223:55231/api/sendSelections', formData);
            setSelectedButtons([]);
            await fetchData(); // 重新获取图片和音乐
            console.log("nextButtonClickCount", nextButtonClickCount);
            setAudio1Played(false);
            setAudio2Played(false);
            setAudio3Played(false);
            setAudio4Played(false);
        } else {
            alert('请先聆听完音频');
        }

    };
    const handleFinish = async () => {
        var formData = new FormData();
        formData.append('selections', JSON.stringify(selectedButtons));
        console.log("selectedButtons", selectedButtons)
        await axios.post('http://10.73.3.223:55231/api/sendSelections', formData);
        setSelectedButtons([]);
        // Perform finish button functionality here
        await axios.get('http://10.73.3.223:55231/api/finish');
        setIsModalOpen(true);
    };
    /**
     * 选择不会重复，并且记录按钮被点击状态
     * @param {*} data 
     */
    const handleSelection = async (data) => {
        // 删除同组中的其它选项
        const group = data[1]; // 获取选项的组别
        setSelectedButtons(prevState => prevState.filter(item => item[1] !== group));

        // 添加新选项
        setSelectedButtons(prevState => [...prevState, data]);
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
        } else if (data === 'A3') {
            setButtonEState(true);
            setButtonFState(false);
        } else if (data === 'B3') {
            setButtonEState(false);
            setButtonFState(true);
        }
        // const selection = '1' + option;
        // var formData = new FormData()
        // formData.append('data', data)
        // await axios.post('http://10.73.3.223:55231/api/sendSelection', formData);
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
                <div class="image-label">A</div>
                <div class="image-label">B</div>
            </div>
            <div>
                <p>1.A图的字体布局与下面哪个音乐片段最匹配</p>
                <h3 style={{ textAlign: 'center' }}>音乐A</h3>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc1} controls onEnded={handleAudio1Ended} />
                </div>
                <h3 style={{ textAlign: 'center' }}>音乐B</h3>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc2} controls onEnded={handleAudio2Ended} />
                </div>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonAState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A1')}>音乐A</button>
                    <button style={{ backgroundColor: buttonBState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B1')}>音乐B</button>
                </div>

            </div>
            <div>
                <p>2.B图的字体布局与下面哪个音乐片段最匹配</p>
                <h3 style={{ textAlign: 'center' }}>音乐A</h3>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc1} controls onEnded={handleAudio3Ended} />
                </div>
                <h3 style={{ textAlign: 'center' }}>音乐B</h3>
                <div class="audio-player-container">
                    <ReactAudioPlayer src={audioSrc2} controls onEnded={handleAudio4Ended} />
                </div>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonCState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A2')}>音乐A</button>
                    <button style={{ backgroundColor: buttonDState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B2')}>音乐B</button>
                </div>
            </div>
            <div>
                <p>3. 你更喜欢哪个文字版式</p>
                <div class="button-container">
                    <button style={{ backgroundColor: buttonEState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('A3')}>图片A</button>
                    <button style={{ backgroundColor: buttonFState ? '#4CAF50' : '#f4eeee' }} onClick={() => handleSelection('B3')}>图片B</button>
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