"use client";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Carousel, Col, Row, Statistic } from "antd";
import Header from "../components/Header";
const { Meta } = Card;
export default function Dashboard() {
  const cards = [
    {
      title: "New Designs",
      description: "2024 New Collection",
      image:
        "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=8",
      carouselItems: [
        "/assets/carousel/1.jpg",
        "/assets/carousel/3.jpg",
        "/assets/carousel/4.jpg",
        "/assets/carousel/5.jpg",
      ],
    },
    {
      title: "Simple",
      description: "This is the description",
      image:
        "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=8",
    },
    {
      title: "Simple",
      description: "This is the description",
      image:
        "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=8",
    },
  ];
  return (
    <>
      <Header />
      <div className="container">
        <Row gutter={16}>
          <Col span={6}>
            <Card bordered={false} style={{ margin: 10 }}>
              <Statistic
                title="Active"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} style={{ margin: 10 }}>
              <Statistic
                title="Idle"
                value={9.3}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </Card>
          </Col>
        </Row>
        <Row>
          {cards.map((card) => (
            <Card
              style={{ width: 300, margin: 15 }}
              cover={
                card.carouselItems?.length > 0 ? (
                  <Carousel arrows autoplay>
                    {card.carouselItems?.map((img) => (
                      <div>
                        <img src={img} width="100%" />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <img src={card.image} width="100%" />
                )
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                avatar={<Avatar src={card.avatar} />}
                title={card.title}
                description={card.description}
              />
            </Card>
          ))}
        </Row>
        <Card
          hoverable
          style={{ width: 240, margin: 15 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
      </div>
    </>
  );
}
