
import { useWeb3React } from "@web3-react/core";
import { useUser } from "contexts/UserContext";
import LandingPage from "pages/LandingPage";
const MainLayout: React.FC = () =>{
    
    const {account} = useWeb3React()
    const {isRegistered} = useUser()
    if (!account){
        return<div>Connect Your Wallet</div>
    }
    if(!isRegistered){
        return<>
        Register
        </>
    }
    return<>
    <LandingPage/>
    </>
}

export default MainLayout;

