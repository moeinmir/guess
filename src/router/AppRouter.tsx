import { Routes, Route } from "react-router-dom";
import MainLayout from "layout/MainLayout";
import AdminDashboard from "components/admin/AdminDashboard";
import AddBetForm from "components/admin/AddBetForm";
import CloseBetForm from "components/admin/CloseBetForm";
import SettingForm from "components/admin/SettingForm";
import ContractBalanceManagement from "components/admin/ContractBalanceManagement";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={"/"} element={<MainLayout />} />
      <Route path={"/admin"} element={<AdminDashboard />}>
        <Route path="add-bet" element={<AddBetForm />} />
        <Route path="close-bet" element={<CloseBetForm />} />
        <Route path="settings" element={<SettingForm />} />
        <Route
          path="contract-balance-management"
          element={<ContractBalanceManagement />}
        />
      </Route>

      <Route
        path={"/docs.pdf"}
        element={
          <div style={{ height: "100vh" }}>
             <iframe
            title="docpdf"
              src="/docs.pdf"
              width="100%"
              height="100%"
              style={{ border: "none" }}
            /> 
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
