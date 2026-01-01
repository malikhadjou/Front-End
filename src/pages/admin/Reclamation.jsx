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
  DatePicker,
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { ReclamationContext } from "../../context/ReclamationContext.jsx";
import dayjs from "dayjs";

const { TextArea } = Input;

const Reclamations = () => {
  const {
    reclamations,
    statistiques,
    fetchReclamations,
    ajouterReclamation,
    changerStatutReclamation,
  } = useContext(ReclamationContext);

  const [searchText, setSearchText] = useState("");
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [ajouterVisible, setAjouterVisible] = useState(false);
  const [selectedReclamation, setSelectedReclamation] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchReclamations();
  }, [fetchReclamations]);

  
  const filteredReclamations = reclamations.filter(
    (rec) =>
      rec.numeroReclamation.toLowerCase().includes(searchText.toLowerCase()) ||
      rec.client.toLowerCase().includes(searchText.toLowerCase()) ||
      rec.type.toLowerCase().includes(searchText.toLowerCase())
  );

  
  const getStatutColor = (statut) => {
    switch (statut) {
      case "Nouvelle":
        return "blue";
      case "En cours":
        return "orange";
      case "Résolue":
        return "green";
      default:
        return "default";
    }
  };

  
  const columns = [
    {
      title: "N° Réclamation",
      dataIndex: "numeroReclamation",
      key: "numeroReclamation",
      fixed: "left",
      width: 160,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Client",
      dataIndex: "client",
      key: "client",
      width: 220,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 220,
    },
    {
      title: "Priorité",
      dataIndex: "priorite",
      key: "priorite",
      width: 120,
      render: (p) => {
        const colors = {
          Basse: "green",
          Moyenne: "blue",
          Haute: "orange",
          Critique: "red",
        };
        return <Tag color={colors[p]}>{p}</Tag>;
      },
    },
    {
      title: "Statut",
      dataIndex: "statut",
      key: "statut",
      width: 130,
      render: (statut) => (
        <Tag color={getStatutColor(statut)}>{statut}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 320,
      style: { textAlign: "center" },
      render: (_, record) => (
        <Space>
          <Button
            
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedReclamation(record);
              setDetailsVisible(true);
            }}
          >
            Détails
          </Button>

          {record.statut === "Nouvelle" && (
            <Button
              type="link"
              icon={<SyncOutlined />}
              onClick={() => {
                changerStatutReclamation(record.id, "En cours");
                message.success("Réclamation mise en cours");
              }}
            >
              En cours
            </Button>
          )}

          {record.statut !== "Résolue" && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => {
                changerStatutReclamation(record.id, "Résolue");
                message.success("Réclamation résolue");
              }}
            >
              Résoudre
            </Button>
          )}
        </Space>
      ),
    },
  ];

  // Ajouter
  const handleAjouterSubmit = async (values) => {
    await ajouterReclamation({
      client: values.client,
      type: values.type,
      priorite: values.priorite,
      description: values.description,
    });

    message.success("Réclamation ajoutée avec succès");
    setAjouterVisible(false);
    form.resetFields();
  };

  return (
    <div style={{ width: "84vw" }}>
      <Card title="Gestion des Réclamations" bordered={false}>
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
                  title="Nouvelles"
                  value={statistiques.nouvelles}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="En cours"
                  value={statistiques.enCours}
                  valueStyle={{ color: "#faad14" }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Résolues"
                  value={statistiques.resolues}
                  valueStyle={{ color: "#52c41a" }}
                />
              </Card>
            </Col>
          </Row>

          {/*  Recherche et action */}
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Rechercher par numéro, client ou type"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 450 }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAjouterVisible(true)}
            >
              Nouvelle réclamation
            </Button>
          </Space>

          
          <Table
            columns={columns}
            dataSource={filteredReclamations}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1400 }}
            bordered
            locale={{
              emptyText: (
                <Empty description="Aucune réclamation trouvée" />
              ),
            }}
          />
        </Space>
      </Card>

      {/*  Détails */}
      <Modal
        open={detailsVisible}
        title={`Réclamation ${selectedReclamation?.numeroReclamation}`}
        onCancel={() => setDetailsVisible(false)}
        footer={<Button onClick={() => setDetailsVisible(false)}>Fermer</Button>}
        width={700}
      >
        {selectedReclamation && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Client">
              {selectedReclamation.client}
            </Descriptions.Item>
            <Descriptions.Item label="Statut">
              <Tag color={getStatutColor(selectedReclamation.statut)}>
                {selectedReclamation.statut}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type" span={2}>
              {selectedReclamation.type}
            </Descriptions.Item>
            <Descriptions.Item label="Priorité">
              {selectedReclamation.priorite}
            </Descriptions.Item>
            <Descriptions.Item label="Date">
              {selectedReclamation.date}
            </Descriptions.Item>
            {selectedReclamation.description && (
              <Descriptions.Item label="Description" span={2}>
                {selectedReclamation.description}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>

      {/*  Ajouter */}
      <Modal
        open={ajouterVisible}
        title="Nouvelle réclamation"
        onCancel={() => setAjouterVisible(false)}
        onOk={() => form.submit()}
        okText="Enregistrer"
      >
        <Form layout="vertical" form={form} onFinish={handleAjouterSubmit}>
          <Form.Item
            name="client"
            label="Client"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="priorite"
            label="Priorité"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Basse">Basse</Select.Option>
              <Select.Option value="Moyenne">Moyenne</Select.Option>
              <Select.Option value="Haute">Haute</Select.Option>
              <Select.Option value="Critique">Critique</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Reclamations;
