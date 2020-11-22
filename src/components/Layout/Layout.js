import React from 'react';
import classes from './Layout.module.css';


const layout = (props) => (
    <div>
        <main>
            {props.children}
        </main>
    </div>
);

export default layout;