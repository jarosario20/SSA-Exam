import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

class Forms extends Component {

    constructor() {
        super();
        this.state = {
            prefixname: '',
            firstname: '',
            middlename: '',
            lastname: '',
            suffixname: '',
            username: '',
            email: '',
            password: '',
            type: '',
            photo: null,
            formTitle: '',
            isReadOnly: false,
            hideAlert: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleOnFileChange = this.handleOnFileChange.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleRedirection = this.handleRedirection.bind(this);
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        const location = this.props.location.pathname;
        if(location != '/users/create') {
            axios.get('/api/users/' + id).then(response => {
                let formTitle = 'Edit User Details of ' + response.data.username;
                let isReadOnly = false;
                let photo = null;
                if(location.includes('show')) {
                    formTitle = 'User Details of ' + response.data.username;
                    isReadOnly = true;
                    photo = response.data.photo;
                }

                this.setState({
                    prefixname: response.data.prefixname,
                    firstname: response.data.firstname,
                    middlename: response.data.middlename,
                    lastname: response.data.lastname,
                    suffixname: response.data.suffixname,
                    username: response.data.username,
                    email: response.data.email,
                    password: response.data.password,
                    type: response.data.type,
                    photo: photo,
                    formTitle: formTitle,
                    isReadOnly: isReadOnly,
                    hideAlert: null
                });
            }).catch(errors => {
                console.log(errors);
            })
        }
    }

    handleOnSubmit(e) {
        e.preventDefault();
        const id = this.props.match.params.id;
        const location = this.props.location.pathname;
        let data  = new FormData(e.target);

        let url = e.target.action;
        if(location != '/users/create') {
            url = url + '/' + id;
        }

        axios({
            method: 'POST',
            url: url,
            data: data,
            config: { headers: {'Content-Type': 'multipart/form-data'}},
        }).then(response => {
            this.setState({
                hideAlert: (
                    <SweetAlert success title="Success!" onConfirm={this.handleRedirection} >
                        {response.data}
                    </SweetAlert>
                )
            });
        }).catch(function (error) {
            $("input").removeClass('is-invalid');
            $(".invalid-feedback").remove();
            let validation_errors = error.response.data.errors;
            let fieldNames =Object.keys(validation_errors);

            fieldNames.forEach( fieldName => {
                $("input[name="+fieldName+"]").addClass('is-invalid')
                $("input[name="+fieldName+"]").after($(`<div class='invalid-feedback'>${validation_errors[fieldName]}</div>`))
                $("input[name="+fieldName+"]").focus()
            });
        })
    }

    handleRedirection() {
        this.setState({
            hideAlert: null
        })
        return this.props.history.push('/users');
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    
    handleOnFileChange(e) {
        this.setState({
            photo: e.target.files[0]
        });
    }

    render()  {
        const alert = this.state.hideAlert;
        return (
            <div className="container">
                {alert}
                <div className="row justify-content-center">
                    <h2>{ this.state.formTitle }</h2>
                    <form action="/api/users" onSubmit={this.handleOnSubmit}>
                        {this.props.location.pathname.includes('edit') ? (<input type="hidden" name="_method" value="PUT"></input>) : '' }
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="prefixname">Prefix Name: </label>
                                        <input type="text" className="form-control" name="prefixname" id="prefixname" placeholder="Enter Prefix" value={this.state.prefixname} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="firstname">First Name: <code>*</code></label>
                                        <input type="text" className="form-control" name="firstname" id="firstname" placeholder="Enter First Name" value={this.state.firstname} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="middlename">Middle Name: </label>
                                        <input type="text" className="form-control" name="middlename" id="middlename" placeholder="Enter Middle Name" value={this.state.middlename} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="lastname">Last Name: <code>*</code></label>
                                        <input type="text" className="form-control" name="lastname" id="lastname" placeholder="Enter Last Name" value={this.state.lastname} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="suffixname">Suffix Name: </label>
                                        <input type="text" className="form-control" name="suffixname" id="suffixname" placeholder="Enter Suffix Name" value={this.state.suffixname} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="username">User Name: <code>*</code></label>
                                        <input type="text" className="form-control" name="username" id="username" placeholder="Enter User Name" value={this.state.username} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="email">Email address: <code>*</code></label>
                                        <input type="text" className="form-control" name="email" id="email" placeholder="Enter Email address" value={this.state.email} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="password">Password: <code>*</code></label>
                                        <input type="password" className="form-control" name="password" id="password" placeholder="Enter Password" value={this.state.password} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="type">Type: </label>
                                        <input type="text" className="form-control" name="type" id="type" placeholder="Enter Type" value={this.state.type} onChange={this.handleChange} readOnly={ this.state.isReadOnly } />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label htmlFor="photo">Photo: </label>
                                        {this.state.isReadOnly ? 
                                        <input type="text" className="form-control" name="photo" id="photo" value={this.state.photo} readOnly={ this.state.isReadOnly } /> 
                                        :
                                        <input type="file" className="form-control" name="photo" id="photo"  onChange={this.handleOnFileChange}  /> }
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="form-group">
                            {this.state.isReadOnly ? '' : (<button type="submit" className="btn btn-primary">Save</button>) }
                            <Link to="/users" className="btn btn-danger" >Back</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Forms)