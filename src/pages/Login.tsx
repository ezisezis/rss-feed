import React, { Component } from 'react';
import { FormikActions } from 'formik';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import firebaseApp from '../firebase';
import AuthForm, { FormFields } from '../components/AuthForm';
import AuthModal from '../components/AuthModal';
import AuthHeader from '../components/Header';

interface LoginProps extends RouteComponentProps {
  authenticated: boolean;
};

type LoginState = {
  errorMessage: string;
};

class Login extends Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);

    this.state = {
      errorMessage: ''
    };
  }

  validateEmail = (email: string) => {
    if (!email) {
      return 'E-mail is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Invalid e-mail address';
    }

    return '';
  }

  validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password too short';
    }

    return '';
  }

  onLogin = async (
    values: FormFields,
    formActions: FormikActions<FormFields>
  ) => {
    try {
      formActions.setSubmitting(true);
      await firebaseApp
        .auth()
        .signInWithEmailAndPassword(values.email, values.password);
      this.props.history.push('/feed');
    } catch (error) {
      this.setState({
        errorMessage: error.message ? error.message : 'Unknown error'
      });
    } finally {
      formActions.setSubmitting(false);
    }
  };

  goToRegistration = () => this.props.history.push('/register');

  onModalClose = () =>
    this.setState({
      errorMessage: ''
    });

  render() {
    if (this.props.authenticated) {
      return <Redirect to="/feed" />;
    }

    return (
      <div className="auth">
        <AuthHeader />
        <AuthForm
          buttonLabel="Login"
          onSubmit={this.onLogin}
          onValidateEmail={this.validateEmail}
          onValidatePassword={this.validatePassword}
        />
        <AuthModal
          title="Error logging in!"
          body={this.state.errorMessage}
          show={!!this.state.errorMessage}
          onClose={this.onModalClose}
        />
        <div>
          Don't have an account yet?{' '}
          <a onClick={this.goToRegistration} className="auth__link">
            Register.
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
