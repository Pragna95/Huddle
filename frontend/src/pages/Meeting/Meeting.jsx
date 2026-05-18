import React from 'react';
import {
  Mic, MicOff, Video, VideoOff, Share, Hand, Users, MoreVertical,
  Copy, PhoneOff, Circle, LayoutGrid, FileText, Monitor
} from 'lucide-react';
import './Meeting.css';

const participants = [
  {
    id: 1,
    name: "Sharmila",
    avatar: "https://i.pravatar.cc/150?u=1",
    muted: true,
  },
  {
    id: 2,
    name: "Ajay",
    avatar: "https://i.pravatar.cc/150?u=2",
    muted: false,
  },
  {
    id: 3,
    name: "Sona",
    avatar: "https://i.pravatar.cc/150?u=3",
    muted: true,
  },
];

const Meeting = () => {
  return (
    <div className="meeting-page">
      {/* HEADER SECTION */}
      <header className="meeting-header">
        <div className="header-left">
          <div className="app-logo">
            <Monitor size={22} fill="currentColor" />
          </div>
          <div className="meeting-info">
            <h2 className="huddle-name">Huddle_Name</h2>
            <p className="current-date">Tuesday, 07-04-2026</p>
          </div>
          <button className="recording-btn">
            <Circle size={10} fill="#ef4444" color="#ef4444" />
            <span>Start Recording</span>
          </button>
        </div>

        <div className="header-right">
          <button className="leave-btn">
            <span>leave Huddle</span>
            <PhoneOff size={18} fill="white" />
          </button>
        </div>
      </header>

      {/* BODY SECTION */}
      <main className="meeting-body">
        <div className="main-video-container">
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1920"
            alt="Main Video"
            className="background-video"
          />

          {/* Top Right Participants Info */}
          <div className="participants-overlay">
            <div className="stat-badge">
              <img src="https://i.pravatar.cc/30?u=1" alt="" />
              <img src="https://i.pravatar.cc/30?u=2" alt="" />
              <span className="count-plus">+3</span>
            </div>
            <div className="stat-badge hand-badge">
              <span className="hand-emoji">✋ 12</span>
              <img src="https://i.pravatar.cc/30?u=3" alt="" />
              <img src="https://i.pravatar.cc/30?u=4" alt="" />
              <span className="count-plus highlight">+3</span>
            </div>
          </div>

          <h1 className="main-name">Sam</h1>

          {/* Bottom Right PIP */}
          <div className="pip-oval">
            <div className="avatar-wrap">
              <div className="avatar-circle">SM</div>
              <span className="pip-label">Sam</span>
            </div>
          </div>
        </div>
        {/* PARTICIPANTS SIDEBAR */}

        <div className="participants-sidebar">

          {participants.map((user) => (
            <div className="participant-card" key={user.id}>

              <img
                src={user.avatar}
                alt={user.name}
                className="participant-avatar"
              />

              <div className="participant-details">

                <h4>{user.name}</h4>

                {user.muted && (
                  <span className="mute-badge">
                    🔇
                  </span>
                )}

              </div>

            </div>
          ))}

        </div>
      </main>

      {/* FOOTER SECTION */}
      <footer className="meeting-footer">
        <div className="footer-left">
          <span className="id-label">Meet ID</span>
          <div className="id-badge">
            NFT-rdtve9
            <Copy size={14} className="copy-icon" />
          </div>
        </div>

        <div className="footer-center">
          <div className="control-bar">
            <div className="btn-pair">
              <button className="icon-btn muted"><MicOff size={18} /></button>
              <span className="arrow">▾</span>
            </div>
            <div className="btn-pair">
              <button className="icon-btn muted"><VideoOff size={18} /></button>
              <span className="arrow">▾</span>
            </div>
            <button className="icon-btn"><Share size={18} /></button>
            <div className="divider"></div>
            <button className="icon-btn"><Hand size={18} color="#f59e0b" /></button>
            <button className="icon-btn"><Users size={18} /></button>
            <button className="icon-btn"><MoreVertical size={18} /></button>
          </div>
        </div>

        <div className="footer-right">
          <button className="tool-btn"><FileText size={18} /></button>
          <button className="tool-btn"><LayoutGrid size={18} /></button>
        </div>
      </footer>
    </div>
  );
};

export default Meeting;
