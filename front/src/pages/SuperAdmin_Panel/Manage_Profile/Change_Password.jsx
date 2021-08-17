import React, { useState, useEffect } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"

export default function Change_Password() {

    const id = 1;
    const history = useHistory();

    const [state, updateState] = useState({
        id: id,
        password: "",
        oldPass: "",
        newPass: "",
        newPassC: "",
        msg: ""
    });

    function setState(nextState){
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e){
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function updateAdmin() {
        let reqBody = { password: state.newPass }
        await API.put(`admin/${id}`, reqBody);
    }

    async function handleSubmit(e) {
        e.nativeEvent.preventDefault();

        if (state.password === state.oldPass && state.newPass === state.newPassC) {
            updateAdmin();

            setState({
                oldPass: "",
                newPass: "",
                newPassC: "",
                msg: "Password changed successfully"
            })

            history.push({ pathname: '/admin/profile' })
        }

        else {
            setState({
                oldPass: "",
                newPass: "",
                newPassC: "",
                msg: "Password incorrect"
            })
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`admin/${id}`)
                .then(res => {
                    const result = res.data.result;
                    setState({ id: result.id })
                    setState({ password: result.password })
                })
        }
        fetchData();
    }, [])

    return (
        <form onSubmit={handleSubmit}>
            <span>Change Your password</span>

            <input
                type="password"
                name="oldPass"
                value={state.oldPass}
                placeholder="Old Password"
                onChange={handleChange}
            />

            <input
                type="password"
                name="newPass"
                value={state.newPass}
                placeholder="New Password"
                onChange={handleChange}
            />

            <input
                type="password"
                name="newPassC"
                value={state.newPassC}
                placeholder="Confirm Password"
                onChange={handleChange}
            />

            <label>{state.msg}</label>
            <button type="submit">Update</button>

        </form>
    )
}