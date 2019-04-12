import React, { StatelessComponent, PureComponent } from 'react';
import { Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FormikState, FormikActions } from 'formik';

interface InnerFormProps extends FormikState<FormFields> {
  buttonLabel: string;
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
    onValidate: (values: FormFields) => FormErrors;
    onSubmit: (values: FormFields, formActions: FormikActions<FormFields>) => Promise<void>;
    buttonLabel: string;
}

const InnerForm: StatelessComponent<InnerFormProps> = ({
  buttonLabel,
  isSubmitting,
  errors
}) => (
  <Form className="auth__form">
    <Field type="email" name="email" placeholder="E-mail" />
    <ErrorMessage name="email">{msg => <div className="auth__form__error">{msg}</div>}</ErrorMessage>
    <Field type="password" name="password" placeholder="Password" />
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
            onValidate,
            onSubmit,
            buttonLabel,
        } = this.props;

        return (<Formik
            initialValues={initialValues}
            validate={onValidate}
            onSubmit={onSubmit}
          >
            {(formState: FormikState<FormFields>) => (
              <InnerForm {...formState} buttonLabel={buttonLabel} />
            )}
          </Formik>)
    }
}
export default AuthForm;
