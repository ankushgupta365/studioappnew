import { useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
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
  const location = useLocation()
  const [isValidToken, setIsValidToken] = useState(false);
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
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
      setError("")
      setLoading(true)
      const res = await publicRequest.post("/auth/verify/reset", { email: location.state.email, resetToken: otp })
      if (res.data.verified === true) {
        setIsValidToken(true)
        setLoading(false)
      }
    } catch (error) {
      setError("Otp does not match")
      setLoading(false)
    }
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value)
  }


  const SubmitPassword = async (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      setLoading(true)
      const res = await publicRequest.post("/auth/reset", { password: password, email: location.state.email })
      setLoading(false)
      // After successfully changing the password, redirect the user
      navigate("/login")
    } else {
      alert("Confirm password does not match")
      setLoading(false)
    }
  };

  const resendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await publicRequest.post("/auth/forget", { email: location.state.email })
      alert("OTP succesffully sent")
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <Container>
      <Wrapper>
        {!isValidToken ? (
          <div className="d-flex flex-column justify-content-center align-items-center">
            <label className="m-1">Enter OTP:</label>
            <input type="text" value={otp} onChange={handleOtpChange} className="w-50" />
            <button onClick={verifyToken} className="btn btn-primary mt-3    w-50">Verify OTP</button>
            {error != "" ? <span className="text-danger">*{error}</span> : null}
            <button onClick={resendOtp} className="btn btn-link">Resend OTP</button>
          </div>
        ) : <>
          <Title>Create New Password</Title>
          <span className="text-danger">*Do not refresh the page, before changing the password</span>
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
        </>
        }
      </Wrapper>
    </Container>
  )
}

export default ResetPassword