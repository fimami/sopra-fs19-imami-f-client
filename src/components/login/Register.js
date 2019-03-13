import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27,124,186),rgb(2,46,101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Message = styled.label`
  color: white;
  margin-bottom: 5px;
  text-align: center;
`;

class Register extends React.Component{
    constructor(){
        super();
        this.state={
            password: null,
            username: null,
            alertText: ""
        };
    }

    register(){ //maybe function name must be changed cause of similarity to classname
        let currentDate = new Date().toUTCString();
        fetch(`${getDomain()}/users`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                date: currentDate   //or this.state.currentDate or sth...
            })
        })
            .then(response =>{
                if(response.status === 409 || response.status === 500){
                    this.setState({alertText: <h1>This username already exists!</h1>}) //does also catch when password is already used
                }else{
                    this.props.history.push(`/login`);
                }
            })
            .catch(err =>{
                if(err.message.match(/Failed to fetch/)){
                    alert("The server cannot be reached. Did you start it?");
                }else{
                    alert(`Something went wrong during the registration: ${err.message}`);
                }
            });
    }
    backToLogin(){
        this.props.history.push(`/login`);
    }
    handleInputChange(key, value){
        this.setState({[key]:value});
    }
    alertMessage(){
        return this.state.alertText
    }

    componentDidMount(){}

    render(){
        return(
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Message>{this.alertMessage()}</Message>
                        <Label>Username</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e=>{
                                this.handleInputChange("username", e.target.value);
                            }
                            }/>
                        <Label>Password</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e=>{
                                this.handleInputChange("password", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                disabled={!this.state.username || !this.state.password}
                                width="50%"
                                onClick={()=>{
                                    this.register();
                                }
                                }>
                                Register
                            </Button>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={()=>{
                                    this.backToLogin();
                                }}>
                                Back
                            </Button>
                        </ButtonContainer>

                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Register);