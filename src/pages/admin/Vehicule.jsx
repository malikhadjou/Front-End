import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Card,
  Empty,
  Modal,
  Form,
  Select,
  InputNumber,
  message,
  Descriptions,
  Row,
  Col,
  Statistic,
  Popconfirm
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  SyncOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { VehiculeContext } from "../../context/VehiculeContext.jsx";

const Vehicules = () => {
  const {
    vehicules,
    statistiques,
    fetchVehicules,
    ajouterVehicule,
    changerEtatVehicule,
    modifierVehicule,
    supprimerVehicule,
  } = useContext(VehiculeContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajouterVisible, setAjouterVisible] = useState(false);
  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVehicules();
  }, [fetchVehicules]);

  const filteredVehicules = vehicules.filter(
    (v) =>
      v.matricule.toLowerCase().includes(searchText.toLowerCase()) ||
      v.typeVehicule.toLowerCase().includes(searchText.toLowerCase())
  );
 const handleSupprimerVehicule = async (id) => {
    try {
      await supprimerVehicule(id);
      message.success("Véhicule supprimée avec succès");
    } catch (error) {
      message.error("Une erreur s'est produite");
    }
  };
  const getEtatColor = (etat) => {
    switch (etat) {
      case "Disponible":
        return "green";
      case "En mission":
        return "blue";
      case "En maintenance":
        return "orange";
      default:
        return "default";
    }
  };
   const getNextEtat = (etat) => {
    switch (etat) {
      case "Disponible":
        return "En mission";
      case "En mission":
        return "En maintenance";
      case "En maintenance":
        return "Disponible";
      default:
        return "Disponible";
    }
  };

  const columns = [
    { title: "Matricule", dataIndex: "matricule", width: 140 },
    { title: "Type", dataIndex: "typeVehicule", width: 180 },
    {
      title: "Capacité poids",
      dataIndex: "capacitePoids",
      render: (v) => `${v} kg`,
    },
    {
      title: "Capacité volume",
      dataIndex: "capaciteVolume",
      render: (v) => `${v}  m³`,
    },
    {
      title: "État",
      dataIndex: "etat",
      render: (etat) => <Tag color={getEtatColor(etat)}>{etat}</Tag>,
    },
    {
      title: "Actions",
      width: 260,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedVehicule(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

         <Button
            type="link"
            icon={<SyncOutlined />}
            onClick={() => {
              const nextEtat = getNextEtat(record.etat);
              changerEtatVehicule(record.id, nextEtat);
              message.success(`état changé vers ${nextEtat}`);
            }}
          >
            Changer état
          </Button>

          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer cette véhicule ?"
            description="Cette action est irréversible."
            onConfirm={() => handleSupprimerVehicule(record.id)}
            okText="Oui"
            cancelText="Non"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];


  const handleAjouterVehicule = () => {
    setIsEditing(false);
    setSelectedVehicule(null);
    form.resetFields();
    setModalVisible(true);
  };
    const handleModifierVehicule = (Vehicule) => {
  setIsEditing(true);
  setSelectedVehicule(Vehicule);
  form.setFieldsValue(Vehicule);
  setModalVisible(true);
};

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Véhicules" bordered={false}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          
          {/*  Statistiques */}
         <Row gutter={16} >
            <Col span={6}>
              <Card>
                <Statistic title="Total" value={statistiques.total} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Disponible"
                  value={statistiques.disponibles}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="En mission"
                  value={statistiques.enMission}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Indisponible"
                  value={statistiques.enMaintenance}
                  valueStyle={{ color: "#ea580c" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Recherche + action */}
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher par matricule ou type"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 420 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAjouterVehicule}
            >
              Ajouter véhicule
            </Button>
          </Space>

          {/*  Tableau */}
          <Table
            columns={columns}
            dataSource={filteredVehicules}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty description="Aucun véhicule enregistré" />
              ),
            }}
          />
        </Space>
      </Card>

      {/*  Ajouter véhicule */}
      <Modal
  open={modalVisible}
  title={isEditing ? "Modifier vehicule" : "Ajouter vehicule"}
  onCancel={() => {
    setModalVisible(false);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  okText={isEditing ? "Modifier" : "Ajouter"}
>
        <Form layout="vertical"
        form={form}
        onFinish={async (values) => {
         if (isEditing) {
        await modifierVehicule(selectedVehicule.id, values);
        message.success("Vehicule modifié");
      } else {
        await ajouterVehicule(values);
        message.success("Vehicule ajouté");
      }
      setModalVisible(false);
      form.resetFields();
    }}>
          <Form.Item
            name="matricule"
            label="Matricule"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="typeVehicule"
            label="Type de véhicule"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Camion">Camion</Select.Option>
              <Select.Option value="Fourgon">Fourgon</Select.Option>
              <Select.Option value="Pickup">Pickup</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="capacitePoids"
            label="Capacité poids (kg)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="capaciteVolume"
            label="Capacité volume (m³)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>

      {/*  Détails */}
      <Modal
        open={detailsVisible}
        title={`Véhicule ${selectedVehicule?.matricule}`}
        footer={[<Button key="close" onClick={() => setDetailsVisible(false)}>
            Fermer
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailsVisible(false);
              handleModifierVehicule(selectedVehicule);
            }}
          >
            Modifier
          </Button>,]}
        onCancel={() => setDetailsVisible(false)}
      >
        {selectedVehicule && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Type">
              {selectedVehicule.typeVehicule}
            </Descriptions.Item>
            <Descriptions.Item label="Capacité poids">
              {selectedVehicule.capacitePoids} 
            </Descriptions.Item>
            <Descriptions.Item label="Capacité volume">
              {selectedVehicule.capaciteVolume} 
            </Descriptions.Item>
            <Descriptions.Item label="État">
              <Tag color={getEtatColor(selectedVehicule.etat)}>
                {selectedVehicule.etat}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/*  Ajouter véhicule */}
      <Modal
        open={ajouterVisible}
        title="Ajouter un véhicule"
        onCancel={() => setAjouterVisible(false)}
        onOk={() => form.submit()}
        okText="Enregistrer"
      >
        <Form layout="vertical" form={form} onFinish={handleAjouterVehicule}>
          <Form.Item
            name="matricule"
            label="Matricule"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="typeVehicule"
            label="Type de véhicule"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Camion">Camion</Select.Option>
              <Select.Option value="Fourgon">Fourgon</Select.Option>
              <Select.Option value="Pickup">Pickup</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="capacitePoids"
            label="Capacité poids (kg)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            name="capaciteVolume"
            label="Capacité volume (m³)"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vehicules;
