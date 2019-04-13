import React, { StatelessComponent } from 'react';

const NotFound: StatelessComponent = () =>
    <div className="error">
        <h1>This page does not exist. Head to the <a href="/">main page</a>.</h1>
    </div>;

export default NotFound;
