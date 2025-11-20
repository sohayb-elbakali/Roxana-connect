import React, { Fragment } from 'react'
const spinner = '/assets/spinner.gif';

const Spinner = () => (
    <Fragment>
        <img src={spinner} style={{width: '200px', margin: 'auto', display: 'block'}} alt="Loading..."></img>
    </Fragment>
)

export default Spinner
