import React from 'react';
import './Main.css';

function Main(){
    return(
        <div className="container">
            <h1 style={{textAlign: "center"}}>Welcome</h1>
            <div className="link-container">
                <a className="link-to-instruction" href=''>Instruction for teachers</a>
                <a className="link-to-instruction" href=''>Instruction for students</a>
            </div>
            <div className="updates-container">
                <h3>Updates</h3>
                <div className="update">
                    <p>Technical works will be carried out from 15.00 January 4th, 2021 to  15.00 January 5th, 2021.</p>
                </div>
            </div>
        </div>
    );
}

export default Main;