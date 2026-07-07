const BackButton = ({ onClick, label = "Back" , disable = false , px = 2}) => (
   <button
      onClick={onClick}
      disabled={disable}
     className={`border border-[var(--button-border)] 
           bg-[var(--back-button-bg)] 
           text-[14px]
           px-3  py-1 rounded-lg
           
           transition cursor-pointer
           hover:bg-[var(--button-hover-bg)]`}
    >
      {label}
    </button>
);

export default BackButton;
