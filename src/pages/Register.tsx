import React, { Component } from 'react';
import { FormikActions } from 'formik';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import firebaseApp from '../firebase';
import AuthForm, { FormFields } from '../components/AuthForm';
import AuthModal from '../components/AuthModal';
import AuthHeader from '../components/Header';

interface RegisterProps extends RouteComponentProps {
  authenticated: boolean;
};

type RegisterState = {
  errorMessage: string;
};

class Register extends Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props);

    this.state = {
      errorMessage: ''
    };
  }

  onRegister = async (
    values: FormFields,
    formActions: FormikActions<FormFields>
  ) => {
    try {
      formActions.setSubmitting(true);
      await firebaseApp
        .auth()
        .createUserWithEmailAndPassword(values.email, values.password);
      this.props.history.push('/feed');
    } catch (error) {
      this.setState({
        errorMessage: error.message ? error.message : 'Unknown error'
      });
    } finally {
      formActions.setSubmitting(false);
    }
  };

  validateEmail = async (email: string) => {
    if (!email) {
      return 'E-mail is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'Invalid e-mail address';
    }

    // Onnce we have a valid email, we can start async validation
    try {
      const signInProviders = await firebaseApp.auth().fetchSignInMethodsForEmail(email);
      if (signInProviders.length !== 0) {
        return 'Email already in use';
      }
      return '';
    } catch (error) {
      // firebase error reporting what's wrong with the email
      // if it's another error, we dont display it to user
      if (error.message) {
        return error.message;
      }
      return '';
    }
  }

  validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password too short';
    }

    return '';
  }

  goToLogin = () => this.props.history.push('/login');

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
          buttonLabel="Register"
          onSubmit={this.onRegister}
          onValidateEmail={this.validateEmail}
          onValidatePassword={this.validatePassword}
        />
        <AuthModal
          title="Error registering!"
          body={this.state.errorMessage}
          show={!!this.state.errorMessage}
          onClose={this.onModalClose}
        />
        <div>
          Already registered?{' '}
          <a onClick={this.goToLogin} className="auth__link">
            Log in.
          </a>
        </div>
      </div>
    );
  }
}

export default withRouter(Register);
