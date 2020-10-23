import React, { Component } from 'react';

export default class Signin extends Component {

  render() {
    const { handleSignIn } = this.props;

    return (
      <div className="hello" id="section-1" style={{display:"flex",paddingTop:"0px",alignItems:"center",justifyContent:"center",flexDirection:"row"}}>
        {/* <h1 className="landing-heading"></h1>
        <p className="lead">
        TODO */}
          <button
            // className="btn btn-primary btn-lg"
            className="button"
            id="signin-button"
            style={{fontSize:"15px", color: "#fff", backgroundColor: "#270f34", border: "10px solid #270f34",alignItems:"center"}}
            onClick={ handleSignIn.bind(this) }
          >
            Sign in with Blockstack
          </button> 
        {/* </p> */}
      </div>
    );
  }
}
