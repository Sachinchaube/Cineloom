import React, { useState } from 'react';
import { User } from 'lucide-react';
import { GunnuModal, GUNNU_MEMBERS } from './GunnuModal';

export function GunnuButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(GUNNU_MEMBERS[0]);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setModalOpen(true);
    setMenuOpen(false);
  };

  return (
    <>
      <div className="gunnu-static-wrapper">
        <div className="gunnu-btn-container">
          {/* Popover Menu (Opens upwards) */}
          {menuOpen && (
            <div className="gunnu-floating-menu anim-scale-up" onMouseLeave={() => setMenuOpen(false)}>
              <div style={{
                padding: '8px 12px',
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontWeight: 700,
                borderBottom: '1px solid var(--border-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Select Member
              </div>
              {GUNNU_MEMBERS.map(member => (
                <button
                  key={member.id}
                  type="button"
                  className="gunnu-menu-item"
                  onClick={() => handleSelectMember(member)}
                >
                  <User size={14} color="var(--accent-gold)" />
                  <span>{member.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trigger Button: Text Only */}
          <button
            type="button"
            className="gunnu-corner-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            title="Gunnu"
            aria-label="Gunnu"
          >
            Gunnu
          </button>
        </div>
      </div>

      {/* Gunnu Photo Viewer Modal */}
      <GunnuModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedMember={selectedMember}
        onSelectMember={setSelectedMember}
      />
    </>
  );
}
