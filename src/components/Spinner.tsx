import React, { StatelessComponent } from 'react';
import { DotLoader } from 'react-spinners';

const Spinner: StatelessComponent = () => (
  <div className="spinner">
    <div className="spinner__dot">
      <DotLoader size={100} color={'#78C8C7'} />
    </div>
  </div>
);

export default Spinner;
