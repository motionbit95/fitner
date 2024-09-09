import {
  Avatar,
  Badge,
  Stack,
  HStack,
  Icon,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Input,
  Button,
  Select,
  Card,
  Divider,
  useColorModeValue,
  CardHeader,
  CardBody,
  SimpleGrid,
  Image,
  Flex,
  Center,
  Wrap,
  Box,
} from "@chakra-ui/react";

import React, { useEffect } from "react";
import { getAllDoc2, updateDocument } from "../../../Firebase/firebase_func";
// import { members } from "./data";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Grid, GridItem } from "@chakra-ui/react";
import { BiChevronLeft } from "react-icons/bi";

export const MemberTable = (props: any) => {
  const { list } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [type, setType] = React.useState(0);
  const [data, setData] = React.useState<any>({});

  const [newList, setNewList] = React.useState<any>([]);

  const [detailItem, setDetailItem] = React.useState<any>(null);

  useEffect(() => {
    list.map((member: any, index: number) => {
      getAllDoc2("survey_result").then((data) => {
        const result = data.filter((item: any) => item.uid === member.uid);
        list[index] = { ...list[index], answer: result?.[0] };
        setNewList(list);
      });
    });
  }, [list]);
  return (
    <>
      <Table {...props} size={"sm"}>
        <Thead>
          <Tr>
            <Th textAlign={"center"} minW={"100px"}>
              이름
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              생년월일
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              전화번호
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              제출일
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              설문조사
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              건강검진
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              진료&투약
            </Th>
            <Th textAlign={"center"} minW={"100px"}>
              먹는약
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {newList.map((member: any, index: number) => (
            <Tr key={index}>
              <Td textAlign={"center"}>{member.user.userName}</Td>
              <Td textAlign={"center"}>{member.user.identity}</Td>
              <Td textAlign={"center"}>{member.user.phoneNo}</Td>
              <Td textAlign={"center"}>
                {member.createdAt.toDate().toLocaleDateString()}
              </Td>
              <Td textAlign={"center"}>
                {member.answer ? (
                  <Button
                    onClick={() => {
                      setType(0);
                      setData(member.answer);
                      onOpen();
                    }}
                    colorScheme="teal"
                    size={"xs"}
                    variant={"outline"}
                  >
                    제출완료
                  </Button>
                ) : (
                  <Text fontSize={"xs"} fontWeight={"semibold"}>
                    미제출
                  </Text>
                )}
              </Td>
              <Td textAlign={"center"}>
                {member.health.resCheckupTarget ? (
                  <Button
                    onClick={() => {
                      setType(1);
                      setData(member);
                      onOpen();
                    }}
                    colorScheme="teal"
                    size={"xs"}
                    variant={"outline"}
                  >
                    제출완료
                  </Button>
                ) : (
                  <Text fontSize={"xs"} fontWeight={"semibold"}>
                    미제출
                  </Text>
                )}
              </Td>
              <Td textAlign={"center"}>
                {member.medicine ? (
                  <Button
                    onClick={() => {
                      setDetailItem(null);
                      setType(2);
                      try {
                        console.log(member.medicine);
                        setData(member.medicine);
                        onOpen();
                      } catch (error) {
                        alert("[TYPE ERROR] : 잘못된 데이터입니다.");
                      }
                    }}
                    colorScheme="teal"
                    size={"xs"}
                    variant={"outline"}
                  >
                    제출완료
                  </Button>
                ) : (
                  <Text fontSize={"xs"} fontWeight={"semibold"}>
                    미제출
                  </Text>
                )}
              </Td>
              <Td textAlign={"center"}>
                {member?.image?.length > 0 ? (
                  <Button
                    onClick={() => {
                      setType(3);
                      setData(member.image);
                      onOpen();
                    }}
                    colorScheme="teal"
                    size={"xs"}
                    variant={"outline"}
                  >
                    제출완료
                  </Button>
                ) : (
                  <Text fontSize={"xs"} fontWeight={"semibold"}>
                    미제출
                  </Text>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Modal
        size={{ base: "full", md: "5xl" }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {type === 0
              ? "설문 응답"
              : type === 1
              ? "건강검진정보"
              : type === 2
              ? "처방내역"
              : "먹는약 이미지"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody bgColor={useColorModeValue("gray.50", "gray.700")}>
            {type === 0 ? (
              <>
                <Stack spacing={4}>
                  {data.answer?.map((answer: any, id: number) => (
                    <Stack key={id}>
                      <Text>Q. {answer.question}</Text>
                      <Text>A. {answer.answer}</Text>
                    </Stack>
                  ))}
                </Stack>
              </>
            ) : type === 1 ? (
              <>
                <Stack spacing={4}>
                  {data.health.resPreviewList?.map(
                    (health: any, id: number) => (
                      <Card key={id}>
                        <CardHeader fontSize={"lg"} fontWeight={"bold"}>
                          한눈에 보기
                        </CardHeader>
                        <CardBody>
                          {/* <Stack>
                          <Text>검진년도 : {health.resCheckupYear}</Text>
                          <Text>검진일자 : {health.resCheckupDate}</Text>
                          <Text>검진장소 : {health.resCheckupPlace}</Text>
                          <Text>신장 : {health.resHeight}</Text>
                          <Text>체중 : {health.resWeight}</Text>
                          <Text>허리둘레 : {health.resWaist}</Text>
                          <Text>체질량지수 : {health.resBMI}</Text>
                          <Text>시력 : {health.resSight}</Text>
                          <Text>청력 : {health.resHearing}</Text>
                          <Text>혈압 : {health.resBloodPressure}</Text>
                          <Text>요단백 : {health.resUrinaryProtein}</Text>
                          <Text>혈색소 : {health.resHemoglobin}</Text>
                          <Text>식전혈당 : {health.resFastingBloodSuger}</Text>
                          <Text>
                            총콜레스테롤 : {health.resTotalCholesterol}
                          </Text>
                          <Text>
                            HDL콜레스테롤 : {health.resHDLCholesterol}
                          </Text>
                          <Text>
                            트리글리세라이드 : {health.resTriglyceride}
                          </Text>
                          <Text>
                            LDL콜레스테롤 : {health.resLDLCholesterol}
                          </Text>
                          <Text>
                            혈청크레아티닌 : {health.resSerumCreatinine}
                          </Text>
                          <Text>신사구체여과율(GFR) : {health.resGFR}</Text>
                          <Text>AST(SGOT) : {health.resAST}</Text>
                          <Text>ALT(SGPT) : {health.resALT}</Text>
                          <Text>감마지피티(y-GPT) : {health.resyGPT}</Text>
                          <Text>
                            폐결핵 흉부질환 : {health.resTBChestDisease}
                          </Text>
                          <Text>골다공증 : {health.resOsteoporosis}</Text>
                          <Text>판정 : {health.resJudgement}</Text>
                        </Stack> */}
                          <Stack>
                            <Grid
                              templateRows="repeat(2, 1fr)"
                              templateColumns="repeat(4, 1fr)"
                            >
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>수검자 성명</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>{data.health.resCheckupTarget}</Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>검진일자</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center>
                                  <Text>
                                    {health.resCheckupYear}년{" "}
                                    {health.resCheckupDate.substring(0, 2)}월{" "}
                                    {health.resCheckupDate.substring(2, 4)}일
                                  </Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>판정</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resJudgement}</Text>
                                </Center>
                              </GridItem>
                            </Grid>
                            <Grid
                              // h="200px"
                              templateRows="repeat(7, 1fr)"
                              templateColumns="repeat(6, 1fr)"
                              // gap={4}
                            >
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>구분</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>목표질환</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>검사항목</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center>
                                  <Text>결과(참고치)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                rowSpan={6}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>계측검사</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                rowSpan={3}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>비만/복부비만</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                rowSpan={1}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>키 (cm) 및 몸무게(kg)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center h="100%">
                                  <Text>
                                    {health.resHeight} / {health.resWeight}
                                  </Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>체질량지수(kg/㎡)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resBMI}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>허리둘레(cm)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resWaist}</Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>시력(좌우)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={4}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resSight}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>청력(좌우)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={4}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resHearing}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>고혈압 (수축기/이완기)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={4}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>
                                    {health.resBloodPressure}{" "}
                                    {
                                      data.health.resReferenceList[0]
                                        .resBloodPressure
                                    }
                                  </Text>
                                </Center>
                              </GridItem>
                            </Grid>
                            <Grid
                              // h="200px"
                              templateRows="repeat(11, 1fr)"
                              templateColumns="repeat(6, 1fr)"
                              // gap={4}
                            >
                              <GridItem
                                rowSpan={6}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>혈액검사</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                rowSpan={1}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>빈혈 등</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                rowSpan={1}
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>혈색소(g/dL)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center h="100%">
                                  <Text>{health.resHemoglobin}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>당뇨병</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>공복혈당(mg/dL)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resFastingBloodSuger}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={1}
                                rowSpan={4}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center h="100%">
                                  <Text>이상지질혈증</Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>총콜레스테롤(mg/dL)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>
                                    {" "}
                                    {health.resTotalCholesterol
                                      ? health.resTotalCholesterol
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>HDL콜레스테롤</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>
                                    {" "}
                                    {health.resHDLCholesterol
                                      ? health.resHDLCholesterol
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>LDL콜레스테롤</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>
                                    {" "}
                                    {health.resLDLCholesterol
                                      ? health.resLDLCholesterol
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>중성지방</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>
                                    {" "}
                                    {health.resTriglyceride
                                      ? health.resTriglyceride
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                rowSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>신장질환</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>혈청크레아티닌(mg/dL)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resSerumCreatinine}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>신사구체여과율(GFR)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resGFR}</Text>
                                </Center>
                              </GridItem>

                              <GridItem
                                colSpan={1}
                                rowSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>간장질환</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>AST(SGOT)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resAST}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>ALT(SGPT)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resALT}</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={2}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>감마지피티(y-GPT)</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={3}
                                border={"1px solid #d9d9d9"}
                                borderTop={"none"}
                              >
                                <Center>
                                  <Text>{health.resyGPT}</Text>
                                </Center>
                              </GridItem>
                            </Grid>

                            <Grid
                              templateRows="repeat(1, 1fr)"
                              templateColumns="repeat(6, 1fr)"
                            >
                              <GridItem
                                colSpan={1}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>폐결핵 흉부질환 </Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={5}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center>
                                  <Text>{health.resTBChestDisease}</Text>
                                </Center>
                              </GridItem>
                            </Grid>

                            <Grid
                              templateRows="repeat(1, 1fr)"
                              templateColumns="repeat(6, 1fr)"
                            >
                              <GridItem
                                colSpan={1}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>골다공증</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={5}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center>
                                  <Text>
                                    {health.resOsteoporosis
                                      ? health.resOsteoporosis
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>
                            </Grid>

                            <Grid
                              templateRows="repeat(1, 1fr)"
                              templateColumns="repeat(6, 1fr)"
                            >
                              <GridItem
                                colSpan={1}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                                borderRight={"none"}
                              >
                                <Center>
                                  <Text>요단백</Text>
                                </Center>
                              </GridItem>
                              <GridItem
                                colSpan={5}
                                rowSpan={1}
                                border={"1px solid #d9d9d9"}
                              >
                                <Center>
                                  <Text>
                                    {health.resUrinaryProtein
                                      ? health.resUrinaryProtein
                                      : "비해당"}
                                  </Text>
                                </Center>
                              </GridItem>
                            </Grid>
                          </Stack>
                        </CardBody>
                      </Card>
                    )
                  )}
                </Stack>
              </>
            ) : type === 2 ? (
              <Stack>
                {!detailItem && (
                  <Stack spacing={2}>
                    <Grid
                      templateColumns="repeat(8, 1fr)"
                      bgColor={"white"}
                      p={2}
                    >
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>번호</Text>
                      </GridItem>
                      <GridItem
                        colSpan={2}
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>병의원(약국)명</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>진료개시일</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>진료형태</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>방문(입원)일수</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>처방회수</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        bgColor={"gray.100"}
                      >
                        <Text>투약(요양)회수</Text>
                      </GridItem>
                      {data?.map((item: any, index: number) => (
                        <>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text>{index + 1}</Text>
                          </GridItem>
                          <GridItem
                            colSpan={2}
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text
                              color={"red.500"}
                              fontWeight={"bold"}
                              textDecoration={"underline"}
                              cursor={"pointer"}
                              onClick={() => {
                                setDetailItem(item);
                              }}
                            >
                              {item.resHospitalName}
                            </Text>
                          </GridItem>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text>
                              {" "}
                              {item.resTreatStartDate.slice(0, 4) +
                                "-" +
                                item.resTreatStartDate.slice(4, 6) +
                                "-" +
                                item.resTreatStartDate.slice(6, 8)}
                            </Text>
                          </GridItem>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text> {item.resTreatType}</Text>
                          </GridItem>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text> {item.resVisitDays}</Text>
                          </GridItem>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text> {item.resMedicationCnt}</Text>
                          </GridItem>
                          <GridItem
                            p={2}
                            border={"1px solid #d9d9d9"}
                            // borderRight={"none"}
                            borderTop={"none"}
                          >
                            <Text> {item.resPrescribeCnt}</Text>
                          </GridItem>
                        </>
                      ))}
                    </Grid>
                  </Stack>
                )}

                {detailItem && (
                  <Stack spacing={2}>
                    <Flex>
                      <Button
                        variant={"outline"}
                        aria-label="go back"
                        leftIcon={<BiChevronLeft />}
                        onClick={() => setDetailItem(null)}
                      >
                        목록
                      </Button>
                    </Flex>
                    <HStack
                      spacing={4}
                      p={4}
                      border={"1px solid #d9d9d9"}
                      bgColor={"white"}
                    >
                      <Text fontWeight={"bold"} opacity={0.8}>
                        병(의)원 약국 명
                      </Text>
                      <Text fontWeight={"bold"}>
                        {detailItem?.resHospitalName}
                      </Text>
                    </HStack>
                    <Grid
                      templateColumns="repeat(8, 1fr)"
                      bgColor={"white"}
                      p={2}
                    >
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>번호</Text>
                      </GridItem>

                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>진료(처방)일자</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>진료형태</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>처방회수</Text>
                      </GridItem>
                      <GridItem
                        colSpan={2}
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>처방약품명</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        borderRight={"none"}
                        bgColor={"gray.100"}
                      >
                        <Text>처방약품효능</Text>
                      </GridItem>
                      <GridItem
                        p={2}
                        border={"1px solid #d9d9d9"}
                        bgColor={"gray.100"}
                      >
                        <Text>투약일수</Text>
                      </GridItem>
                      {/* {data?.map((item: any, index: number) => ( */}
                      <>
                        {detailItem?.resMediDetailList?.length > 0 && (
                          <>
                            {detailItem?.resMediDetailList.map(
                              (detail: any, index: number) => (
                                <>
                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text>{index + 1}</Text>
                                  </GridItem>

                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text> {detail.resTreatDate}</Text>
                                  </GridItem>
                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text> {detail.resTreatTypeDet}</Text>
                                  </GridItem>
                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text> {detail.resPrescribeCntDet}</Text>
                                  </GridItem>
                                  <GridItem
                                    colSpan={2}
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text> {detail.resPrescribeDrugName}</Text>
                                  </GridItem>
                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text>
                                      {" "}
                                      {detail.resPrescribeDrugEffect}
                                    </Text>
                                  </GridItem>
                                  <GridItem
                                    p={2}
                                    border={"1px solid #d9d9d9"}
                                    // borderRight={"none"}
                                    borderTop={"none"}
                                  >
                                    <Text> {detail.resPrescribeDays}</Text>
                                  </GridItem>
                                </>
                              )
                            )}
                          </>
                        )}
                        {detailItem?.resMediDetailList?.length === 0 && (
                          <GridItem colSpan={8} p={8}>
                            <Text w={"100%"} textAlign={"center"}>
                              검색 결과가 존재하지 않습니다.
                            </Text>
                          </GridItem>
                        )}
                      </>
                      {/* ))} */}
                    </Grid>
                  </Stack>
                )}
              </Stack>
            ) : (
              <>
                {/* <SimpleGrid columns={3} spacing={2}>
                  {data?.map((item: any, index: number) => (
                    <Image src={item} key={index} width={"100%"} />
                  ))}
                </SimpleGrid> */}
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={onClose}>
              닫기
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
