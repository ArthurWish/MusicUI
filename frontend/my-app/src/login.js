import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

function Login() {
  const navigate = useNavigate();
  const [audioSrc1, setAudioSrc1] = useState('');
  const [audioSrc2, setAudioSrc2] = useState('');
  const [audio1Played, setAudio1Played] = useState(false);
  const [audio2Played, setAudio2Played] = useState(false);
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const fetchData = async () => {
    const response = await axios.post('http://10.73.3.223:55231/api/getPreAudios');
    setAudioSrc1(`data:audio/mp3;base64,${response.data.audio[0]}`);
    setAudioSrc2(`data:audio/mp3;base64,${response.data.audio[1]}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAudio1Ended = () => {
    setAudio1Played(true);
  };

  const handleAudio2Ended = () => {
    setAudio2Played(true);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    // if (true) {
    if (audio1Played && audio2Played) {
      try {
        await axios.post('http://10.73.3.223:55231/api/login', {
          gender,
          age,
        });
        navigate('/music');
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('请先聆听完两端音频');
    }
  };

  return (
    <div>
      <p>在正式实验开始之前，请先聆听下面两端音频</p>
      <h4 style={{ textAlign: 'center' }}>注：页面加载需要一点时间，请等待图片加载完成再开始答题</h4>
      <h3 style={{ textAlign: 'center', color: 'blue' }}>节奏变化较大（音乐的响度、音高变化较大）</h3>
      <div className="audio-player-container">
        <ReactAudioPlayer src={audioSrc1} controls onEnded={handleAudio1Ended} />
      </div>
      <h3 style={{ textAlign: 'center', color: 'blue' }}>节奏变化较小（音乐的响度、音高变化较小）</h3>
      <div className="audio-player-container">
        <ReactAudioPlayer src={audioSrc2} controls onEnded={handleAudio2Ended} />
      </div>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            性别:
            <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
          </label>
        </div>
        <div style={{marginBottom: "10px"}}>
          <label>
            年龄:
            <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
        </div>
        
        {/* <input type="submit" value="完成" disabled={!audio1Played || !audio2Played} /> */}
        <input type="submit" value="完成"  />
      </form>
    </div>
  );
}

export default Login;
