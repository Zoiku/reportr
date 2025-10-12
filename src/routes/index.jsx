import Home from "@/pages/home";
import NotFound from "@/pages/system/not-found";
import Unauthorized from "@/pages/system/unauthorized";
import AppLayout from "@/layouts/app";
import SystemLayout from "@/layouts/system";
import { Routes, Route } from "react-router-dom";
import ReportDetail from "@/pages/report-detail";
import ProtectedRoutes from "@/routes/protected";
import Forbidden from "@/pages/system/forbidden";
import Auth from "@/pages/auth";

export default function IndexRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/report/status/:id" element={<ReportDetail />} />
        </Route>
      </Route>
      
      <Route element={<SystemLayout />}>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
