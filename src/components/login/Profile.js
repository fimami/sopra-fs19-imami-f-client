import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";


const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Container = styled(BaseContainer)`
  color:white;
  text-align: center; 
`;

const TextField =styled.div`
  display: flex;
  justify-content: center;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Profile extends React.Component{
    constructor(){
        super();
        this.handleChange = this.handleChange.bind(this);
        this.handleBirthChange = this.handleBirthChange.bind(this);
        this.state = {
            username: null,
            password: null, //null value, but another option can be tried too
            onlineStatus: null,
            creationDate: null,
            birthDate: "N/A", //not available, so it can be possible to have no bday
            token: null,
            editMode: false,
            editButtonText: "Edit Profile", //button text to show here can the profile be changed
            oldUsername: null,
            oldBirthDate: null,
            editModeText: "Welcome to the Userpage"

        };
    }

    componentDidMount(){
        fetch(`${getDomain()}/users/${window.location.pathname.substr(window.location.pathname.lastIndexOf(`/`)+1)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response =>{
                if(response.status !== 404){
                    this.setState({
                        username: response.username,
                        onlineStatus: response.status,
                        creationDate: response.date,
                        birthDate: response.birthday, //birthday or birthDate.. is going to be clarified...
                        token: response.token,
                        oldUsername: response.username,
                        oldBirthDate: response.birthday
                    });
                }
            })
            .catch(err => {
                if(err.message.match(/Failed to fetch/)){
                    alert("The server cannot be reached. Did you start it?");
                } else{
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }
    goBackToUserlisting(){  // prepared but somehow still need to use this somewhere it says...
        this.props.history.push("/game/dashboard");
    }

    handleChange(event){
        this.setState({username: event.target.value})
    }

    handleBirthChange(event){
        this.setState({birthDate: event.target.value})
    }

    saveChanges(){
        fetch(`${getDomain()}/users/${window.location.pathname.substr(window.location.pathname.lastIndexOf(`/`)+1)}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: this.state.username,
                birthday: this.state.birthDate,
                token: this.state.token
            })
        })
            .then(response => response.json())
            .then(response =>{
                if(response.status === 409 || response.status === 500){
                    this.setState({
                        username: this.state.oldUsername,
                        birthDate: this.state.oldBirthDate
                    })
                    alert("Could not update Usersettings, Username already taken.")
                }
            })
            .catch(err=> {
                alert(`Something went wrong during the Update of credentials: ${err.message}`);
            })
    }

    getText(){
        if(this.state.editMode){
            return(
                <div>
                    <form>
                        <label>
                            Username:
                            <input type="text" value={this.state.username} onChange={this.handleChange}/>
                        </label>
                    </form>
                    <p>Password: {this.state.password} </p>
                    <p>Online Status: {this.state.onlineStatus} </p>
                    <form>
                        <label>
                            Birthday: (DD:MM:YYYY)
                            <input type="text" value={this.state.birthDate} onChange={this.handleBirthChange}/>
                        </label>
                    </form>
                    <p>Creation Date: {this.state.creationDate}</p>
                </div>
            )
        }

        return(
            <div>
                <p>Username: {this.state.username}</p>
                <p>Password: {this.state.password}</p>
                <p>Online Status: {this.state.onlineStatus}</p>
                <p>Birthday: {this.state.birthDate}</p>
                <p>Creation Date: {this.state.creationDate}</p>
            </div>
        )
    }

    render() {
        const textElement = this.getText();
        if (localStorage.getItem("token") === null) {
            return (<Container><h1>You must be logged in to view this page!</h1></Container>)
        } else {
            if (this.state.username === null) {
                return (<Container><h1>The Page of this User does not exist!</h1></Container>)
            }

            return (
                <Container>
                    <h1>{this.state.editModeText}</h1>
                    <PlayerContainer>
                        {textElement}
                        <div>
                            <ButtonContainer>
                                <Button
                                    width="50%"
                                    onClick={() => {
                                        this.goBackToUserlisting();
                                    }
                                    }
                                >
                                    Go Back
                                </Button>
                                <Button
                                    disabled={!(localStorage.getItem("token") === this.state.token) || !this.state.username}
                                    width="50%"
                                    onClick={() => {
                                        if (this.state.editMode) {
                                            this.saveChanges();
                                        }
                                        this.setState({
                                            editMode: !this.state.editMode,
                                            editButtonText: (!this.state.editMode) ? "Save" : "Edit Profile",
                                            editModeText: (!this.state.editMode) ? "Edit User Profile" : "Welcome to the Userpage"
                                        })
                                    }

                                    }
                                >
                                    {this.state.editButtonText}
                                </Button>
                            </ButtonContainer>
                        </div>
                    </PlayerContainer>
                </Container>
            );
        }
    }

}

export default withRouter(Profile);