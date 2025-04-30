import { Routes, Route } from "react-router-dom";
import MainLayout from "layout/MainLayout";
import AdminDashboard from "components/admin/AdminDashboard";
import AddBetForm from "components/admin/AddBetForm";
import CloseBetForm from "components/admin/CloseBetForm";
import SettingForm from "components/admin/SettingForm";

const AppRoutes = () => {
  const subdomain = process.env.REACT_APP_SUBDOMAIN || '';
  
  const withSubdomain = (path: string) => {
    return subdomain ? `/${subdomain}${path}` : path;
  };

  return (
    <Routes>
      <Route path={withSubdomain("/")} element={<MainLayout />} />
      <Route path={withSubdomain("/admin")} element={<AdminDashboard />}>
        <Route path="add-bet" element={<AddBetForm />}/>
        <Route path="close-bet" element={<CloseBetForm />} />
        <Route path="settings" element={<SettingForm />}/>
      </Route>
    </Routes>
  );
};

export default AppRoutes;