// src/components/Navigation.js
//do not remove imports
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu } from 'antd';
import './Navigation.css';
//import menu item icons
import {
  HomeOutlined,
  UserOutlined,
  PlusOutlined,
  AppstoreOutlined,
  HeartOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  KeyOutlined
} from '@ant-design/icons';
import ForgotPassword from '../pages/ForgotPassword';


const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout button clicked'); //console for debug
    try {
      await logout();
      console.log('User logged out'); //console for debug
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
//do not remove menu items
  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h2>My Ad Site</h2>
      </div>
      <Menu mode="inline" theme="dark" className="navigation">
      <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
        Home
      </Menu.Item>
      <Menu.Item key="edit-profile" icon={<HomeOutlined />} onClick={() => navigate('/edit-profile')}>
        Edit Profile
      </Menu.Item>
        <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/userprofile')}>
        User Profile </Menu.Item>
      <Menu.Item key="post-ad" icon={<PlusOutlined />} onClick={() => navigate('/post-ad')}>
        Post Ad </Menu.Item>
      <Menu.Item key="ads" icon={<AppstoreOutlined />} onClick={() => navigate('/ads')}>
        Ads Page </Menu.Item>
      <Menu.Item key="favourites" icon={<HeartOutlined />} onClick={() => navigate('/favourites')}>
        Favourites </Menu.Item>
      {currentUser ? (
        <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
          Log Out </Menu.Item>
      ) : (
        <>
          <Menu.Item key="signup" icon={<UserAddOutlined />} onClick={() => navigate('/signup')}>
            Sign Up </Menu.Item>
          <Menu.Item key="login" icon={<LoginOutlined />} onClick={() => navigate('/login')}>
            Log In </Menu.Item>
        <Menu.Item key="/forgot-password" icon={<KeyOutlined />} onClick={() => navigate('/forgot-password')}>
          Forgot Password</Menu.Item>
        </>
      )}
      </Menu>
    </nav>
  );
};

export default Navigation;
