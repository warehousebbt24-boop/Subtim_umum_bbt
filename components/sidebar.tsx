import Link from "next/link";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: "220px",
        background: "#222",
        color: "#fff",
        height: "100vh",
        padding: "20px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>
      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/admin/dashboard" style={{ color: "#fff" }}>
              Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: "10px" }}>
            <Link href="/admin/settings" style={{ color: "#fff" }}>
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
