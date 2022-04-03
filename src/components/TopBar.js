import React from 'react';
import logo from '../assets/mylogo.png';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ProfileImageWithDefault from './ProfileImageWithDefault';

class TopBar extends React.Component {

    state = {
        dropDownVisibile: false
    };

    componentDidMount() {
        document.addEventListener('click', this.onClickTracker);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.onClickTracker);
    }

    onClickTracker = (event) => {
        if (this.actionArea && !this.actionArea.contains(event.target)) {
            this.setState({
                dropDownVisibile: false
            });
        }
    };

    onClickDisplayName = () => {
        if (this.state.dropDownVisibile) {
            this.setState({
                dropDownVisibile: false
            });
        } else {
            this.setState({
                dropDownVisibile: true
            });
        }
    };

    onClickLogout = () => {
        this.setState({
            dropDownVisibile: false
        });
        const action = {
            type: 'logout-success'
        }
        this.props.dispatch(action);
    };

    onClickMyProfile = () => {
        this.setState({
            dropDownVisibile: false
        });
    };

    assignActionArea = (area) => {
        this.actionArea = area;
    };

    render() {
        let links = (
            <ul className="nav navbar-nav ml-auto">
                <li className="nav-item">
                    <Link to="/signup" className="nav-link">
                        Sign Up
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
            </ul>
        );
        if (this.props.user.isLoggedIn) {
            let dropDownClass = 'p-0 shadow dropdown-menu';
            if (this.state.dropDownVisibile) {
                dropDownClass += ' show';
            }
            links = (
                <ul className="navbar-nav ms-auto mb-lg-0" ref={this.assignActionArea}>
                    <li className="nav-item dropdown">
                        <div className="d-flex" style={{ cursor: 'pointer' }} onClick={this.onClickDisplayName}>
                            <ProfileImageWithDefault
                                className="rounded-circle m-auto"
                                width="32" height="32"
                                image={this.props.user.image} />
                            <span className="nav-link dropdown-toggle">
                                {this.props.user.displayName}
                            </span>
                        </div>
                        <div className={dropDownClass} data-testid="drop-down-menu">
                            <Link to={`/${this.props.user.username}`} className="dropdown-item"
                                onClick={this.onClickMyProfile}>
                                <i className="fas fa-user text-info mx-2"></i>My Profile
                            </Link>
                            <span className="dropdown-item" onClick={this.onClickLogout} style={{
                                cursor: 'pointer'
                            }}>
                                <i className="fas fa-sign-out-alt text-danger mx-2"></i>Logout
                            </span>
                        </div>
                    </li>
                </ul>
            );
        }
        return (
            <div className="bg-white shadow-sm mb-2">
                <div className="container">
                    <nav className="navbar navbar-light navbar-expand">
                        <Link to="/" className="navbar-brand">
                            <img src={logo} width='60' alt="FitClub" /> FitClub
                        </Link>
                        {links}
                    </nav>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state
    }
}

export default connect(mapStateToProps)(TopBar);