import React from 'react';
import Auth from '../Auth/Auth';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Base.css'

// import './Base.css';
import { Link, withRouter } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav'
import { DropdownButton, Dropdown, NavDropdown } from 'react-bootstrap';



const Base = function ({ children, history }) {
    const categories = ["Colleges & Schools",
    "Enviormental",
    "World",
    "Entertainment",
    "Media",
    "Politics & Government",
    "Regional News",
    "Religion",
    "Sports",
    "Technology",
    "Traffic",
    "Weather",
    "Economic & Corp",
    "Advertisements",
    "Crime",
    "Magazine",
    "Other"]



    return (
        <div>

        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand>TapNews</Navbar.Brand>
                {Auth.isUserAuthenticated() ? (
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/personal">Profile</Nav.Link>
                        <Nav.Link href="/favorites">Likes</Nav.Link>
                        <Nav.Link href="/recommend">Recommend</Nav.Link>
                    </Nav>) : null
                }
                {Auth.isUserAuthenticated() ? (

                    <Nav className="me-auto">
                    <NavDropdown title="Category" id="basic-nav-dropdown" >
                        {categories.map((category)=>
                            <NavDropdown.Item key={category} href={"/categories/"+category}>{category}</NavDropdown.Item>
                        )}
                    </NavDropdown>
                    </Nav>

                ) : null
                }
                    
                    
                {Auth.isUserAuthenticated() ? (
                    <Nav>
                        <Navbar.Text>
                            Signed in as: {Auth.getEmail()}
                        </Navbar.Text>
                        <Nav.Link href="/login" onClick={() => {
                                       Auth.logout()
                                    }}>Log out</Nav.Link>
                    </Nav>) : (
                        <Nav>
                         <Nav.Link href="/login">Login</Nav.Link>
                         <Nav.Link href="/signup">Signup</Nav.Link>
                        </Nav>
                    )
                }
                
                
                {/* <DropdownButton id="dropdown-basic-button" title="categories">
                    {categories.map((category)=>
                        <Dropdown.Item key={category} href={"/categories/"+category}>{category}</Dropdown.Item>
                    )}
                </DropdownButton> */}
            
            </Container>
        </Navbar>

            {/* <nav className="nav-bar light-blue darken-4">
                <div className="nav-wrapper">

                    <Link to="/" className="brand-logo">&nbsp;&nbsp;News Feed</Link>

                    <ul id="nav-mobile" className="right">
                        {Auth.isUserAuthenticated() ?
                            (<div>
                                <li>{Auth.getEmail()}</li>
                                <li>

                                    <a href='/' onClick={() => {
                                        Auth.deauthenticateUser(() => this.props.history.push("/logout"));
                                    }}>Log out</a>
                                </li>

                            </div>)
                            :
                            (<div>
                                
                                <li><Link to="/login">Log in</Link></li>
                                <li><Link to="/signup">Sign up</Link></li>
                            </div>)
                        }
                    </ul>
                </div>
            </nav>
            <br /> */}
            {children}
        </div>
    )
}
// ????????????????????????
Base.propTypes = {
    children: PropTypes.object.isRequired
};
// export default Base;
export default withRouter(Base);
