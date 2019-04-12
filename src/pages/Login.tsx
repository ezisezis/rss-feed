import React, { Component } from 'react';
import { FormikActions } from 'formik';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import firebaseApp from '../firebase';
import AuthForm, { FormFields, FormErrors } from '../components/AuthForm';
import AuthModal from '../components/AuthModal';
import AuthHeader from '../components/AuthHeader';

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

  onValidate = (values: FormFields) => {
    let errors: FormErrors = {};
    if (!values.email) {
      errors.email = 'E-mail is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Invalid e-mail address';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password too short';
    }
    return errors;
  };

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
          onValidate={this.onValidate} />
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
