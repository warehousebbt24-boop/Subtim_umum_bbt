export default function Topbar() {
  return (
    <header
      style={{
        background: "#444",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1>Dashboard</h1>
      <div>Admin</div>
    </header>
  );
}
