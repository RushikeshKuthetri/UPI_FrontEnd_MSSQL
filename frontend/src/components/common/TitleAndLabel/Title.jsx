import React from 'react'

const Title = ({ label }) => {
  return (
    <div>
      <h2 className="text-[18px] font-medium font-poppins text-[var(--title)] -ml-0.5">
        {label}
      </h2>
    </div>
  )
}

export default Title