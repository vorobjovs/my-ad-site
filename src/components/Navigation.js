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

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: 'Home', onClick: () => navigate('/') },
    { key: 'edit-profile', icon: <HomeOutlined />, label: 'Edit Profile', onClick: () => navigate('/edit-profile') },
    { key: 'profile', icon: <UserOutlined />, label: 'User Profile', onClick: () => navigate('/userprofile') },
    { key: 'post-ad', icon: <PlusOutlined />, label: 'Post Ad', onClick: () => navigate('/post-ad') },
    { key: 'ads', icon: <AppstoreOutlined />, label: 'Ads Page', onClick: () => navigate('/ads') },
    { key: 'favourites', icon: <HeartOutlined />, label: 'Favourites', onClick: () => navigate('/favourites') },
    ...currentUser ? [
      { key: 'logout', icon: <LogoutOutlined />, label: 'Log Out', onClick: handleLogout }
     ] : [
      
      { key: 'signup', icon: <UserAddOutlined />, label: 'Sign Up', onClick: () => navigate('/signup') },
      { key: 'login', icon: <LoginOutlined />, label: 'Log In', onClick: () => navigate('/login') },
      { key: 'forgot-password', icon: <KeyOutlined />, label: 'Forgot Password', onClick: () => navigate('/forgot-password') }
     ]
  ];

  return (
    <nav className="navigation">
      <div className="navigation-header">
        <h2>My Ad Site</h2>
      </div>
      <Menu mode="inline" theme="dark" className="navigation" items={menuItems} />
    </nav>
  );
};

export default Navigation;
