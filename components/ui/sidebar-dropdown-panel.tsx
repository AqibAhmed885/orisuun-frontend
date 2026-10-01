import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  anchor: HTMLElement | null;
  visible: boolean;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const SidebarDropdownPanel: React.FC<Props> = ({
  anchor,
  visible,
  children,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0, maxHeight: 240 });

  useEffect(() => {
    if (!anchor || !visible) return;

    const rect = anchor.getBoundingClientRect();
    const panelWidth = 220;
    const estimatedHeight = 240;
    const gap = 16;

    let top = rect.top;
    let left = rect.right + gap;

    if (left + panelWidth > window.innerWidth) {
      left = rect.left - panelWidth - gap;
    }

    if (top + estimatedHeight > window.innerHeight - 8) {
      top = Math.max(8, window.innerHeight - estimatedHeight - 8);
    }

    const maxHeight = Math.max(
      160,
      Math.min(window.innerHeight - top - 8, Math.round(window.innerHeight * 0.6))
    );

    setPos({ top, left, maxHeight });
  }, [anchor, visible]);

  if (!visible || !anchor) return null;

  return createPortal(
    <div
      role="menu"
      style={{
        position: 'fixed',
        top: `${pos.top}px`,
        left: `${pos.left}px`,
        minWidth: '200px',
        maxHeight: `${pos.maxHeight}px`,
        zIndex: 99999,
      }}
      className="bg-white rounded border mt-2 border-gray-100 overflow-y-auto"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>,
    document.body
  );
};

export default SidebarDropdownPanel;
