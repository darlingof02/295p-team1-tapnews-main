import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Auth from '../Auth/Auth';
// import { IP } from '../const';
import EditModal from './EditModal'
import "./PersonProfile.css"
import { IP } from '../const';


const PersonProfile = ()=> {
    const [userInfo, setUserInfo] = useState({
        "email": "yuninx1@uci.edu",
        "birthday": new Date(),
        "alias": "hello world",
        "country": "US"
    });

    const [userEmail, setEmail] = useState("")
    const [userBirthday, setBirth] = useState("")
    const [userAlias, setAlias] = useState("")
    const [userCountry, setCountry] = useState("")
     useEffect(()=>{
        loadUserInfo()
        console.log(userInfo)
     },[])


     const show = () => {
         console.log(userAlias)
     }
    const loadUserInfo = () => {
        let url = `http://${IP}:3000/news/userId/` + Auth.getEmail()
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
            },
            cache: 'no-cache',
        });
        console.log("beforefetch")
        fetch(request)
            .then((res) => res.json())
            .then((res) => {
                console.log(res[0])
                setUserInfo(res[0])
                setEmail(res[0]['email'])
                setBirth(res[0]['birthday'])
                setAlias(res[0]['alias'])
                setCountry(res[0]['country'])
            })
            
        console.log("afterfetch")
    }
     
    const updateEmail = () => {
        alert("Email changed")
    }

    const updateBirth = () => {
        alert("Birthday changed")
    }

    const updateAlias = () => {
        // let url = 'http://localhost:3000/news/update/userId/'+Auth.getEmail()
        // let request = new Request(encodeURI(url), {
        //     method: 'POST',
        //     cache: 'no-cache',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         email: this.state.user.email,
        //         alias: this.state.
        //     })
        // })


        alert("display of name changed")
    }

    const updateCountry = () => {
        alert("residency of country changed")
    }
    

    return (

        <div className='ProfileContainer'>

            <div className='ProfileTitle title'>
                This is Profile
            </div>
            <div className='ProfileContainer'>
                <div className = 'ProfileItem'>
                    <div className='ProfileLabel'>
                        <div>Email:</div>
                    </div>
                    <div className='ProfileContent'>
                        <div>{userEmail === undefined || userEmail === "" ? "None Set" : userEmail}</div>

                        {/* <EditModal update={updateEmail} attr={"email"}/> */}
            
                    </div>
                </div>
                <div className = 'ProfileItem'>
                    <div className='ProfileLabel'>
                        <div>Birthday:</div>
                    </div>
                    <div className='ProfileContent'>
                        <div>{userBirthday === undefined || userBirthday === "" ? "None Set" : userBirthday}</div>

                        <EditModal update={updateBirth} attr={"birthday"}/>
            
                    </div>
                </div>
                <div className = 'ProfileItem'>
                    <div className='ProfileLabel'>
                        <div>Alias:</div>
                    </div>
                    <div className='ProfileContent'>
                        <div>{userAlias === undefined || userAlias ===  "" ? "None Set" : userAlias}</div>

                        <EditModal update={updateAlias} attr={"alias"}/>
            
                    </div>
                </div>
                <div className = 'ProfileItem'>
                    <div className='ProfileLabel'>
                        <div>Country:</div>
                    </div>
                    <div className='ProfileContent'>
                        <div>{userCountry === undefined || userCountry ===  "" ? "None Set" : userCountry}</div>

                        <EditModal update={updateCountry} attr={"country"}/>
            
                    </div>
                </div>
                
                    {/* <div className='ProfileContent'>
                        <div>{userEmail === undefined || userEmail === "" ? "None Set" : userEmail}</div>
                        <div>{userBirthday === undefined || userBirthday === "" ? "None Set" : userBirthday}</div>
                        <div>{userAlias === undefined || userAlias ===  "" ? "None Set" : userAlias}</div>
                        <div>{userCountry === undefined || userCountry ===  "" ? "None Set" : userCountry}</div>
                        <div className='UpdateButton'>
                        <EditModal update={updateEmail} attr={"email"}/>
                        <EditModal update={updateBirth} attr={"birthday"}/>
                        <EditModal update={updateAlias} attr={"alias"}/>
                        <EditModal update={updateCountry} attr={"country"}/>
                    </div>
                    </div> */}
                    



            </div>
        </div>
    )
}

export default PersonProfile