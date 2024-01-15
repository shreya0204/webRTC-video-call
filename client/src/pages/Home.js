import React from 'react';

const Home = () => {
    return (
        <div className='home_container'>
            <div className='home_input__container'>
                <input type="email" placeholder="Enter your email address" />
                <input type="text" placeholder="Enter room code" />
                <button className='home_enter_button'>Enter Room</button>
            </div>
        </div>
    );
}

export default Home;