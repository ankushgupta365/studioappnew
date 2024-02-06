import styled from "styled-components"
import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { message } from "antd"
import { useGoogleLogin } from "@react-oauth/google"
import { GoogleOutlined } from "@ant-design/icons"
import { publicRequest } from "../requestMethods"

const Container = styled.div`
    width: 100vw;
    height: 100vh;
    background: linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url("https://images.news18.com/ibnlive/uploads/2022/01/untitled-design-1-1-164371082616x9.jpg") center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Wrapper = styled.div`
   /* width: 25%; */
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 1px 9px -1px rgba(179,173,179,1);
    display: flex;
    flex-direction: column;
    justify-content: center;
`
const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
`
const Form = styled.form`
    display: flex;
    flex-direction: column;
`
const Input = styled.input`
    flex: 1;
    min-width: 40%;
    padding: 10px;
    margin: 10px 0;
`
const Button = styled.button`
    /* width: 40%; */
    border: none;
    background-color: ${props => props.disabled ? "#6C757D" : "#1F51FF"};
    color: white;
    cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
    padding: 15px 20px;
    margin-bottom: 10px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 14px;
    &:hover {
    background-color: #1F51FF;
    transform: scale(0.96)
  }
`
const Text = styled.p`
   font-size: 12px;
   text-decoration: underline;
   cursor: pointer;
   margin: 5px 0; 
`
const Error = styled.span`
    font-size: 12px;
    color: red;
`
const Image = styled.img`
width: 290px;
height: 100px;
align-self: center;
border-radius: 5px;
margin: 20px;
margin-bottom: 40px;
`
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const { loading, error, dispatch, user } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const checkAdmin = (data) => {
        if (data?.isAdmin) {
            return navigate("/")
        } else {
            // setEmail("")
            // setPassword("")
            message.info('Only admin have access here', 2.5)
        }
    }
    const handleLoginSimple = async (e) => {
        e.preventDefault()
        messageApi.destroy()
        messageApi.open({
            type: 'loading',
            content: "Action in progress...",
            duration: 0
        })
        dispatch({ type: "LOGIN_START" })
        try {
            const res = await publicRequest.post("/auth/login", { email, password })
            messageApi.destroy()
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data })
            checkAdmin(res.data)
        } catch (error) {
            messageApi.destroy()
            dispatch({ type: "LOGIN_FAILURE", payload: error.response.data })
            messageApi.open({
                type: 'error',
                content: `${error.response.data}`
            })
        }
    }
    const handleLogin = async (code) => {
        messageApi.destroy()
        messageApi.open({
            type: 'loading',
            content: 'Action in progress..',
            duration: 0,
        });
        dispatch({ type: "LOGIN_START" });
        try {
            const res = await publicRequest.post("/auth/google/login", { code: code });
            messageApi.destroy()
            console.log(res.data)
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
            checkAdmin(res.data)
        } catch (err) {
            messageApi.destroy()
            dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
            messageApi.open({
                type: 'error',
                content: 'wrong credentials',
            });
        }
    }
    const googleLogintwo = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: (res) => {
            handleLogin(res.code)
        },

        onError: (err) => {
            console.log(err)
        },
        scope: 'openid profile email https://www.googleapis.com/auth/calendar'
    })
    console.log(user)
    return (
        <Container>
            {contextHolder}
            <Wrapper>
                <Image src="https://res.cloudinary.com/dcmivyyxi/image/upload/v1705741494/file-upload/edenjka54704tjzecv16.png" />
                <Form>
                    <Input value={email} placeholder="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                    <Input value={password} placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={(e) => handleLoginSimple(e)} disabled={loading}>Login</Button>
                    <Link to='/forget' style={{ textDecoration: "none" }}>
                        <Text>
                            Forgot your password?
                        </Text>
                    </Link>
                    <Link to="/register" style={{ textDecoration: "none" }} >
                        <Text>Create an Account</Text>
                    </Link>
                </Form>
                {error && <Error>something went wrong...</Error>}
            </Wrapper>
        </Container>
    )
}

export default Login