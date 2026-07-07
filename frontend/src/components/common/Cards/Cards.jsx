import React from "react";

const Cards = ({ title, value, color, icon, bgShade, darkBg }) => {
  return (
    <div
      className="relative flex flex-col justify-center p-4 rounded-2xl 
                 shadow-md h-[110px] overflow-hidden w-full border-b-4
                 dark:bg-transparent"
      style={{ 
        backgroundColor: bgShade,
        borderBottomColor: color,
      }}
    >
      {/* Dark mode gradient overlay */}
      {darkBg && (
        <div
          className="absolute inset-0 hidden dark:block"
          style={{ background: darkBg }}
        />
      )}

      {/* Triangle */}
      <div
        className="absolute bottom-0 right-0 w-[80px] h-[50px] opacity-20 z-10"
        style={{
          backgroundColor: color,
          clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
        }}
      />

      {/* Top Row → Icon + Title */}
      <div className="relative z-10 flex items-center gap-2">
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <p className="text-sm font-medium text-[var(--card-text)]">{title}</p>
      </div>

      {/* Value */}
      <h2 className="relative z-10 text-[24px] md:text-xl font-bold text-[var(--card-text)] mt-1 ml-10">
        {value}
      </h2>
    </div>
  );
};

export default Cards;