import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
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
        <form onSubmit={handleLogin}>
            <input type="submit" value="登录" />
        </form>
    );
}

export default Login;
