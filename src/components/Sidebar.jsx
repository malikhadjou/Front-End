import {  Modal ,Menu, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import {
  TruckOutlined,
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  WarningOutlined,
  CarOutlined,
  EnvironmentOutlined,
  CalculatorOutlined,
  LogoutOutlined,
  IdcardOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

   const showLogoutConfirm = () => {
    Modal.confirm({
      title: "Déconnexion",
      content: "Voulez-vous vraiment vous déconnecter ?",
      cancelText: "Annuler",
      okText: "Oui",
      okType: "danger",
      onOk() {
        navigate("/");
      },
      centered: true,
    });
  };
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Dashboard</Link>,
    },
    {
      key: "/admin/clients",
      icon: <UserOutlined />,
      label: <Link to="/admin/clients">Clients</Link>,
    
    },
    {
      key: "/admin/expeditions",
      icon: <TruckOutlined />,
      label: <Link to="/admin/expeditions">Expéditions</Link>,
    },
    {
      key: "/admin/factures",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/factures">Factures</Link>,
      
    },
    {
      key: "/admin/paiements",
      icon: <CreditCardOutlined />,
      label: <Link to="/admin/paiements">Paiements</Link>,
      
    },
    {
      key: "/admin/reclamations",
      icon: <WarningOutlined />,
      label: <Link to="/admin/reclamations">Réclamations</Link>,
    },
      {
    key: "/admin/chauffeurs",
    icon: < IdcardOutlined />,
    label: <Link to="/admin/chauffeurs">Chauffeurs</Link>,
  },
  {
    key: "/admin/vehicules",
    icon: <CarOutlined />,
    label: <Link to="/admin/vehicules">Véhicules</Link>,
  },
    {
      key: "/admin/tournees",
      icon: <DeploymentUnitOutlined />,
      label: <Link to="/admin/tournees">Tournées</Link>,
    },
    {
      key: "/admin/destinations",
      icon: <EnvironmentOutlined />,
      label: <Link to="/admin/destinations">Destinations</Link>,
    },
    {
      key: "/admin/tarification",
      icon: <CalculatorOutlined />,
      label: <Link to="/admin/tarification">Tarification</Link>,
    },
  ];
  const logOutBtn = [ 
    {
       key: "/",
      icon: <LogoutOutlined/>,
       label: (
      <span onClick={showLogoutConfirm}>
        Se déconnecter
      </span>
    ),
    },
  ];

  return (
    <Sider
      width={"15vw"}
      style={{
        overflow: "auto",
        height: "100vh",
        position: "sticky",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 20,
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <img src="../../public/sahara-expres.png" alt="" style={{width : "30px", marginRight : "5px"}}/>
        <p>Sahara Express</p>
        
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ marginTop: 16 }}
        items={menuItems}
      />
      < Menu 
      theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ marginTop:"12vh"}}
        items={logOutBtn}/>
    </Sider>
  );
};

export default Sidebar;