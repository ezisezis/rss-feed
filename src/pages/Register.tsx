import React, { Component } from 'react';
import { FormikActions } from 'formik';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import firebaseApp from '../firebase';
import AuthForm, { FormFields, FormErrors } from '../components/AuthForm';
import AuthModal from '../components/AuthModal';
import AuthHeader from '../components/AuthHeader';

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
          onValidate={this.onValidate} />
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
