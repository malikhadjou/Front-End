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
  DatePicker,
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
import { TourneeContext } from "../../context/TourneeContext.jsx";
import dayjs from "dayjs";

const Tournee = () => {
  const {
    tournees,
    statistiques,
    fetchTournees,
    ajouterTournee,
    changerStatutTournee,
    modifierTournee,
    supprimerTournee,
  } = useContext(TourneeContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedTournee, setSelectedTournee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchTournees();
  }, [fetchTournees]);

const filteredTournees = tournees.filter(
  (t) =>
    (t.codeTournee || "").toLowerCase().includes(searchText.toLowerCase()) ||
    t.chauffeurId?.toString().includes(searchText) ||
    t.vehiculeId?.toString().includes(searchText)
);


  const getStatutColor = (statut) => {
    switch (statut) {
      case "Planifiée":
        return "blue";
      case "En cours":
        return "orange";
      case "Terminée":
        return "green";
      default:
        return "default";
    }
  };

  const getNextStatut = (statut) => {
    switch (statut) {
      case "Planifiée":
        return "En cours";
      case "En cours":
        return "Terminée";
      case "Terminée":
        return "Planifiée";
      default:
        return "Planifiée";
    }
  };

  const columns = [
    {
      title: "Code",
    dataIndex: "codeTournee",
    key: "codeTournee",
    width: 120,
    fixed: "left",
  },
  {
    title: "Date",
    dataIndex: "dateTournee",
    render: (d) => dayjs(d).format("DD/MM/YYYY"),
    width: 140,
  },
  {
    title: "Chauffeur ID",
    dataIndex: "chauffeurId",
    width: 140,
  },
  {
    title: "Véhicule ID",
    dataIndex: "vehiculeId",
    width: 140,
  },
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
              setSelectedTournee(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

          <Button
            type="link"
            icon={<SyncOutlined />}
            onClick={() => {
              const next = getNextStatut(record.statut);
              changerStatutTournee(record.id, next);
              message.success(`Statut changé vers ${next}`);
            }}
          >
            Changer statut
          </Button>

          <Popconfirm
            title="Supprimer cette tournée ?"
            onConfirm={() => supprimerTournee(record.id)}
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
    setSelectedTournee(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleModifier = (tournee) => {
    setIsEditing(true);
    setSelectedTournee(tournee);
    form.setFieldsValue({
      ...tournee,
      dateTournee: dayjs(tournee.dateTournee),
    });
    setModalVisible(true);
  };

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Tournées">
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          {/* Stats */}
          <Row gutter={16}  style={{justifyContent : "center"}}>
            <Col span={4}>
              <Card><Statistic title="Total" value={statistiques.total}   /></Card>
            </Col>
            <Col span={4}>
              <Card><Statistic title="aujourdHui" value={statistiques.aujourdHui}   /></Card>
            </Col>
            <Col span={4}>
              <Card><Statistic title="Planifiées" value={statistiques.Planifiée}valueStyle={{ color: "#1890ff" }} /></Card>
            </Col>
            <Col span={4}>
              <Card><Statistic title="En cours" value={statistiques.Encours}valueStyle={{ color: "#ea580c" }} /></Card>
            </Col>
            <Col span={4}>
              <Card><Statistic title="Terminées" value={statistiques.Terminées} valueStyle={{ color: "#52c41a" }} /></Card>
            </Col>
          </Row>

          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher tournée"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 400 }}
            />

            <Button type="primary" icon={<PlusOutlined />} onClick={handleAjouter}>
              Ajouter tournée
            </Button>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredTournees}
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
        title={isEditing ? "Modifier Tournée" : "Ajouter Tournée"}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={async (values) => {
            const data = {
              ...values,
              dateTournee: values.dateTournee.format("YYYY-MM-DD"),
            };
            if (isEditing) {
              await modifierTournee(selectedTournee.id, data);
              message.success("Tournée modifiée");
            } else {
              await ajouterTournee(data);
              message.success("Tournée ajoutée");
            }
            setModalVisible(false);
            form.resetFields();
          }}
        >
          <Form.Item name="dateTournee" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="chauffeurId" label="Chauffeur ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="vehiculeId" label="Véhicule ID" rules={[{ required: true }]}>
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
              handleModifier(selectedTournee);
            }}
          >
            Modifier
          </Button>,
        ]}
        title="Détails Tournée"
      >
        {selectedTournee && (
         <Descriptions bordered column={1}>
  <Descriptions.Item label="Code">
    {selectedTournee.codeTournee}
  </Descriptions.Item>

  <Descriptions.Item label="Date">
    {dayjs(selectedTournee.dateTournee).format("DD/MM/YYYY")}
  </Descriptions.Item>

  <Descriptions.Item label="Chauffeur ID">
    {selectedTournee.chauffeurId}
  </Descriptions.Item>

  <Descriptions.Item label="Véhicule ID">
    {selectedTournee.vehiculeId}
  </Descriptions.Item>

  <Descriptions.Item label="Statut">
    {selectedTournee.statut}
  </Descriptions.Item>
</Descriptions>

        )}
      </Modal>
    </div>
  );
};

export default Tournee;
