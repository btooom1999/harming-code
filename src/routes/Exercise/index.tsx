import { Col, Divider, Layout, Row, Space, Table, Typography } from "antd";
import React, { FC, useEffect, useMemo, useState } from "react";
import { Breadcrumb, Footer, Header, Sider } from "../../models";
import { _math } from "../../ultis";
import Lottie from "react-lottie";
import working from "../../assets/images/working.json";
import "./index.scss";

const { Text } = Typography;
const { Content } = Layout;

const Index: FC = () => {
  // calculate harming code
  const [dataBitInput, setDataBitInput] = useState("");
  const [dataBitOutput, setDataBitOutput] = useState("");
  const [checkBit, setCheckBit] = useState(-1);

  const onValueChange = (dataBitInput: string, dataBitOutput: string) => {
    setDataBitInput(dataBitInput);
    setDataBitOutput(dataBitOutput);
    setCheckBit(_math.calcCheckBit(dataBitInput));
  };

  // get data bit and check bit, syndrome data, ...
  const _XORDataBit = useMemo(
    () => _math.checkXORBit(dataBitInput),
    [dataBitInput]
  );

  const data = useMemo(
    () => _math.getDataBitAndCheckBitArray(dataBitInput.length + checkBit),
    [dataBitInput.length + checkBit]
  );

  const checkBitInput = useMemo(
    () => _math.calcCheckBitArray(data[1], dataBitInput),
    [data[1], dataBitInput]
  );

  const checkBitOutput = useMemo(
    () => _math.calcCheckBitArray(data[1], dataBitOutput),
    [data[1], dataBitOutput]
  );

  const syndrome = useMemo(
    () =>
      _math.getSyndrome(
        checkBitInput[2][0] as number[],
        checkBitOutput[2][0] as number[]
      ),
    [checkBitInput[2][0], checkBitOutput[2][0]]
  );

  // customize table
  const columns = [
    {
      title: "Bit position",
      dataIndex: "Bit position",
    },
    ..._math.getNumberArray(dataBitInput.length + checkBit).map((i, index) => {
      return {
        title: i,
        dataIndex: index,
        align: "center",
      } as const;
    }),
  ];

  const rows = [
    {
      key: "1",
      ["Bit position"]: "Position number",
      ..._math
        .getBinaryNumberArray(dataBitInput.length + checkBit)
        .map((i) => i),
    },
    {
      key: "2",
      ["Bit position"]: "Data bit",
      ...data[0].map((i) => i),
    },
    {
      key: "3",
      ["Bit position"]: "Check bit",
      ...data[0].map((i, index) => {
        if (i !== null) return null;
        return "C" + (dataBitInput.length + checkBit - index);
      }),
    },
  ];

  // lottie
  const defaultOptionsLottie = {
    loop: true,
    autoplay: true,
    animationData: working,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider />
      <Layout className="site-layout">
        <Header onValueChange={onValueChange} />
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb />
          <div
            className="site-layout-background"
            style={{ padding: 24, height: "100%" }}
          >
            {(!dataBitInput.length ||
              _math.getEquationResult(dataBitInput.length, checkBit) ===
                -1) && (
              <Lottie options={defaultOptionsLottie} width={600} height={400} />
            )}
            {dataBitInput.length > 0 &&
              _math.getEquationResult(dataBitInput.length, checkBit) === 1 && (
                <>
                  <Table
                    bordered
                    columns={columns}
                    dataSource={rows}
                    pagination={false}
                  />
                  <Text
                    strong
                    italic
                    style={{
                      display: "block",
                      textAlign: "center",
                      marginTop: 8,
                    }}
                  >
                    H1. Bảng phân tích
                  </Text>
                  <Row gutter={16}>
                    <Col span={8} style={{ padding: "12px 8px 0" }}>
                      <Divider orientation="left">
                        Tính K bit đầu vào ({dataBitInput})
                      </Divider>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column-reverse",
                        }}
                      >
                        {[...checkBitInput[0]].map((i: any, index) => (
                          <div key={index} style={{ marginTop: 8 }}>
                            <span>C{i[0]} = </span>
                            {[...i.slice(1)].map((s, p) => {
                              let plus = " + ";
                              if (p === 0) plus = "";
                              return <span key={p}>{plus + s}</span>;
                            })}
                            <span> = </span>
                            {[...checkBitInput[1][index]].map((n, p) => {
                              let plus = " + ";
                              if (p === 0) plus = "";
                              return <span key={p}> {plus + n}</span>;
                            })}
                            <span> = </span>
                            <span>{checkBitInput[2][0][index]}</span>
                          </div>
                        ))}
                      </div>
                    </Col>
                    <Col span={8} style={{ padding: "12px 8px 0" }}>
                      <Divider orientation="left">
                        Tính K' bit đầu ra ({dataBitOutput})
                      </Divider>
                      {dataBitOutput.length === dataBitInput.length && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column-reverse",
                          }}
                        >
                          {[...checkBitOutput[0]].map((i: any, index) => (
                            <div key={index} style={{ marginTop: 8 }}>
                              <span>C{i[0]} = </span>
                              {[...i.slice(1)].map((s, p) => {
                                let plus = " + ";
                                if (p === 0) plus = "";
                                return <span key={p}>{plus + s}</span>;
                              })}
                              <span> = </span>
                              {[...checkBitOutput[1][index]].map((n, p) => {
                                let plus = " + ";
                                if (p === 0) plus = "";
                                return <span key={p}> {plus + n}</span>;
                              })}
                              <span> = </span>
                              <span>{checkBitOutput[2][0][index]}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Col>
                    <Col span={8} style={{ padding: "12px 8px 0" }}>
                      <Divider orientation="left">Kết quả syndrome</Divider>
                      <div
                        style={{
                          marginTop: 8,
                          display: "inline-flex",
                          flexDirection: "column",
                        }}
                      >
                        <div>
                          <span style={{ margin: "0px 10px" }}>K: </span>
                          {checkBitInput[2][0]
                            .reverse()
                            .map((i: any, index: number) => (
                              <span key={index} style={{ margin: "0px 10px" }}>
                                {i}
                              </span>
                            ))}
                        </div>
                        <div>
                          <span style={{ margin: "0px 7.5px 0px 10px" }}>
                            K':{" "}
                          </span>
                          {checkBitOutput[2][0]
                            .reverse()
                            .map((i: any, index: number) => (
                              <span key={index} style={{ margin: "0px 10px" }}>
                                {i}
                              </span>
                            ))}
                        </div>
                        <Divider style={{ margin: "8px 0" }} />
                        <div>
                          <span style={{ margin: "0px 10px" }}>C: </span>
                          {[...(syndrome[0] as string[])].map((i, index) => (
                            <span key={index} style={{ margin: "0px 10px" }}>
                              {i}
                            </span>
                          ))}
                          {_XORDataBit === 1 && (syndrome[1] as number) !== 0 && (
                            <Text strong type="danger">
                              {" "}
                              {`=> Phát hiện lỗi tại vị trí: ${syndrome[1]} (D${
                                (syndrome[1] as number) - checkBit
                              })`}
                            </Text>
                          )}
                          {_XORDataBit === 0 && (syndrome[1] as number) === 0 && (
                            <Text strong type="success">
                              {" "}
                              {`=> Không có lỗi`}
                            </Text>
                          )}
                          {_XORDataBit === 0 && (syndrome[1] as number) !== 0 && (
                            <Text strong type="danger">
                              {" "}
                              {`=> Có từ 2 lỗi trở lên`}
                            </Text>
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Divider orientation="center">Giải thích</Divider>
                        <Space direction="vertical">
                          <Text italic>
                            - Điều kiện 1: C = 0 và P = 0, không có lỗi nào{" "}
                            {_XORDataBit === 0 &&
                              (syndrome[1] as number) === 0 && <b>(Thỏa)</b>}
                          </Text>
                          {_XORDataBit === 0 && (syndrome[1] as number) === 0 && (
                            <div className="result">
                              <Text>{`Vì: C = ${syndrome[1]} và P = `}</Text>
                              {[..._math.getArrayDataBit(dataBitInput)].map(
                                (i, index) => {
                                  if (index === 0)
                                    return <Text> {`${i} `}</Text>;
                                  return <Text> {`+ ${i} `}</Text>;
                                }
                              )}
                              <Text>{`= ${_XORDataBit}`}</Text>
                            </div>
                          )}
                          <Text italic>
                            - Điều kiện 2: C ≥ 0 và P = 1, Phát hiện 1 lỗi, có
                            thể sửa lỗi{" "}
                            {_XORDataBit === 1 &&
                              (syndrome[1] as number) !== 0 && <b>(Thỏa)</b>}
                          </Text>
                          {_XORDataBit === 1 && (syndrome[1] as number) !== 0 && (
                            <div className="result">
                              <Text>{`Vì: C = ${syndrome[1]} và P = `}</Text>
                              {[..._math.getArrayDataBit(dataBitInput)].map(
                                (i, index) => {
                                  if (index === 0)
                                    return <Text> {`${i} `}</Text>;
                                  return <Text> {`+ ${i} `}</Text>;
                                }
                              )}
                              <Text>{`= ${_XORDataBit}`}</Text>
                            </div>
                          )}
                          <Text italic>
                            - Điều kiện 3: C ≠ 0 và P = 0, Phát hiện 2 lỗi trở
                            lên, không thể sửa lỗi{" "}
                            {_XORDataBit === 0 &&
                              (syndrome[1] as number) !== 0 && <b>(Thoả)</b>}
                          </Text>
                          {_XORDataBit === 0 && (syndrome[1] as number) !== 0 && (
                            <div className="result">
                              <Text>{`Vì: C = ${syndrome[1]} và P = `}</Text>
                              {[..._math.getArrayDataBit(dataBitInput)].map(
                                (i, index) => {
                                  if (index === 0)
                                    return <Text> {`${i} `}</Text>;
                                  return <Text> {`+ ${i} `}</Text>;
                                }
                              )}
                              <Text>{`= ${_XORDataBit}`}</Text>
                            </div>
                          )}
                        </Space>
                      </Col>
                      <Col span={12}>
                        <Divider orientation="center">Sửa lỗi</Divider>
                        {_XORDataBit === 0 && (syndrome[1] as number) === 0 && (
                          <Text italic>
                            - Thuộc điều kiện 1 nên không có lỗi để sửa
                          </Text>
                        )}
                        {_XORDataBit === 1 && (syndrome[1] as number) !== 0 && (
                          <Text italic>
                            - Thuộc điều kiện 2 nên đổi data bit đầu vào có vị
                            trí sai từ 1 - 0 hoặc ngược lại
                          </Text>
                        )}
                        {_XORDataBit === 0 && (syndrome[1] as number) !== 0 && (
                          <Text italic>
                            - Thuộc điều kiện 3 nên không thể sửa lỗi
                          </Text>
                        )}
                      </Col>
                    </Row>
                  </div>
                </>
              )}
          </div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
};

export default Index;
