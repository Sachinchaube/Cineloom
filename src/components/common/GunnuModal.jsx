import React from 'react';
import { X, Sparkles, User, Heart } from 'lucide-react';

export const GUNNU_MEMBERS = [
  {
    id: 'anshi',
    name: 'Anshi',
    role: 'Team Cineloom',
    image: '/gunnu/anshi.jpg',
    caption: 'Anshi'
  },
  {
    id: 'mehak',
    name: 'Mehak',
    role: 'Team Cineloom',
    image: '/gunnu/mehak.jpg',
    caption: 'Mehndak'
  },
  {
    id: 'sachin',
    name: 'Sachin',
    role: 'Team Cineloom',
    image: '/gunnu/sachin.jpg',
    caption: 'Paglu Idhar Kuch Nhi Hai'
  }
];

export function GunnuModal({ isOpen, onClose, selectedMember, onSelectMember }) {
  if (!isOpen || !selectedMember) return null;

  const current = GUNNU_MEMBERS.find(m => m.id === selectedMember.id) || GUNNU_MEMBERS[0];

  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-card anim-scale-up"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          padding: '0',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-medium)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Gunnu Special • {current.name}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        {/* Member Switcher Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 20px',
          background: 'var(--bg-tertiary)',
          borderBottom: '1px solid var(--border-light)'
        }}>
          {GUNNU_MEMBERS.map(member => {
            const isActive = member.id === current.id;
            return (
              <button
                key={member.id}
                onClick={() => onSelectMember(member)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
                  background: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <User size={13} />
                {member.name}
              </button>
            );
          })}
        </div>

        {/* Image Display Area */}
        <div style={{
          padding: '20px',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxHeight: '65vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)'
          }}>
            <img
              src={current.image}
              alt={current.name}
              style={{
                width: '100%',
                maxHeight: '62vh',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </div>

          <div style={{
            marginTop: '14px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {current.name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {current.caption}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
