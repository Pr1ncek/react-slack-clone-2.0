import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';

import {
  Grid,
  Form,
  Segment,
  Button,
  Icon,
  Message,
  Header
} from 'semantic-ui-react';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(createdUser => {
          console.log(createdUser);
          this.setState({ loading: false });
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: this.state.errors.concat(err),
            loading: false
          });
        });
    }
  };

  isFormValid = () => {
    let errors = [];
    if (this.isFormEmpty(this.state)) {
      this.setState({
        errors: errors.concat({ message: 'Fill in all fields!' })
      });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      this.setState({
        errors: errors.concat({
          message:
            'Password is invalid! Must be atleast six characters and Match'
        })
      });
      return false;
    }
    return true;
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    }
    return true;
  };

  displayErrors = errors => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>);
  };

  markInputsWithError = (inputName, errors) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName))
      ? 'error'
      : '';
  };

  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" style={styles}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h3" icon color="blue" textAlign="center">
            <Icon name="code" color="blue">
              {' '}
              Messenger
            </Icon>
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                type="text"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                value={username}
                onChange={this.handleChange}
              />
              <Form.Input
                fluid
                type="email"
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                value={email}
                onChange={this.handleChange}
                className={this.markInputsWithError('email', errors)}
              />
              <Form.Input
                fluid
                type="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                value={password}
                onChange={this.handleChange}
                className={this.markInputsWithError('password', errors)}
              />
              <Form.Input
                fluid
                type="password"
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={this.handleChange}
                className={this.markInputsWithError('password', errors)}
              />
              <Button
                color="blue"
                fluid
                size="large"
                disabled={loading}
                loading={loading}
              >
                Register
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>
            Already a user? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const styles = {
  height: '90vh'
};

export default Register;
