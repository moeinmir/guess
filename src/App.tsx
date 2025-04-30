import { Buffer } from "buffer";
import CustomHeader from "layout/CustomHeader";
import AppRoutes from "router/AppRouter";
import { UserProvider } from "./contexts/UserContext";
import { BetsProvider } from "contexts/BetsContext";
import { ERC20Provider } from "contexts/ERC20TokenRepresentingUSDTContext";
import { AdminProvider } from "contexts/AdminContext";
import { BrowserRouter } from "react-router-dom";
// import Footer from "layout/CustomFooter";

function App() {
  if (!window.Buffer) window.Buffer = Buffer;
  return (
    <BrowserRouter>
      <UserProvider>
        <ERC20Provider>
          <BetsProvider>
            <AdminProvider>
                <CustomHeader />
                  <AppRoutes />
                {/* <Footer /> */}
            </AdminProvider>
          </BetsProvider>
        </ERC20Provider>
      </UserProvider>
    </BrowserRouter>
  );
}
export default App;
