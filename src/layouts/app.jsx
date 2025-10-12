import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="@container/main flex justify-center">
      <main className="relative w-full md:w-2xl min-h-screen border-x">
        <Outlet />
      </main>
    </div>
  );
}
