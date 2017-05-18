import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'
import './index.css';

class NameForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleChange = this.handleChange.bind(this);
    this.formSubmitHandler = this.formSubmitHandler.bind(this);
  }

  formSubmitHandler(event) {
     event.preventDefault();
     <Redirect to={"/"+ this.state.value} />
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <div className="form-styles">
        <h2> Hello ! </h2>
        <form onSubmit={this.formSubmitHandler}>
            Bucket name <input name="buckName" size="60" onChange={this.handleChange}  value={this.state.value} />
            <Link to={"/scube/"+ this.state.value}> Go </Link>
        </form>
      </div>
    );
  }
}
// <input type="submit" value="Go !" />
export default NameForm;