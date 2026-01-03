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
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { DestinationContext } from "../../context/DestinationContext.jsx";

const { Option } = Select;

const Destination = () => {
  const {
    destinations,
    statistiques,
    fetchDestinations,
    ajouterDestination,
    modifierDestination,
    supprimerDestination,
  } = useContext(DestinationContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  const filteredDestinations = destinations.filter(
    (d) =>
      (d.codeDes || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.ville || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.pays || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (d.zoneGeo|| "").toLowerCase().includes(searchText.toLowerCase())
  );

  const getZoneColor = (zone) => {
    switch (zone) {
      case "Nord":
        return "blue";
      case "Sud":
        return "orange";
      case "Est":
        return "green";
      case "Ouest":
        return "purple";
      case "International":
        return "red";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Code",
      dataIndex: "codeDes",
      key: "codeDes",
      width: 150,
      fixed: "left",
    },
    {
      title: "Ville",
      dataIndex: "ville",
      width: 180,
    },
    {
      title: "Pays",
      dataIndex: "pays",
      width: 180,
    },
    {
      title: "Zone géographique",
      dataIndex: "zoneGeo",
      width: 180,
      render: (z) => <Tag color={getZoneColor(z)}>{z}</Tag>,
    },
    {
      title: "Actions",
      width: 240,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedDestination(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

          <Popconfirm
            title="Supprimer cette destination ?"
            onConfirm={() => supprimerDestination(record.id)}
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
    setSelectedDestination(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModifier = (destination) => {
    setIsEditing(true);
    setSelectedDestination(destination);
    form.setFieldsValue(destination);
    setModalVisible(true);
  };

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Destinations">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Stats */}
          <Row gutter={16} style={{ justifyContent: "center" }}>
            <Col span={4}><Card><Statistic title="Total" value={statistiques.total} /></Card></Col>
            <Col span={4}><Card><Statistic title="Nord" value={statistiques.nord} valueStyle={{ color: "#1890ff" }}  /></Card></Col>
            <Col span={4}><Card><Statistic title="Sud" value={statistiques.sud} valueStyle={{ color: "#ea580c" }} /></Card></Col>
            <Col span={4}><Card><Statistic title="Est" value={statistiques.est} valueStyle={{ color: "#52c41a" }} /></Card></Col>
            <Col span={4}><Card><Statistic title="Ouest" value={statistiques.ouest} valueStyle={{ color: "#531DAB" }} /></Card></Col>
            <Col span={4}><Card><Statistic title="International" value={statistiques.international} valueStyle={{ color: "#CF1322" }} /></Card></Col>
          </Row>

          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher destination"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 400 }}
            />

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAjouter}>
              Ajouter destination
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredDestinations}
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
        title={isEditing ? "Modifier Destination" : "Ajouter Destination"}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            if (isEditing) {
              await modifierDestination(selectedDestination.id, values);
              message.success("Destination modifiée");
            } else {
              await ajouterDestination(values);
              message.success("Destination ajoutée");
            }
            setModalVisible(false);
            form.resetFields();
          }}
        >
          <Form.Item name="ville" label="Ville" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="pays" label="Pays" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="zoneGeo" label="Zone géographique" rules={[{ required: true }]}>
            <Select placeholder="Sélectionner une zone">
              <Option value="Nord">Nord</Option>
              <Option value="Sud">Sud</Option>
              <Option value="Est">Est</Option>
              <Option value="Ouest">Ouest</Option>
              <Option value="International">International</Option>
            </Select>
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
              handleModifier(selectedDestination);
            }}
          >
            Modifier
          </Button>,
        ]}
        title="Détails Destination"
      >
        {selectedDestination && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Code">
              {selectedDestination.codeDes}
            </Descriptions.Item>
            <Descriptions.Item label="Ville">
              {selectedDestination.ville}
            </Descriptions.Item>
            <Descriptions.Item label="Pays">
              {selectedDestination.pays}
            </Descriptions.Item>
            <Descriptions.Item label="Zone géographique">
              {selectedDestination.zoneGeo}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Destination;
