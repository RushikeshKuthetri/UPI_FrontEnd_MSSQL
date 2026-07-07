import { useState, useRef, useEffect } from "react";
import { BiUser } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export default function Header() {
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);
  const helpButtonRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navigationItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Grade Change", path: "/grade-change" },
    { name: "Stoppages", path: "/stoppages" },
    { name: "Meter Reading", path: "/meter-reading" },
    { name: "Process Order Confirmation", path: "/process-order" },
    { name: "Stoppage Alert", path: "/stoppage-alert" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (helpButtonRef.current && !helpButtonRef.current.contains(event.target)) {
        setShowHelpPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleHelpItemClick = (path) => {
    navigate(path);
    setShowHelpPopup(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "100%",
        height: 56,
        background: "var(--bg-header)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        zIndex: 50,
      }}
      className="shadow-left-drawer-light"
    >
      {/* LEFT: Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img
            src="/adityabirlalogo.png"
            style={{ height: 50, width: 50 }}
            alt="logo"
          />
        </div>
        <h1
          style={{
            marginLeft: -8,
            fontSize: "clamp(14px, 2vw, 20px)",
            color: "var(--header-text-color, #29292B)",
            fontWeight: 500,
            fontFamily: "'Poppins', 'Inter', sans-serif",
            letterSpacing: "-0.02em",
            textAlign: "center",
            margin: 0,
          }}
        >
          UTCL Process Integrator
        </h1>
      </div>

      {/* RIGHT: Help + User + Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
        {/* Help icon */}
        <button
          ref={helpButtonRef}
          onClick={() => setShowHelpPopup(!showHelpPopup)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "2px solid #FFFFFF",
            background: "transparent",
            cursor: "pointer",
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700 }}>?</span>
        </button>

        {/* Help Popup */}
        {showHelpPopup && (
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 160,
              marginTop: 8,
              background: "var(--bg-color)",
              borderRadius: 8,
              zIndex: 50,
              minWidth: 190,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {navigationItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleHelpItemClick(item.path)}
                  onMouseEnter={() => setHoveredItemIndex(index)}
                  onMouseLeave={() => setHoveredItemIndex(null)}
                  style={{
                    width: "100%",
                    padding: "6px 8px",
                    textAlign: "left",
                    fontSize: 13,
                    transition: "background-color 0.15s, color 0.15s",
                    cursor: "pointer",
                    border: "none",
                    background:
                      hoveredItemIndex === index
                        ? "var(--bg-header-hover, #BCBCBC)"
                        : "transparent",
                    color: "var(--text-color)",
                    borderRadius:
                      index === 0
                        ? "8px 8px 0 0"
                        : index === navigationItems.length - 1
                        ? "0 0 8px 8px"
                        : "0",
                  }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Vertical divider */}
        <div
          style={{
            width: 1.5,
            height: 32,
            background: "var(--header-text-color, #29292B)",
            opacity: 0.6,
          }}
        />

        {/* Person icon + Welcome text */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "2px solid var(--header-text-color, #29292B)",
              background: "transparent",
              cursor: "pointer",
              transition: "opacity 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <BiUser size={18} style={{ color: "#000" }} />
          </button>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span
              style={{
                fontSize: 12,
                color: "var(--header-text-color, #29292B)",
                opacity: 0.8,
              }}
            >
              Welcome,
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--header-text-color, #29292B)",
              }}
            >
              {user?.username?.toUpperCase() || "User"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
