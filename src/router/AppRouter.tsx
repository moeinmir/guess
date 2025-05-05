import { Routes, Route } from "react-router-dom";
import MainLayout from "layout/MainLayout";
import AdminDashboard from "components/admin/AdminDashboard";
import AddBetForm from "components/admin/AddBetForm";
import CloseBetForm from "components/admin/CloseBetForm";
import SettingForm from "components/admin/SettingForm";
import ContractBalanceManagement from "components/admin/ContractBalanceManagement";

const AppRoutes = () => {
  const subdomain = process.env.REACT_APP_SUBDOMAIN || "";

  const withSubdomain = (path: string) => {
    return subdomain ? `/${subdomain}${path}` : path;
  };

  return (
    <Routes>
      <Route path={withSubdomain("/")} element={<MainLayout />} />
      <Route path={withSubdomain("/admin")} element={<AdminDashboard />}>
        <Route path="add-bet" element={<AddBetForm />} />
        <Route path="close-bet" element={<CloseBetForm />} />
        <Route path="settings" element={<SettingForm />} />
        <Route
          path="contract-balance-management"
          element={<ContractBalanceManagement />}
        />
      </Route>

      <Route
        path={withSubdomain("/docs.pdf")}
        element={
          <div style={{ height: "100vh" }}>
             <iframe
            title="docpdf"
              src="/docs.pdf"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            /> 


            ssssssssssssssssssssss
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
