import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { FaBars, FaTimes, FaExchangeAlt } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import { ImFilesEmpty } from "react-icons/im";
import useAuthStore from "../../store/authStore";
import {
  ChevronDown,
  ChevronRight,
  Moon,
  PanelLeftClose,
  PanelRightClose,
  Power,
  Sun,
  Gauge,
  PauseCircle,
  Bell,
  Wrench,
  Upload,
  BarChart3,
  Settings2,
  Undo2,
  ListChecks,
  Users,
} from "lucide-react";

// ── Menu items for this app ──────────────────────────────────────
const menuItems = [
  {
    name: "Dashboard",
    icon: MdOutlineDashboard,
    path: "/dashboard",
    hasDropdown: false,
  },
  {
    name: "Transaction",
    icon: FaExchangeAlt,
    path: "",
    hasDropdown: true,
    children: [
      { name: "Grade Change",          path: "/grade-change" },
      { name: "Stoppages Entry",             path: "/stoppages" },
     
      // { name: "Equipment Standby",     path: "/equipment-standby" },
      { name: "Meter Reading",         path: "/meter-reading" },
      { name: "Process Order Confirmation",         path: "/process-order",   },
       { name: "Stoppage Alert",        path: "/stoppage-alert" },
        // hasDropdown: true,
        // children: [
        //   { name: "PO Confirmation",   path: "/process-order" },
        //   { name: "PO Reversal",       path: "/process-order/reversal" },
        // ],
   
      // { name: "Process Parameter",     path: "/process-parameter" },
      { name: "Update PO BOM",           path: "/update-bom" },
      { name: "Enable Manual Upload",        path: "/manual-upload" },
    ],
  },
  {
    name: "Manage Admin",
    icon: IoSettingsOutline,
    path: "",
    hasDropdown: true,
    children: [
      { name: "Business Unit",       path: "/admin/business-unit" },
      { name: "Plant Details",       path: "/admin/plant-details" },
      { name: "Roles",               path: "/admin/roles" },
      { name: "Role Menu Mapping",   path: "/admin/role-menu-mapping" },
    ],
  },
  // {
  //   name: "Reports",
  //   icon: ImFilesEmpty,
  //   path: "/reports",
  //   hasDropdown: false,
  // },
  {
    name: "User Management",
    icon: FaRegUser,
    path: "/user-management",
    hasDropdown: false,
  },
];

// ── Tree connector dimensions ─────────────────────────────────────
const SPINE_X = 8;
const ITEM_H = 32;
const LINE_W = 1.5;
const RADIUS = 10;
const SVG_W = 20;

function TreeConnector({ lineColor, isLast }) {
  const midY = ITEM_H / 2;
  const curveStartY = midY - RADIUS;

  return (
    <svg
      width={SVG_W}
      height={ITEM_H}
      viewBox={`0 0 ${SVG_W} ${ITEM_H}`}
      style={{ flexShrink: 0 }}
      fill="none"
    >
      {isLast ? (
        <path
          d={`
            M ${SPINE_X} 0
            L ${SPINE_X} ${curveStartY}
            Q ${SPINE_X} ${midY} ${SPINE_X + RADIUS} ${midY}
            L ${SVG_W} ${midY}
          `}
          stroke={lineColor}
          strokeWidth={LINE_W}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <>
          <line
            x1={SPINE_X} y1={0}
            x2={SPINE_X} y2={ITEM_H}
            stroke={lineColor}
            strokeWidth={LINE_W}
            strokeLinecap="round"
          />
          <path
            d={`
              M ${SPINE_X} ${curveStartY}
              Q ${SPINE_X} ${midY} ${SPINE_X + RADIUS} ${midY}
              L ${SVG_W} ${midY}
            `}
            stroke={lineColor}
            strokeWidth={LINE_W}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

// ── Tooltip (shows on hover when sidebar is collapsed) ───────────
function Tooltip({ label, visible, anchorRef }) {
  if (!visible) return null;
  const rect = anchorRef?.current?.getBoundingClientRect();
  if (!rect) return null;

  const tooltipTop = (rect.top - 65) + window.scrollY + rect.height / 2;
  const tooltipLeft = rect.right + 10;

  return (
    <div
      style={{
        position: "fixed",
        left: tooltipLeft,
        top: tooltipTop,
        transform: "translateY(-50%)",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          background: "var(--bg-leftdrawer)",
          border: "1px solid var(--left-drawer-footer-border)",
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            padding: "8px 12px",
            fontSize: 14,
            fontWeight: 500,
            color: "var(--text-color)",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ── Main Sidebar Component ───────────────────────────────────────
export default function Sidebar({ open, setOpen, collapsed, setCollapsed }) {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(() => {
    try {
      const saved = localStorage.getItem("openDropdowns");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const itemRefs = useRef({});
  const menuContainerRef = useRef(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { logout } = useAuthStore();

  const handleLogout = () => {
    localStorage.clear();
    logout();
    navigate("/login");
  };

  const lineColor = theme === "dark" ? "#7E8383" : "#9FACAC";

  useEffect(() => {
    localStorage.setItem("openDropdowns", JSON.stringify(openDropdowns));
  }, [openDropdowns]);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isDropdownOpen = (key) => !!openDropdowns[key];

  const handleNavigation = (item) => {
    if (!item.path) return;
    navigate(item.path);
    if (setOpen) setOpen(false);
  };

  // ── Inline style helpers ──────────────────────────────────────
  const sidebarStyle = {
    position: "fixed",
    top: 72,
    left: 0,
    zIndex: 40,
    marginTop: 8,
    height: "calc(100dvh - 95px)",
    display: "flex",
    flexDirection: "column",
    borderRadius: "0 24px 24px 0",
    background: "var(--bg-leftdrawer)",
    transition: "all 0.3s ease",
    width: collapsed ? 80 : 240,
    overflow: collapsed ? "visible" : "hidden",
    transform: open ? "translateX(0)" : "translateX(-100%)",
  };

  const parentItemStyle = (isActive) => ({
    display: "flex",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    transition: "all 0.2s",
    gap: collapsed ? 0 : 16,
    justifyContent: collapsed ? "center" : "flex-start",
    background: isActive ? "var(--left-drawer-active-tab)" : "transparent",
    color: isActive ? "#000" : "var(--leftdrawer-text)",
    fontWeight: isActive ? 600 : 400,
    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
  });

  const childItemStyle = (isActive) => ({
    flex: 1,
    display: "flex",
    alignItems: "center",
    padding: "6px 8px",
    borderRadius: 8,
    transition: "all 0.2s",
    fontSize: 14,
    minWidth: 0,
    gap: 4,
    background: isActive ? "var(--left-drawer-active-tab)" : "transparent",
    color: isActive ? "#111111" : "var(--text-color)",
    fontWeight: isActive ? 600 : 400,
  });

  const footerStyle = {
    display: collapsed ? "flex" : "flex",
    flexDirection: collapsed ? "column" : "row",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-evenly",
    gap: collapsed ? 20 : 0,
    padding: "8px",
    borderRadius: 12,
    border: "1px solid var(--left-drawer-footer-border)",
    background: "var(--bg-leftdrawer-footer)",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    backdropFilter: "blur(8px)",
    transition: "all 0.3s",
  };

  return (
    <>
      {/* MOBILE HAMBURGER */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: "none",
            position: "fixed",
            top: 80,
            left: 16,
            zIndex: 50,
            padding: 8,
            borderRadius: 8,
            background: "var(--bg-leftdrawer)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            border: "none",
            cursor: "pointer",
          }}
          className="mobile-hamburger"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* BACKDROP (mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="mobile-backdrop"
          style={{
            display: "none",
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
            zIndex: 30,
          }}
        />
      )}

      {/* SIDEBAR */}
      <div
        style={sidebarStyle}
        className="sidebar-container shadow-left-drawer-light"
      >
        {/* MOBILE CLOSE */}
        <div className="mobile-close-btn" style={{ display: "none", justifyContent: "flex-end", paddingTop: 12, paddingRight: 12, marginBottom: -8 }}>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <FaTimes size={20} style={{ color: "var(--text-color)" }} />
          </button>
        </div>

        {/* MENU */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, marginTop: 8, minHeight: 0, padding: collapsed ? "0 4px" : "0 12px" }}>
          <div ref={menuContainerRef} style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const hasChildren = item.hasDropdown && item.children?.length > 0;
              const dropdownOpen = isDropdownOpen(item.name);
              const isActive = item.path && currentPath === item.path;

              return (
                <div key={index}>
                  {/* PARENT ITEM */}
                  <div style={{ position: "relative" }}>
                    <div
                      ref={(el) => (itemRefs.current[item.name] = el)}
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={parentItemStyle(isActive)}
                      onMouseOver={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "var(--left-drawer-active-tab)";
                          e.currentTarget.style.color = "#000";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "var(--leftdrawer-text)";
                        }
                      }}
                      onClick={() => {
                        if (hasChildren) {
                          if (collapsed) setCollapsed(false);
                          toggleDropdown(item.name);
                        } else {
                          handleNavigation(item);
                        }
                      }}
                    >
                      <Icon size={22} />
                      {!collapsed && (
                        <>
                          <span style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>{item.name}</span>
                          {hasChildren && (
                            <span style={{ fontSize: 12 }}>
                              {dropdownOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    <Tooltip
                      label={item.name}
                      visible={collapsed && hoveredItem === item.name}
                      anchorRef={{ current: itemRefs.current[item.name] }}
                    />
                  </div>

                  {/* LEVEL 1 CHILDREN */}
                  {hasChildren && dropdownOpen && !collapsed && (
                    <div style={{ marginLeft: 34, display: "flex", flexDirection: "column" }}>
                      {item.children.map((child, childIndex) => {
                        const hasNested = child.hasDropdown && child.children?.length > 0;
                        const nestedKey = `${item.name}_${child.name}`;
                        const nestedOpen = isDropdownOpen(nestedKey);
                        const isLast = childIndex === item.children.length - 1;
                        const isChildActive = currentPath === child.path;

                        return (
                          <div key={childIndex} style={{ display: "flex", flexDirection: "column" }}>
                            {/* CHILD ROW */}
                            <div
                              style={{ display: "flex", alignItems: "center", cursor: "pointer", height: ITEM_H }}
                              onClick={() => {
                                if (hasNested) toggleDropdown(nestedKey);
                                else handleNavigation(child);
                              }}
                            >
                              <TreeConnector lineColor={lineColor} isLast={isLast && !hasNested} />
                              <div
                                style={childItemStyle(isChildActive)}
                                onMouseOver={(e) => {
                                  if (!isChildActive) {
                                    e.currentTarget.style.background = "var(--left-drawer-active-tab)";
                                    e.currentTarget.style.color = "#111111";
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (!isChildActive) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--text-color)";
                                  }
                                }}
                              >
                                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{child.name}</span>
                                {hasNested && (
                                  <span style={{ marginLeft: "auto", flexShrink: 0 }}>
                                    {nestedOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* LEVEL 2 CHILDREN */}
                            {hasNested && nestedOpen && (
                              <div style={{ display: "flex", flexDirection: "column", position: "relative", marginLeft: SVG_W }}>
                                {!isLast && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      left: -SVG_W + SPINE_X,
                                      top: 0,
                                      bottom: 0,
                                      width: LINE_W,
                                      backgroundColor: lineColor,
                                    }}
                                  />
                                )}
                                {child.children.map((grandchild, gcIndex) => {
                                  const gcIsLast = gcIndex === child.children.length - 1;
                                  const isGrandchildActive = currentPath === grandchild.path;

                                  return (
                                    <div
                                      key={gcIndex}
                                      style={{ display: "flex", alignItems: "center", cursor: "pointer", height: ITEM_H }}
                                      onClick={() => handleNavigation(grandchild)}
                                    >
                                      <TreeConnector lineColor={lineColor} isLast={gcIsLast} />
                                      <div
                                        style={{
                                          flex: 1,
                                          padding: "6px 8px",
                                          borderRadius: 8,
                                          transition: "all 0.2s",
                                          fontSize: 14,
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          background: isGrandchildActive ? "var(--left-drawer-active-tab)" : "transparent",
                                          color: isGrandchildActive ? "#111111" : "var(--text-color)",
                                          fontWeight: isGrandchildActive ? 600 : 400,
                                        }}
                                        onMouseOver={(e) => {
                                          if (!isGrandchildActive) {
                                            e.currentTarget.style.background = "var(--left-drawer-active-tab)";
                                            e.currentTarget.style.color = "#111111";
                                          }
                                        }}
                                        onMouseOut={(e) => {
                                          if (!isGrandchildActive) {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = "var(--text-color)";
                                          }
                                        }}
                                      >
                                        {grandchild.name}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding: "0 12px 8px" }}>
          <div style={footerStyle}>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{ background: "none", border: "none", cursor: "pointer", outline: "none", padding: 4 }}
            >
              {theme === "dark" ? (
                <Sun size={20} style={{ color: "#facc15" }} />
              ) : (
                <Moon size={20} style={{ color: "var(--text-color)" }} />
              )}
            </button>

            {/* Collapse toggle (desktop only) */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{ background: "none", border: "none", cursor: "pointer", outline: "none", padding: 4, color: "var(--text-color)" }}
              className="collapse-btn"
            >
              {collapsed ? <PanelRightClose size={20} /> : <PanelLeftClose size={20} />}
            </button>

            {/* Power */}
            <button onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", outline: "none", padding: 4, color: "var(--text-color)" }}>
              <Power size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 1024px) {
          .sidebar-container {
            transform: translateX(0) !important;
          }
          .mobile-hamburger {
            display: none !important;
          }
          .mobile-backdrop {
            display: none !important;
          }
          .mobile-close-btn {
            display: none !important;
          }
        }
        @media (max-width: 1023px) {
          .sidebar-container {
            width: 240px !important;
          }
          .mobile-hamburger {
            display: block !important;
          }
          .mobile-backdrop {
            display: block !important;
          }
          .mobile-close-btn {
            display: flex !important;
          }
          .collapse-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
