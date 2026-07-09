import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import BreadCrumb from "./BreadCrumb";
import useAuthStore from "../../store/authStore";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        height: "100vh",
        display: "flex",
        width: "100%",
        flexDirection: "column",
        position: "fixed",
         overflow: "none", 
        background: "var(--bg-color)",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
         
          color: "var(--text-color)",
          marginTop: 0,
        }}
      >
        <Sidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <div
          className="main-content-area"
          style={{
            flex: 1,
            minHeight: 0,
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            marginLeft: collapsed ? 80 : 240,
          }}
        >
          {/* Breadcrumb */}
          <div className="my-0.5 mx-3"
            style={{
            
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <BreadCrumb />
          </div>

          {/* Page content */}
          <div className="flex-1 min-h-0 custom-scrollbar px-2 flex flex-col mb-3 bg-[var(--bg-main-container)] mx-2 rounded-2xl shadow-left-drawer-light dark:shadow-left-drawer-dark">
          <div
  className="flex-1 min-h-0 pt-2 pl-1 pb-2"
  style={{ overflowY: "none" }}
>
              <Outlet />
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Responsive: on mobile, remove margin-left */}
      <style>{`
        @media (max-width: 1023px) {
          .main-content-area {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
