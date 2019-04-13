import React, { StatelessComponent, PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FormikState, FormikActions } from 'formik';

interface InnerFormProps extends FormikState<FormFields> {
  buttonLabel: string;
  onValidateEmail: (email: string) => string | Promise<string>;
  onValidatePassword: (password: string) => string;
}

export type FormFields = {
    email: string;
    password: string;
};

export type FormErrors = {
    email?: string;
    password?: string;
};
 
type AuthFormProps = {
    onValidateEmail: (email: string) => string | Promise<string>;
    onValidatePassword: (password: string) => string;
    onSubmit: (values: FormFields, formActions: FormikActions<FormFields>) => Promise<void>;
    buttonLabel: string;
}

const InnerForm: StatelessComponent<InnerFormProps> = ({
  onValidateEmail,
  onValidatePassword,
  buttonLabel,
  isSubmitting,
  errors
}) => (
  <Form className="auth__form">
    <Field type="email" name="email" placeholder="E-mail" validate={onValidateEmail} />
    <ErrorMessage name="email">{msg => <div className="auth__form__error">{msg}</div>}</ErrorMessage>
    <Field type="password" name="password" placeholder="Password" validate={onValidatePassword} />
    <ErrorMessage name="password">{msg => <div className="auth__form__error">{msg}</div>}</ErrorMessage>
    <Button
      type="submit"
      disabled={isSubmitting || (!!errors.email || !!errors.password)}
    >
      {buttonLabel}
    </Button>
  </Form>
);

class AuthForm extends PureComponent<AuthFormProps> {
    render() {
        const initialValues: FormFields = {
            email: '',
            password: ''
        };
        const {
            onValidateEmail,
            onValidatePassword,
            onSubmit,
            buttonLabel,
        } = this.props;

        return (<Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
          >
            {(formState: FormikState<FormFields>) => (
              <InnerForm
                {...formState}
                buttonLabel={buttonLabel}
                onValidateEmail={onValidateEmail}
                onValidatePassword={onValidatePassword} />
            )}
          </Formik>)
    }
}
export default AuthForm;
