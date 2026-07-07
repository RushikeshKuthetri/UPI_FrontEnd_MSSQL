
const NextButton = ({ onClick, label = "Next Stage", disabled = false, }) => (
  <div>

    <button
      onClick={onClick}
      disabled={disabled}
      className={`
  border border-[var(--button-border)]
  bg-[var(--submit-button-bg)]
  text-[#111111] 
  text-[14px]
  font-medium
  px-3  py-1
  rounded-lg
  transition cursor-pointer
hover:bg-[var(--submit-button-hover-bg)]
`}

    >
      {label}
    </button>
  </div>

);

export default NextButton;
