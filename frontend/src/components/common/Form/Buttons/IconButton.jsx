import React from 'react'

const IconButton = ({ icon: Icon, tooltip, onClick }) => (
  <div className="relative group cursor-pointer" onClick={onClick}>
    <Icon
      size={17}
      strokeWidth={2.5}
      className="transition-opacity hover:opacity-70"
      style={{ color: 'var(--text-color)' }}
    />
    <div
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-1 py-0.5 rounded-md text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50"
      style={{ background: '#8A38F5' }}
    >
      {tooltip}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
        style={{ borderTopColor: '#8A38F5' }}
      />
    </div>
  </div>
)

export default IconButton