import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import API from '../../../API'
import SessionContext from "../../../components/session/SessionContext"

import { toast } from "react-toastify"

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles,
    Container
} from '@material-ui/core'

import { LockOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    root: {
        '& label.Mui-focused': {
            color: theme.palette.primary.main,
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.primary.main,
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: "white !important"
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(4),
    },
    submit: {
        width: 120,
        marginBottom: 20,
        marginTop: 20
    },
    container: {
        backgroundColor: "white",
        paddingBottom: "10px",
        marginBottom: "70px",
        marginTop: "50px",
        borderRadius: "5px"
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
}));

export default function Edit_Type() {

    const classes = useStyles();
    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const { id: id_type } = useParams();
    const history = useHistory();

    const [state, updateState] = useState({
        description: "",
        bill: ""
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        let reqBody = state;
        try {
            await API.get(`type`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(async res => {
                    const result = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        const isDesc = result.find(r => r.description === state.description && String(r.id) !== String(id_type));

                        if (isDesc) {
                            toast.error("Act alredy Exist");
                        } else {
                            await API.put(`type/${id_type}`, reqBody, {
                                headers: {
                                    id: id,
                                    token: token,
                                    isAdmin: isAdmin
                                }
                            })
                                .then(toast.success("Update Acl Successfuly"))
                                .then(history.push({ pathname: '/type/list' }));
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            await API.get(`type/${id_type}`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const data = res.data.result;
                    setState(data)
                });
        }
        fetchData();
    }, []);

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />

            <div className={classes.paper}>

                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>

                <Typography component="h1" variant="h5">
                    Update Act
                </Typography>

                <form
                    className={classes.form}
                    onSubmit={handleSubmit}
                >
                    <Grid container spacing={1}>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                variant="outlined"
                                label="Description"
                                name="description"
                                value={state.description}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                type="number"
                                variant="outlined"
                                label="Bill"
                                name="bill"
                                value={state.bill}
                                onChange={handleChange}
                                className={classes.root}
                            />
                        </Grid>

                    </Grid>

                    <div className={classes.flexDiv}>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Save
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: `/type/list` })}
                        >
                            Cancel
                        </Button>

                    </div>

                </form>
            </div>
        </Container>
    )
}