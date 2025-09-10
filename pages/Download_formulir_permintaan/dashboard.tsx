import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardDrive() {
  const router = useRouter();

  useEffect(() => {
    // Ganti history supaya "Back" nanti ke index
    router.replace("/");

    // Setelah itu arahkan ke Google Drive
    window.location.href =
      "https://drive.google.com/drive/folders/1eYz4IbnpU_Du3hVdmw7NPwOQF20DLnEZEPYU-IcfiKzKr0MM3Xn_Hlj_qZZPenX6w9SSUqEJ";
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg font-medium">Mengalihkan ke Google Drive...</p>
    </div>
  );
}
