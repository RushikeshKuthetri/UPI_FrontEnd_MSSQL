export default function Footer() {
  return (
    <footer
      style={{
       
        fontSize: 12,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
        padding: "0 8px",
        width: "100%",
        textAlign: "center",
        color: "var(--text-color)",
      }}
    >
      © {new Date().getFullYear()} All rights reserved. | UltraTech Cement
    </footer>
  );
}
