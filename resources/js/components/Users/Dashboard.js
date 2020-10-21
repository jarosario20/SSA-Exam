import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import SweetAlert from 'react-bootstrap-sweetalert';

class Dashboard extends Component {

    constructor() {
        super();
        this.state = {
            users: [],
            hideAlert: null,
            isTrashlist: false
        }
        
        this.handleActions = this.handleActions.bind(this);
        this.handleStateRefresh = this.handleStateRefresh.bind(this);
        this.handleTrashPage = this.handleTrashPage.bind(this);
    }

    componentDidMount() {
        axios.get('/api/users').then(response => {
            this.setState({
                users: response.data
            });
        }).catch(errors => {
            console.log(errors);
        })
    }

    handleActions(e) {
        let id = e.target.id;
        let url = '';
        let actionName = e.target.name;
        let method = '';

        switch(actionName) {
            case 'trash':
                url = '/api/users/trashed/' + id;
                method = 'PUT';
                break;
            case 'restore':
                url = '/api/users/restore/' + id;
                method = 'PUT';
                break;
            case 'delete':
                url = '/api/users/' + id;
                method = 'DELETE';
                break;
            default:
                url = '/api/users/trashed/' + id;
                method = 'PUT';
                break;
        }
        
        axios({
            method: method,
            url: url,
            data:this.state,
            config: { headers: {'Content-Type': 'multipart/form-data' }},
        }).then(response => {
            console.log(response.data);
            this.setState({
                hideAlert: (
                    <SweetAlert success title="Success!" onConfirm={this.handleStateRefresh} >
                        {response.data}
                    </SweetAlert>
                )
            });
        }).catch(function (error) {
            console.log(error);
        })
    }
    
    handleStateRefresh() {
        this.setState({
            users: [],
            hideAlert: null
        })
        this.componentDidMount();
    }

    handleTrashPage(e) {
        let url = '';
        if(e.target.id == 'trashed') {
            url = '/api/trashedlist';
            this.setState({
                isTrashlist: true
            });
        } else {
            url = 'api/users';
            this.setState({
                isTrashlist: false
            });
        }

        axios.get(url).then(response => {
            this.setState({
                users: response.data
            });
        }).catch(errors => {
            console.log(errors);
        })
    }

    render()  {
        const alert = this.state.hideAlert;
        return (
            <div className="container">
            {alert}
            <Link to="/users/create" className="btn btn-xs btn-success">Create New User</Link>
            {
                !this.state.isTrashlist ? 
                    <a className="btn btn-xs btn-warning float-right" id="trashed" onClick={this.handleTrashPage} >Show users in trash</a> :
                    <a className="btn btn-xs btn-primary float-right" id="allUsers" onClick={this.handleTrashPage} >Show All users</a>
            }
                <div className="row justify-content-center">
                    <div className="table-responsive">
                        <table id="accountsTable" className="table table-hover table-striped">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Prefix Name</th>
                                    <th>First Name</th>
                                    <th>Middle Name</th>
                                    <th>Last Name</th>
                                    <th>Suffix Name</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.users.map((user, i) => {
                                    let actions ;
                                    if(user.deleted_at) { 
                                        actions = <div>
                                                    <input type="button" className="btn btn-xs btn-primary" id={user.id} name="restore" onClick={this.handleActions} value="Restore" />
                                                    <input type="button" className="btn btn-xs btn-danger" id={user.id} name="delete" onClick={this.handleActions} value="Delete" />
                                                </div>;
                                    } else {
                                        actions = <div>
                                                    <Link to={'/users/show/' + user.id}   className="btn btn-xs btn-success">Show</Link>
                                                    <Link to={'/users/edit/' + user.id}   className="btn btn-xs btn-primary">Edit</Link>
                                                    <input type="button" className="btn btn-xs btn-warning" id={user.id} name="trash" onClick={this.handleActions} value="Trash" />
                                                </div>;
                                    }

                                    return [
                                        <tr key={i}>
                                            <td>{user.id}</td>
                                            <td>{user.prefixname}</td>
                                            <td>{user.firstname}</td>
                                            <td>{user.middlename}</td>
                                            <td>{user.lastname}</td>
                                            <td>{user.suffixname}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{actions}</td>
                                        </tr>
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Dashboard)