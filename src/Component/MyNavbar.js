import React, { Component, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";

import axios from "axios";
import { connect } from "react-redux";
import { GoogleLogin } from "react-google-login";
import config from "../config.json";

import "antd/dist/antd.css";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const { SubMenu } = Menu;

class MyNavbar extends Component {
  constructor() {
    super();
    this.handleClick1 = this.handleClick1.bind(this);
    this.handleClick2 = this.handleClick2.bind(this);
    this.handleClick3 = this.handleClick3.bind(this);
    this.googleResponse = this.googleResponse.bind(this);
    this.onFailure = this.onFailure.bind(this);
    this.logout = this.logout.bind(this);
  }

  onFailure() {}

  logout() {
    //empty the token
    localStorage.setItem("token", "");
    console.log("logout");
    this.props.logout();
  }

  componentDidUpdate() {
    console.log("nav ", this.props.isAuthenticated);
  }

  googleResponse(response) {
    console.log(response); //id_token

    axios
      .post(`https://frozen-atoll-01566.herokuapp.com/login`, {
        code: response.tokenId,
      })
      .then((res) => {
        console.log(res);
        let token = res.data.token;
        let profile = res.data.user;
        localStorage.setItem("token", token);
        this.props.setToken(token);
        this.props.loginSuccess();
        console.log(token);
        console.log(profile);
      });
  }

  handleClick1() {
    this.props.history.push("/");
  }
  handleClick2() {
    this.props.resetMode();
    this.props.history.push("/problems");
  }
  handleClick3() {
    this.props.history.push("/about");
  }

  render() {
    let loginB = null;
    let logoutB = null;
    if (!this.props.isAuthenticated) {
      loginB = (
        <GoogleLogin
          render={(renderProps) => (
            <Nav.Link
              onClick={renderProps.onClick}
              style={{ color: "white", marginRight: "50px" }}
            >
              Login
            </Nav.Link>
          )}
          clientId={config.GOOGLE_CLIENT_ID}
          buttonText="Login"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          style={{
            padding: 0,
            margin: 0,
          }}
        />
      );
    } else {
      logoutB = (
        <Menu
          style={{ width: 150 }}
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
        >
          <SubMenu key="sub4" icon={<SettingOutlined />} title="66Bro">
            <Menu.Item>Setting</Menu.Item>
            <Menu.Item onClick={this.logout}>Logout</Menu.Item>
          </SubMenu>
        </Menu>
      );
    }

    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Nav className="mr-auto">
            <Nav.Link onClick={this.handleClick1}>Home</Nav.Link>
            <Nav.Link onClick={this.handleClick2}>Problems</Nav.Link>
            <Nav.Link onClick={this.handleClick3}>About Us</Nav.Link>
          </Nav>
          {loginB}
          {logoutB}
        </Navbar>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetMode: () => dispatch({ type: "reset" }),
    loginSuccess: () => dispatch({ type: "login" }),
    setToken: (token) => dispatch({ type: "setToken", val: token }),
    logout: () => dispatch({ type: "logout" }),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MyNavbar));
