import React, { StatelessComponent } from 'react';

const Error: StatelessComponent = () => (
  <div className="error">
    <h1>
        An error has occured. Sorry fot the inconvinience!
        <a onClick={() => location.reload()} href="#">Refresh to try again.</a>
    </h1>
  </div>
);

export default Error;
