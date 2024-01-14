import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import { publicRequest } from "../requestMethods"
import { useEffect } from "react"

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
   width: 40%;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0px 1px 9px -1px rgba(179,173,179,1);
`
const Title = styled.h1`
    font-size: 24px;
    font-weight: 300;
`
const Form = styled.form`
    display: flex;
    flex-wrap: wrap;
`
const Input = styled.input`
    flex: 1;
    min-width: 40%;
    padding: 10px;
    margin: 20px 10px 0px 0px;
`
const Agreement = styled.span`
    font-size: 12px;
    margin: 10px 0px;
`
const Button = styled.button`
    width: 40%;
    border: none;
    background-color: #d90429;
    color: white;
    cursor: pointer;
    padding: 15px 20px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 14px;
    &:hover {
    background-color: #ef233c;
    transform: scale(0.96)
  }
`
const Text = styled.p`
   font-size: 14px;
   text-decoration: underline;
   cursor: pointer;
`
const ResetPassword = () => {
  const { email, token } = useParams();
  const [isValidToken, setIsValidToken] = useState(false);
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate()

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value)
  }

  const verifyToken = async () => {
    try {
      setLoading(true)
      console.log(email, token)
      const res = await publicRequest.post("/auth/verify/reset", { email: email, resetToken: token })
      if (res.data.verified === true) {
        setIsValidToken(true)
        setLoading(false)
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Send a request to the server to validate the token
    // Use the 'token' variable from the params
    // Set isValidToken based on the server response
    verifyToken()
  }, [token, email]);

  const SubmitPassword = async (e) => {
    // Send a request to the server to update the password
    // Use the 'token' variable from the params and 'newPassword' state
    // You might want to include error handling here
    e.preventDefault()
    if (password === confirmPassword) {
      setLoading(true)
      const res = await publicRequest.post("/auth/reset", { password: password, email: email })
      setLoading(false)
      // After successfully changing the password, redirect the user
      navigate("/login")
    } else {
      console.log("confirm does not match")
      alert("Confirm password does not match")
      setLoading(false)
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isValidToken) {
    return <div>Token not verified</div>
  }
  return (
    <Container>
      <Wrapper>
        <Title>Create New Password</Title>
        <Form>
          <Input placeholder="new password" type="password" id="password" value={password} onChange={(e) => handlePasswordChange(e)} />
          <Input placeholder="confirm new password" type="password" id="confirmpassword" value={confirmPassword} onChange={(e) => handleConfirmPasswordChange(e)} />
          <Agreement>
            After succesfully changing password you will be routed to the login page.
          </Agreement>
          <Button onClick={(e) => SubmitPassword(e)} type="submit">Update Password</Button>
        </Form>
        <Link to="/login" style={{ textDecoration: "none", marginTop: "6px", display: "block" }} >
          <Text>Login</Text>
        </Link>
      </Wrapper>
    </Container>
  )
}

export default ResetPassword