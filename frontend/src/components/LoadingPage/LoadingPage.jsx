import React from 'react'
import './LoadingPage.css';

export default function LoadingPage() {

  return (
    <div className="loading-screen">
      <h1 className="loading-title">GET READY!</h1>
      <div className="spinner"></div>
      <p className="loading-subtext">waiting for players...</p>
    </div>
  )
}
