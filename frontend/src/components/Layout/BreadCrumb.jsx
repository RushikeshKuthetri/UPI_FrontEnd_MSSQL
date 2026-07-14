import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { ImFilesEmpty } from "react-icons/im";

import { MdAdminPanelSettings } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";

const ROUTE_MAP = {
  dashboard:          { label: "Dashboard",          icon: MdDashboard },
  "grade-change":     { label: "Grade Change" },
  stoppages:          { label: "Stoppages" },
  "stoppage-alert":   { label: "Stoppage Alert" },
  "equipment-standby":{ label: "Equipment Standby" },
  "meter-reading":    { label: "Meter Reading" },
  "process-order":    { label: "Process Order" },
  reversal:           { label: "PO Reversal" },
  "process-parameter":{ label: "Process Parameter" },
  "update-bom":       { label: "Update BOM" },
  "manual-upload":    { label: "Manual Upload" },
  reports:            { label: "Reports",            icon: ImFilesEmpty },
  "user-management":  { label: "User Management",   icon: FaRegUser },
  admin:              { label: "Manage Admin",      icon: IoSettingsOutline, unclickable: true },
  "business-unit":    { label: "Business Unit" },
  "plant-details":    { label: "Plant Details" },
  roles:              { label: "Roles" },
  "role-menu-mapping":{ label: "Role Menu Mapping" }
};

const TRANSACTION_PAGES = [
  "grade-change",
  "stoppages",
  "stoppage-alert",
  "equipment-standby",
  "meter-reading",
  "process-order",
  "reversal",
  "process-parameter",
  "update-bom",
  "manual-upload"
];

export default function BreadCrumb() {
  const location = useLocation();
  const navigate = useNavigate();
  const [pathname, setPathname] = useState(location.pathname);

  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [];

  if (segments.length > 0 && TRANSACTION_PAGES.includes(segments[0])) {
    crumbs.push({
      label: "Transaction",
      icon: FaExchangeAlt,
      unclickable: true,
      isLast: false,
    });
  }

  segments.forEach((seg, i) => {
    crumbs.push({
      ...(ROUTE_MAP[seg] || { label: seg, icon: null }),
      path: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
    });
  });

  return (
    <nav
      aria-label="breadcrumb"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
        fontSize: 14,
      }}
    >
      {crumbs.map((crumb, i) => {
        const Icon = crumb.icon;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {crumb.isLast ? (
              /* Current page — muted, not clickable */
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                  color: "var(--card-subtle, #776F6F)",
                }}
              >
                {Icon && <Icon size={14} />}
                {crumb.label}
              </span>
            ) : crumb.unclickable ? (
              /* Unclickable parent route */
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                  color: "var(--text-color)",
                }}
              >
                {Icon && <Icon size={14} />}
                {crumb.label}
                <span style={{ color: "var(--card-subtle, #776F6F)" }}>/</span>
              </span>
            ) : (
              /* Ancestor — clickable */
              <button
                onClick={() => navigate(crumb.path)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontWeight: 500,
                  color: "var(--text-color)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  fontSize: 14,
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = "var(--left-drawer-active-tab, #FD9F35)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = "var(--text-color)")
                }
              >
                {Icon && <Icon size={14} />}
                {crumb.label}
                <span style={{ color: "var(--card-subtle, #776F6F)" }}>/</span>
              </button>
            )}
          </div>
        );
      })}
    </nav>
  );
}
