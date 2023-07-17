import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

function Login() {
    const navigate = useNavigate();
    const [audioSrc1, setAudioSrc1] = useState('');
    const [audioSrc2, setAudioSrc2] = useState('');

    const fetchData = async () => {
        const response = await axios.post('http://10.73.3.223:55231/api/getPreAudios');
        // console.log("audioRes", audioRes)
        // const audioRes = JSON.parse(response.data); // 解析 JSON 字符串为 JavaScript 数组
        console.log("audioRes", response.data)
        // const audioSrcList = audioRes.data.map(audio => `data:audio/mp3;base64,${audio.audio}`);
        setAudioSrc1(`data:audio/mp3;base64,${response.data.audio[0]}`); // 设置第一个音频的 audioSrc
        setAudioSrc2(`data:audio/mp3;base64,${response.data.audio[1]}`); // 设置第二个音频的 audioSrc
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleLogin = async (event) => {
        event.preventDefault();
        // 发送POST请求到后端
        try {
            await axios.post('http://10.73.3.223:55231/api/login');
            navigate('/music');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <p>在正式实验开始之前，请先聆听下面两端音频</p>
            <h4 style={{ textAlign: 'center' }}>注：页面加载需要一点时间，请等待图片加载完成再开始答题</h4>
            <div class="audio-player-container">
                <ReactAudioPlayer src={audioSrc1} controls />
            </div>
            <div class="audio-player-container">
                <ReactAudioPlayer src={audioSrc2} controls />
            </div>
            <form onSubmit={handleLogin}>
                <input type="submit" value="完成" />
            </form>
        </div>

    );
}

export default Login;
