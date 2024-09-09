import {
  Box,
  Button,
  Center,
  CircularProgress,
  CircularProgressLabel,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  KBIcon,
  KakaoIcon,
  NaverIcon,
  PassIcon,
  PaycoIcon,
  SinhanIcon,
  TossIcon,
} from "../Assets/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { addDocument } from "../Firebase/firebase_func";
import { auth } from "../Firebase/firebase_conf";

const host_url =
  //   window.location.hostname === "localhost"
  //     ? "http://localhost:3001"
  //     :
  "https://port-0-fitner-lxu0mkd6748b546f.sel5.cloudtype.app";
export const loginType = [
  {
    idx: "1",
    title: "카카오톡",
    icon: <KakaoIcon />,
  },
  {
    idx: "2",
    title: "페이코",
    icon: <PaycoIcon />,
  },
  {
    idx: "3",
    title: "삼성패스",
    icon: <Image src={require("../Assets/Icon/samsungpass.webp")} />,
  },
  {
    idx: "4",
    title: "KB모바일",
    icon: <KBIcon />,
  },
  {
    idx: "5",
    title: "PASS",
    icon: <PassIcon />,
  },
  {
    idx: "6",
    title: "네이버",
    icon: <NaverIcon />,
  },
  {
    idx: "7",
    title: "신한인증서",
    icon: <SinhanIcon />,
  },
  {
    idx: "8",
    title: "토스",
    icon: <Image src={require("../Assets/Icon/toss.webp")} />,
  },
];

export function Cert(props) {
  const navigate = useNavigate();
  const [formInput, setFormInput] = React.useState({
    organization: "0002",
    loginType: "5",
    loginTypeLevel: "1",
    userName: "",
    phoneNo: "",
    identity: "",
    inquiryType: "0",
    searchStartYear: (new Date().getFullYear() - 10).toString(),
    searchEndYear: new Date().getFullYear().toString(),
    type: "1",
    telecom: "0",
  });
  return (
    <Container maxW="container.sm">
      <Stack
        minH={window.innerHeight}
        py={"4"}
        justifyContent={"space-between"}
      >
        <Stack spacing={"4"}>
          <Text fontSize="xl" fontWeight="bold">
            본인확인 서비스
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight={"light"}>
            사용할 인증수단을 선택해주세요.
          </Text>
          <SimpleGrid gap="4" columns={4}>
            {loginType.map((type, index) => (
              <Flex
                onClick={() => {
                  setFormInput({
                    ...formInput,
                    loginTypeLevel: type.idx,
                  });
                }}
                cursor={"pointer"}
                aspectRatio={1}
                border={"4px solid"}
                borderColor={
                  formInput.loginTypeLevel === type.idx
                    ? "teal.500"
                    : "gray.200"
                }
                alignItems={"center"}
                justifyContent={"center"}
                key={index}
                borderRadius={"lg"}
              >
                <Stack
                  alignItems={"center"}
                  justifyContent={"center"}
                  key={index}
                  p="1"
                >
                  <Box w={"12"} h={"12"}>
                    {type.icon}
                  </Box>
                  <Text fontSize={"11px"} textAlign={"center"}>
                    {type.title}
                  </Text>
                </Stack>
              </Flex>
            ))}
          </SimpleGrid>
        </Stack>
        <Button
          onClick={() => {
            navigate("/info", { state: formInput });
          }}
        >
          다음
        </Button>
      </Stack>
    </Container>
  );
}

export function Info(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [formInput, setFormInput] = useState({});
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    setFormInput(location.state);
  }, [location.state]);
  const handleSubmit = (e) => {
    e.preventDefault();

    const session = new Date().getTime().toString();
    setSessionId(session);

    // A 요청
    fetch(`${host_url}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: session, ...formInput }),
    })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (data) => {
        console.log(data);
        if (data.result.code === "CF-03002") {
          toast({
            title: "추가 인증을 진행해주세요!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          // 전송 성공
          navigate("/confirm", {
            state: { param: data, formInput: { id: session, ...formInput } },
          });
        } else if (data.result.code === "CF-00000") {
          // 성공
        } else {
          toast({
            title: "인증에 실패하였습니다. 인증을 다시 시도해주세요.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container maxW="container.sm">
      <form onSubmit={handleSubmit}>
        <Stack
          minH={window.innerHeight}
          py={"4"}
          justifyContent={"space-between"}
        >
          <Stack spacing={"4"}>
            <Text fontSize="xl" fontWeight="bold">
              본인확인 서비스
            </Text>
            <Text fontSize="sm" color="gray.500" fontWeight={"light"}>
              개인정보를 입력해주세요.
            </Text>
            <Stack>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input
                  onChange={(e) => {
                    setFormInput({
                      ...formInput,
                      userName: e.target.value,
                    });
                  }}
                  focusBorderColor="teal"
                  placeholder="홍길동"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>생년월일</FormLabel>
                <Input
                  type="number"
                  onChange={(e) => {
                    setFormInput({
                      ...formInput,
                      identity: e.target.value,
                    });
                  }}
                  focusBorderColor="teal"
                  placeholder="YYYYMMDD"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>휴대폰번호</FormLabel>
                <Input
                  type="number"
                  onChange={(e) => {
                    setFormInput({
                      ...formInput,
                      phoneNo: e.target.value,
                    });
                  }}
                  focusBorderColor="teal"
                  placeholder="01012341234"
                />
              </FormControl>
            </Stack>
          </Stack>
          <Button type="submit">다음</Button>
        </Stack>
      </form>
    </Container>
  );
}

export const Confirm = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const [formInput, setFormInput] = useState({});
  const [step, setStep] = useState(0);

  const [healthData, setHealthData] = useState();
  const [medicineData, setMedicineData] = useState();

  useEffect(() => {
    setFormInput(location.state.formInput);
  }, [location.state]);

  const handleCallData = () => {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 10);
    const infoParam = {
      ...formInput,
      startDate: startDate.toISOString().substring(0, 10).replaceAll("-", ""),
      endDate: endDate.toISOString().substring(0, 10).replaceAll("-", ""),
    };

    const resultParam = {
      ...formInput,
      simpleAuth: "1",
      is2Way: true,
      twoWayInfo: location.state.param.data,
    };

    console.log(infoParam);

    fetch(`${host_url}/information`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(infoParam),
    })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (data) => {
        if (data.result.code === "CF-03002") {
          toast({
            title: "추가 인증을 진행해주세요!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else if (data.result.code !== "CF-00000") {
          //   toast({
          //     title: "인증에 실패하였습니다. 인증을 다시 시도해주세요.",
          //     status: "error",
          //     duration: 3000,
          //     isClosable: true,
          //     position: "top-right",
          //   });
        } else {
          // 전송 성공
          console.log("투약정보", data);
          setMedicineData(data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(`${host_url}/result`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resultParam),
    })
      .then(async (res) => {
        return await res.json();
      })
      .then(async (data) => {
        if (data.result.code === "CF-03002") {
          toast({
            title: "추가 인증을 진행해주세요!",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
        } else if (data.result.code !== "CF-00000") {
          console.log(data);
          toast({
            title: "인증에 실패하였습니다. 인증을 다시 시도해주세요.",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: "top-right",
          });
          navigate("/cert");
        } else {
          // 전송 성공
          console.log("건강정보", data);
          setHealthData(data.data);
          setStep(1);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = () => {
    console.log(healthData, medicineData, formInput);
    navigate("/find/2", {
      state: {
        healthData: healthData,
        medicineData: medicineData,
        formInput: formInput,
      },
    });
  };

  return (
    <Container maxW="container.sm">
      <Stack
        minH={window.innerHeight}
        py={"4"}
        justifyContent={"space-between"}
      >
        <Stack spacing={"4"}>
          <Text fontSize="xl" fontWeight="bold">
            본인확인 서비스
          </Text>
          {step === 0 && (
            <Stack>
              <Text fontSize={"2xl"} fontWeight={"bold"}>
                인증을 진행해주세요.
              </Text>
              <Text fontSize={"md"}>
                입력하신 휴대폰으로 인증 요청 메세지를 보냈습니다. 앱에서 인증을
                진행한 후 아래 버튼을 클릭하세요.
              </Text>
              <Center py={16}>
                <Image
                  w={"300px"}
                  h={"300px"}
                  src={require("../Assets/Image/cert.png")}
                />
              </Center>
            </Stack>
          )}
          {step === 1 && (
            <Center p={16}>
              <VStack spacing={8}>
                <Text fontSize={"lg"}>정보를 가지고 오는 중입니다...</Text>
                <CounterWithCircularProgress completed={medicineData} />
              </VStack>
            </Center>
          )}
        </Stack>
        {step === 0 && <Button onClick={handleCallData}>인증하기</Button>}
        {step === 1 && (
          <Button isDisabled={!medicineData} onClick={handleSubmit}>
            완료하기
          </Button>
        )}
      </Stack>
    </Container>
  );
};

const CounterWithCircularProgress = ({ completed = false }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!completed) {
      const interval = setInterval(() => {
        setCount((prevCount) => (prevCount >= 99 ? 99 : prevCount + 1));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [completed]);

  // 카운터가 완료된 상태일 때 100%로 고정
  const progressValue = completed ? 100 : count;

  return (
    <Box>
      <CircularProgress value={progressValue} size="100px" color="teal.500">
        <CircularProgressLabel>{progressValue}%</CircularProgressLabel>
      </CircularProgress>
    </Box>
  );
};
