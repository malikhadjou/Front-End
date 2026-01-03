import {
  Table,
  Button,
  Popconfirm,
  Space,
  Tag,
  Input,
  Card,
  Empty,
  Modal,
  Form,
  Select,
  message,
  Descriptions,
  Row,
  Col,
  Statistic,
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
import { ChauffeurContext } from "../../context/ChauffeurContext.jsx";

const Chauffeur = () => {
  const {
    chauffeurs,
    statistiques,
    fetchChauffeurs,
    ajouterChauffeur,
    changerStatutChauffeur,
    modifierChauffeur,
    supprimerChauffeur,
  } = useContext(ChauffeurContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchChauffeurs();
  }, [fetchChauffeurs]);

  const filteredChauffeurs = chauffeurs.filter(
    (ch) =>
      ch.codeChauffeur.toLowerCase().includes(searchText.toLowerCase()) ||
      ch.nom.toLowerCase().includes(searchText.toLowerCase()) ||
      ch.numeroPermis.toLowerCase().includes(searchText.toLowerCase())
  );

   const handleSupprimerChauffeur = async (id) => {
    try {
      await supprimerChauffeur(id);
      message.success("Chauffeur supprimé avec succès");
    } catch (error) {
      message.error("Une erreur s'est produite");
    }
  };
  

  const getStatutColor = (statut) => {
    switch (statut) {
      case "Disponible":
        return "green";
      case "En mission":
        return "blue";
      case "Indisponible":
        return "red";
      default:
        return "default";
    }
  };
    const getNextStatut = (statut) => {
    switch (statut) {
      case "Disponible":
        return "En mission";
      case "En mission":
        return "Indisponible";
      case "Indisponible":
        return "Disponible";
      default:
        return "Disponible";
    }
  };

  const columns = [
    { title: "Code", dataIndex: "codeChauffeur", width: 120 },
    { title: "Nom", dataIndex: "nom", width: 200 },
    { title: "N° Permis", dataIndex: "numeroPermis", width: 160 },
    { title: "Catégorie", dataIndex: "categoriePermis", width: 120 },
    {
      title: "Statut",
      dataIndex: "statut",
      width: 140,
      render: (s) => <Tag color={getStatutColor(s)}>{s}</Tag>,
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
              setSelectedChauffeur(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

         <Button
            type="link"
            icon={<SyncOutlined />}
            onClick={() => {
              const nextStatut = getNextStatut(record.statut);
              changerStatutChauffeur(record.id, nextStatut);
              message.success(`Statut changé vers ${nextStatut}`);
            }}
          >
            Changer statut
          </Button>

          <Popconfirm
            title="Êtes-vous sûr de vouloir supprimer ce chauffeur ?"
            description="Cette action est irréversible."
            onConfirm={() => handleSupprimerChauffeur(record.id)}
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

  const handleAjouterChauffeur = () => {
    setIsEditing(false);
    setSelectedChauffeur(null);
    form.resetFields();
    setModalVisible(true);
  };
    const handleModifierChauffeur = (chauffeur) => {
  setIsEditing(true);
  setSelectedChauffeur(chauffeur);
  form.setFieldsValue(chauffeur);
  setModalVisible(true);
};

 

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Chauffeurs">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>

         <Row gutter={16}>
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
                  value={statistiques.indisponibles}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Card>
            </Col>
          </Row>


          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher chauffeur"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 400 }}
            />
           <Button
  type="primary"
  icon={<PlusOutlined />}
  onClick={handleAjouterChauffeur}
>
  Ajouter chauffeur
</Button>

          </Space>

          <Table
            columns={columns}
            dataSource={filteredChauffeurs}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty /> }}
          />
        </Space>
      </Card>
<Modal
  open={modalVisible}
  title={isEditing ? "Modifier Chauffeur" : "Ajouter Chauffeur"}
  onCancel={() => {
    setModalVisible(false);
    form.resetFields();
  }}
  onOk={() => form.submit()}
  okText={isEditing ? "Modifier" : "Ajouter"}
>
  <Form
    layout="vertical"
    form={form}
    onFinish={async (values) => {
      if (isEditing) {
        await modifierChauffeur(selectedChauffeur.id, values);
        message.success("Chauffeur modifié");
      } else {
        await ajouterChauffeur(values);
        message.success("Chauffeur ajouté");
      }
      setModalVisible(false);
      form.resetFields();
    }}
  >
    <Form.Item name="nom" label="Nom" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="numeroPermis" label="N° Permis" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="categoriePermis" label="Catégorie" rules={[{ required: true }]}>
      <Select>
        <Select.Option value="B">B</Select.Option>
        <Select.Option value="C">C</Select.Option>
        <Select.Option value="CE">CE</Select.Option>
      </Select>
    </Form.Item>

    <Form.Item name="Telephone" label="Téléphone">
      <Input />
    </Form.Item>

    <Form.Item name="Email" label="Email">
      <Input />
    </Form.Item>
  </Form>
</Modal>


      {/* Détails */}
      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>
            Fermer
          </Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailsVisible(false);
              handleModifierChauffeur(selectedChauffeur);
            }}
          >
            Modifier
          </Button>,
        ]}
        title="Détails Chauffeur"
      >
        {selectedChauffeur && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Nom">{selectedChauffeur.nom}</Descriptions.Item>
            <Descriptions.Item label="Permis">{selectedChauffeur.numeroPermis}</Descriptions.Item>
            <Descriptions.Item label="Catégorie">{selectedChauffeur.categoriePermis}</Descriptions.Item>
            <Descriptions.Item label="Statut">{selectedChauffeur.statut}</Descriptions.Item>
            <Descriptions.Item label="Telephone">{selectedChauffeur.Telephone}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedChauffeur.Email}</Descriptions.Item>
            
          </Descriptions>
        )}
      </Modal>

      
      
    </div>
  );
};

export default Chauffeur;
