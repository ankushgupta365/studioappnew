import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import styled from "styled-components"
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
   /* width: 40%; */
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
    background-color: ${props => props.disabled ? "#6C757D" : "#d90429"};
    color: white;
    cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
    padding: 15px 20px;
    border-radius: 6px;
    font-weight: bold;
    font-size: 14px;
    &:hover {
    transform: scale(0.96)
  }
`
const Text = styled.p`
   font-size: 14px;
   text-decoration: underline;
   cursor: pointer;
`
const Forget = () => {
  const [email, setEmail] = useState("")
  const [loading,setLoading] = useState(false)
  const navigate  = useNavigate()
  const handleChange = (e)=>{
    setEmail(e.target.value);
  }
  const handleEmailSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      await publicRequest.post("/auth/forget",{email})
      setEmail("")
      alert("Password reset link will be sent on to your email, if it is registered")
      navigate("/reset-password-protected",{state:{email: email}})
      setLoading(false)
    } catch (error) {
      console.log(error)
      setEmail("")
      alert("Email does not found in our Databse or may be there is some error, please try again later")
      setLoading(false)
    }
  }
  return (
    <Container>
      <Wrapper>
        <Title>Forget Password</Title>
        <Form className="d-flex flex-column">
          <Input placeholder="registered email" type="email" id="email" value={email} onChange={(e)=>handleChange(e)}/>
          <Agreement>
            You will get the password reset link on your email, if you already have a registered account
          </Agreement>
          <Button onClick={(e)=>handleEmailSubmit(e)} disabled={loading}>Send Reset Link</Button>
        </Form>
        <Link to="/login" style={{ textDecoration: "none", marginTop: "6px", display: "block" }} >
          <Text>Login</Text>
        </Link>
      </Wrapper>
    </Container>
  )
}

export default Forget