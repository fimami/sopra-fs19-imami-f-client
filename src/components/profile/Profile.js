import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";


const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
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
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
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

/*const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;
*/
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/*const Message = styled.label`
  color:white;
  margin-bottom: 5px;
  text-align: center;
`
*/
/*const Margin = styled.div`
    margin-top: 2em;
`;
*/

const PlayerContainer = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class Profile extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleBirthChange = this.handleBirthChange.bind(this);
        this.state = {
            username: null,
            password: "********",
            onlineStatus: null,
            creationDate: null,
            birthDate: null,
            token: null,
            editMode: false,
            editButtonText:"edit Profile",
            oldUsername:null,
            oldBirthDate: null,
            editModeText: "User-Information"
        };
    }
    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end and its token is stored in the localStorage.
     */
    saveChanges() {
        fetch(`${getDomain()}/users/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`, {
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
            .then(response => {
                if(response.status !== 409 || response.status === 500){
                    this.setState({
                        username: this.state.oldUsername,
                        birthDate: this.state.oldBirthDate
                    });
                    alert("Could not update, Username is already taken.")
                }
            })
            .catch(err => {
                alert(`Something went wrong during the login: ${err.message}`);

            });     //maybe syntax error
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleUsernameChange(event){
        this.setState({username: event.target.value})
    }

    handleBirthChange(event){
        this.setState({birthDate: event.target.value})
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */

    componentDidMount() {
        fetch(`${getDomain()}/users/${window.location.pathname.substr(window.location.pathname.lastIndexOf('/') + 1)}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(response => {
                if(response.status !== 404){
                    this.setState({
                        username: response.username,
                        onlineStatus: response.status,
                        creationDate: response.date,
                        birthDate: response.birthday,
                        token: response.token,
                        oldUsername: response.username,
                        oldBirthDate: response.birthday
                    });
                }
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the login: ${err.message}`);
                }
            });
    }

    getText(){
        if(this.state.editMode){
            return(
                <div>
                    <form>
                        <label> Username: &nbsp; </label>
                        <InputField type="text" value={this.state.username} onChange={this.handleUsernameChange}/>
                    </form>
                    <p>Password: ********</p>
                    <p>Online Status: {this.state.onlineStatus}</p>
                    <form>
                        <label> Birth Date: &nbsp; </label>
                        <InputField type="date" value={this.state.birthDate} onChange={this.handleBirthChange}/>

                    </form>
                    <p>Creation Date: {this.state.creationDate}</p>
                </div>
            )
        }
        return(
            <div>
                <p>Username: {this.state.username}</p>
                <p>Password: *******</p>
                <p>Status: {this.state.onlineStatus}</p>
                <p>Birth Date: {this.state.birthDate}</p>
                <p>Creation Date: {this.state.creationDate}</p>
            </div>
        )
    }

    render() {
        const textElement = this.getText();
        if(localStorage.getItem("token")===null){return(<Container><h1>You must be logged in to see this page!</h1></Container>)}
        else{
            if(this.state.username === null){
                return(<Container><h1>User does not exist!</h1></Container>)
            }
            return (
                <BaseContainer>
                    <Container>
                        <Form>
                            <h1>{this.state.editModeText}</h1>
                            <PlayerContainer>
                                {textElement}
                                <div>
                                    <ButtonContainer>
                                        <Button
                                            disabled={!(localStorage.getItem("token")===this.state.token) || !this.state.username}
                                            width="100%"
                                            onClick={() => {
                                                if(this.state.editMode){
                                                    //save changes to database
                                                    this.saveChanges();
                                                }
                                                this.setState({
                                                    editMode: !this.state.editMode,
                                                    editButtonText: (!this.state.editMode)?"Save":"Edit Profile",
                                                    editModeText: (!this.state.editMode)?"Edit User Profile":"User-Information"
                                                })
                                            }}
                                        >
                                            {this.state.editButtonText}
                                        </Button>
                                    </ButtonContainer>
                                    <ButtonContainer>
                                        <Button
                                            width="100%"
                                            onClick={() => {
                                                this.props.history.push("/game/dashboard");
                                            }}
                                        >
                                            Back
                                        </Button>
                                    </ButtonContainer>
                                </div>
                            </PlayerContainer>
                        </Form>
                    </Container>
                </BaseContainer>
            );
        }
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Profile);