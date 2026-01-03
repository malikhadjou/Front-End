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
import { TarificationContext } from "../../context/TarificationContext.jsx";

const Tarification = () => {
  const {
    tarifications,
    statistiques,
    fetchTarifications,
    ajouterTarification,
    changerEtatTarification,
    modifierTarification,
    supprimerTarification,
  } = useContext(TarificationContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedTarif, setSelectedTarif] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTarifications();
  }, [fetchTarifications]);

  const filteredTarifications = tarifications.filter(
    (t) =>
      (t.codeTarif || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (t.typeService || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const getEtatColor = (etat) => {
    switch (etat) {
      case "Active":
        return "green";
      case "Suspendue":
        return "orange";
      case "Inactive":
        return "red";
      default:
        return "default";
    }
  };

  const getNextEtat = (etat) => {
    switch (etat) {
      case "Active":
        return "Suspendue";
      case "Suspendue":
        return "Inactive";
      case "Inactive":
        return "Active";
      default:
        return "Active";
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "codeTarif",
      width: 120,
      fixed: "left",
    },
    {
      title: "Type service",
      dataIndex: "typeService",
      width: 150,
    },
    {
      title: "Tarif base",
      dataIndex: "tarifBase",
      width: 130,
      render: (v) => `${v} DA`,
    },
    {
      title: "Tarif poids",
      dataIndex: "tarifPoids",
      width: 130,
      render: (v) => `${v} DA/kg`,
    },
    {
      title: "Tarif volume",
      dataIndex: "tarifVolume",
      width: 140,
      render: (v) => `${v} DA/m³`,
    },
    {
      title: "Destination ID",
      dataIndex: "destinationId",
      width: 140,
    },
    {
      title: "État",
      dataIndex: "etat",
      width: 120,
      render: (e) => <Tag color={getEtatColor(e)}>{e}</Tag>,
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
              setSelectedTarif(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

          <Button
            type="link"
            icon={<SyncOutlined />}
            onClick={() => {
              const next = getNextEtat(record.etat);
              changerEtatTarification(record.id, next);
              message.success(`État changé vers ${next}`);
            }}
          >
            Changer état
          </Button>

          <Popconfirm
            title="Supprimer cette tarification ?"
            onConfirm={() => supprimerTarification(record.id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Supprimer
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleAjouter = () => {
    setIsEditing(false);
    setSelectedTarif(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModifier = (tarif) => {
    setIsEditing(true);
    setSelectedTarif(tarif);
    form.setFieldsValue(tarif);
    setModalVisible(true);
  };

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Tarifications">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Stats */}
          <Row gutter={16} style={{ justifyContent: "center" }}>
            <Col span={6}>
              <Card>
                <Statistic title="Total" value={statistiques.total} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Actives" value={statistiques.actives} valueStyle={{ color: "#52c41a" }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Suspendues" value={statistiques.suspendues} valueStyle={{ color: "#fa8c16" }} />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic title="Inactives" value={statistiques.inactives} valueStyle={{ color: "#ff4d4f" }} />
              </Card>
            </Col>
          </Row>

          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher tarification"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 400 }}
            />

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAjouter}>
              Ajouter tarification
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredTarifications}
            rowKey="id"
            bordered
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: <Empty /> }}
          />
        </Space>
      </Card>

      {/* Modal Ajout / Modification */}
      <Modal
        open={modalVisible}
        title={isEditing ? "Modifier Tarification" : "Ajouter Tarification"}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            if (isEditing) {
              await modifierTarification(selectedTarif.id, values);
              message.success("Tarification modifiée");
            } else {
              await ajouterTarification(values);
              message.success("Tarification ajoutée");
            }
            setModalVisible(false);
            form.resetFields();
          }}
        >
          <Form.Item name="typeService" label="Type service" rules={[{ required: true }]}>
            <Select
              options={[
                { value: "Standard" },
                { value: "Express" },
                { value: "Économique" },
                { value: "International" },
              ]}
            />
          </Form.Item>

          <Form.Item name="tarifBase" label="Tarif base (DA)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="tarifPoids" label="Tarif poids (DA/kg)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="tarifVolume" label="Tarif volume (DA/m³)" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>

          <Form.Item name="destinationId" label="Destination ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Détails */}
      <Modal
        open={detailsVisible}
        onCancel={() => setDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailsVisible(false)}>Fermer</Button>,
          <Button
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setDetailsVisible(false);
              handleModifier(selectedTarif);
            }}
          >
            Modifier
          </Button>,
        ]}
        title="Détails Tarification"
      >
        {selectedTarif && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Code">{selectedTarif.codeTarif}</Descriptions.Item>
            <Descriptions.Item label="Type service">{selectedTarif.typeService}</Descriptions.Item>
            <Descriptions.Item label="Tarif base">{selectedTarif.tarifBase} DA</Descriptions.Item>
            <Descriptions.Item label="Tarif poids">{selectedTarif.tarifPoids} DA/kg</Descriptions.Item>
            <Descriptions.Item label="Tarif volume">{selectedTarif.tarifVolume} DA/m³</Descriptions.Item>
            <Descriptions.Item label="Destination ID">{selectedTarif.destinationId}</Descriptions.Item>
            <Descriptions.Item label="État">{selectedTarif.etat}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Tarification;
