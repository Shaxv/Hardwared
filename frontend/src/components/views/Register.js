import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { CSRFToken, MainContext } from "../App"
import { NavLink, useHistory, Redirect } from "react-router-dom"
import toast from "react-hot-toast"
import {
    nullInput,
} from "../constants"

import CountrySelector from "../constants/CountrySelector"
import Countries from "../constants/countries"

export default function Register(props) {
    const [user, setUser] = useContext(MainContext)

    if (user) return <Redirect to="/fiok"/>

    const history = useHistory()

    const [username, setUsername] = useState("")
    const [uidFocus, setUidFocus] = useState(false)

    const [email, setEmail] = useState("")
    const [emailFocus, setEmailFocus] = useState(false)

    const [password, setPassword] = useState("")
    const [pwdFocus, setPwdFocus] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    const [password1, setPassword1] = useState("")
    const [pwd1Focus, setPwd1Focus] = useState(false)

    const [birth, setBirth] = useState("")
    const [birthFocus, setBirthFocus] = useState(false)

    const [country, setCountry] = useState("HU")
    const [countryFocus, setCountryFocus] = useState(false)

    const [address, setAddress] = useState("")
    const [addressFocus, setAddressFocus] = useState(false)

    const [avatar, setAvatar] = useState(null)
    const [pfp, setPfp] = useState(false)


    const [submitState, setSubmitState] = useState("normal")

    const handleSubmit = event => {
        event.preventDefault()

        setSubmitState("loading")

        const fd = new FormData()
        fd.append("username", username)
        fd.append("email", email)
        fd.append("password", password)
        
        fd.append("birth_date", birth)
        fd.append("country", country)
        fd.append("address", address)
        fd.append("avatar", avatar)
        
        axios.post("http://localhost:3000/api/user/register/", fd, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })          
        .then((response) => {
            setTimeout(() => {
                if (response.data.isCreated === "true") {
                    setSubmitState("success")
                    toast.success("Sikeres regisztr??l??s!")
                    setTimeout(() => {
                        history.push("/bejelentkezes")
                    }, 200)
                }
            }, 500)
        })
        .catch((error) => {
            setTimeout(() => {
                toast.error("Hiba t??rt??nt!")
                setSubmitState("error")
            }, 200)

        })
    }

    return (
        <>
        <h1 className="bg-text auth-bg-text">Felhaszn??l??</h1>
        <div className="auth-wrapper register-auth-wrapper">
            <div className="register-container">
                <h1>Regisztr??ci??</h1>
                <hr className="title-hr"/>
                <form method="POST" onSubmit={handleSubmit} action="/fiok" encType="multipart/form-data">
                    <input type="hidden" name="csrfmiddlewaretoken" value={CSRFToken}/>

                    <div className="input-wrapper">
                    <div className="input-container">
                        <label id="uidLabel" className={ uidFocus ? "focus" : "" }><img className="long" src="/static/images/svg/user.svg"/>{ uidFocus ? "Felhaszn??l??n??v:" : "Felhaszn??l??n??v..."}</label>
                        <input name="username" type="text" id="username"
                            value={username}
                            onFocus={() => setUidFocus(true)}
                            onBlur={event => {if (event.target.value === ""){setUidFocus(false)} else {setUidFocus(true)}}}
                            onChange={event => setUsername(event.target.value)}
                        />
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="input-wrapper">
                    <div className="input-container">
                            <label id="emailLabel" className={ emailFocus ? "focus" : "" }><img className="long" src="/static/images/svg/at.svg"/>{ emailFocus ? "Email c??m:" : "Email c??m..." }</label>
                            <input name="email" type="email" id="email"
                                value={email} 
                                onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} 
                                onBlur={event => { if (event.target.value === "") {setEmailFocus(false)} else {setEmailFocus(true)} }}  
                                onChange={event => setEmail(event.target.value)}
                            />
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="input-wrapper">
                    <div className="input-container">
                        <label id="pwdLabel" className={ pwdFocus ? "focus" : "" }><img src="/static/images/svg/key.svg"/>{ pwdFocus ? "Jelsz??:" : "Jelsz??..."}</label>
                        <input name="password" type={ showPwd ? "text" : "password" } id="password"
                            value={password}
                            onFocus={() => setPwdFocus(true)}
                            onBlur={event => {if (event.target.value === ""){setPwdFocus(false)} else {setPwdFocus(true)}}}
                            onChange={event => setPassword(event.target.value)}
                        />
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="input-wrapper">
                    <div className="input-container">
                        <label id="pwdLabel" className={ pwd1Focus ? "focus" : "" }><img src="/static/images/svg/key.svg"/>{ pwd1Focus ? "Jelsz?? meger??s??t??s:" : "Jelsz?? meger??s??t??s..."}</label>
                        <input name="password" type={ showPwd ? "text" : "password" } id="password"
                            value={password1}
                            onFocus={() => setPwd1Focus(true)}
                            onBlur={event => {if (event.target.value === ""){setPwd1Focus(false)} else {setPwd1Focus(true)}}}
                            onChange={event => setPassword1(event.target.value)}
                        />
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="switch-container">
                    <label className="switch">
                        <input type="checkbox" name="pwdShow" onChange={event => {
                            if (event.target.checked === true) {
                                setShowPwd(true)
                            } else {
                            setShowPwd(false)
                        }
                        }} checked={showPwd} value={showPwd}/>
                        <span class="slider round"></span>
                        <label for="pwdShow" id="showPwdLabel">Jelsz?? mutat??sa</label>
                    </label>
                    </div>

                    <hr className="register-divider"/>

                    <div className="input-wrapper">
                    <div className="input-container">
                        <label id="birthLabel" className={ birthFocus ? "focus" : "" }><img src="/static/images/svg/calendar.svg"/>{ birthFocus ? "Sz??let??si d??tum:" : "Sz??let??si d??tum..."}</label>
                        <span className="birth-picker">
                            <input name="birth" type="date" id="birth" className={ birthFocus ? "active" : "" }
                                value={birth}
                                onFocus={() => setBirthFocus(true)}
                                onBlur={event => {if (event.target.value === ""){setBirthFocus(false)} else {setBirthFocus(true)}}}
                                onChange={event => setBirth(event.target.value)}
                                max="2022-12-31"
                            />                        
                        </span>
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <CountrySelector
                        id="countries"
                        open={countryFocus}
                        onToggle={() => setCountryFocus(countryFocus ? false : true)}
                        onChange={val => setCountry(val)}
                        selectedValue={Countries.find(option => option.value === country)}
                    />
                    <span className="sub-input-text country-sub-input-text">* K??telez??</span>

                    <div className="input-wrapper mt-5">
                    <div className="input-container">
                        <label id="addressLabel" className={ addressFocus ? "focus" : "" }><img src="/static/images/svg/marker.svg"/>{ addressFocus ? "C??m:" : "C??m..."}</label>
                        <input name="address" type="text" id="address"
                            value={address}
                            onFocus={() => setAddressFocus(true)}
                            onBlur={event => {if (event.target.value === ""){setAddressFocus(false)} else {setAddressFocus(true)}}}
                            onChange={event => setAddress(event.target.value)}
                        />
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="input-wrapper">
                    <div className="input-container">
                        <button onClick={() => document.getElementById("pfp").click()} id="get-pfp" type="button">
                            <label id="pfpLabel" className={ pfp ? "focus" : "" }><img src="/static/images/svg/user-circle.svg"/>{ pfp ? "Profil k??p:" : "Profil k??p..." }</label>
                            <span id="pfpName">{ pfp ? document.getElementById("pfp").files[0].name : ""}</span>
                        </button>
                        <input name="pfp" type="file" accept="image/*" id="pfp" onChange={event => {
                            setAvatar(event.target.files[0])
                            if (pfp) {
                                setPfp(false)
                            } else {
                                setPfp(true)
                            }
                        }}/>
                    </div>
                    <span className="sub-input-text">* K??telez??</span>
                    </div>

                    <div className="submit-wrapper">
                        <button 
                            className=
                            { submitState === "loading" ? "main-btn submit-btn loading" : 
                            submitState === "success" ? "main-btn submit-btn success" : 
                            submitState === "error" ? "main-btn submit-btn error" : 
                            "main-btn submit-btn" } 
                            type={ submitState === "error" ? "button" : "submit" } 
                            onClick={() => {if (submitState === "error"){ setSubmitState("normal") }} }
                            id="submit"
                        >
                            <span>L??trehoz??s.</span>
                            <div className={ submitState === "success" ? "submit-success active" : "submit-success" }>
                                <i className="fas fa-check"></i>
                            </div>
                            <div className={ submitState === "error" ? "submit-error active" : "submit-error" }>
                                <i class="fas fa-times"></i>
                            </div>
                        </button>
                    </div>

                    <div className="to-login">
                        <NavLink to="/bejelentkezes">Regisztr??lt m??r? Kattintson ide!</NavLink>
                    </div>

                </form>
            </div>
        </div>
        </>
    )

}