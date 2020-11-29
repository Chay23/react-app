import React, {useEffect} from 'react';

const  Users = (props) => {  

    useEffect(() => {
        fetch("http://localhost:8000/api/v1/auth/users/", {
        method: 'GET',
        headers: {
            'Authorization': `Token ${props.token}`
            }})
        .then(res => res.json())
        .then(result => (console.log(result)));
    });
    return(
        <div>

        </div>
    );
    
}

export default Users;