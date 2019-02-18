import React, { Component } from 'react';
import firebase from '../../firebase';
import { Link } from 'react-router-dom';

import { Grid, Form, Segment, Button, Icon, Message, Header } from 'semantic-ui-react';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false
  };

  handleSubmit = async event => {
    if (this.isFormValid(this.state)) {
      event.preventDefault();
      try {
        this.setState({ errors: [], loading: true });
        const signedInUser = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);
        console.log(signedInUser);
      } catch (error) {
        console.error(error);
        this.setState({ errors: this.state.errors.concat(error) });
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  isFormValid = ({ email, password }) => email && password;

  // functions below are used within render()
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  displayErrors = errors => {
    return errors.map((error, i) => <p key={i}>{error.message}</p>);
  };

  markInputsWithError = (inputName, errors) => {
    return errors.some(error => error.message.toLowerCase().includes(inputName)) ? 'error' : '';
  };

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" style={styles}>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h3" icon color="red" textAlign="center">
            <Icon name="terminal" color="red">
              {' '}
              Messenger
            </Icon>
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
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
              <Button color="red" fluid size="large" disabled={loading} loading={loading}>
                Login
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
            Don't have an account? <Link to="/register"> Register</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

const styles = {
  height: '90vh'
};

export default Login;
