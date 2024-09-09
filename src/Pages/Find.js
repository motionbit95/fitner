import {
  AspectRatio,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { StepsWithCircles } from "../Application/ProgressSteps/StepsWithCircles/App";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase_conf";
import { addDocument, uploadFile } from "../Firebase/firebase_func";
import { MdAdd } from "react-icons/md";
import { FiX } from "react-icons/fi";

function Find(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(
    parseInt(window.location.pathname.split("/").pop())
  );
  const [viewImageUpload, setViewImageUpload] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imageList, setImageList] = useState([]);
  const imageRef = useRef(null);

  const [data, setData] = useState({});

  useEffect(() => {
    if (location.state) {
      if (location.state.isSurvey) {
        navigate(`/find/1`);
      }
      if (location.state.healthData && location.state.medicineData) {
        setData(location.state);
        navigate(`/find/2`);
      }
    }
  }, [location.state]);

  useEffect(() => {
    setStep(parseInt(window.location.pathname.split("/").pop()));
  }, [window.location.pathname]);

  const handleSubmit = () => {
    console.log(data, imageList);
    addDocument("codef_result", {
      uid: auth?.currentUser?.uid,
      health: data?.healthData ? data?.healthData : {},
      medicine: data?.medicineData ? data?.medicineData : [],
      user: data?.formInput ? data?.formInput : {},
      createdAt: new Date(),
      image: imageList ? imageList : [],
    }).then(async () => {
      console.log("저장완료");
      navigate("/");
    });
  };

  const handleChange = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const firstFile = files[0];
      console.log(firstFile);
      uploadFile("medicine", firstFile).then(async (url) => {
        setImageList([...imageList, url]);
      });
    }

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return (
    <Container maxW="container.xl">
      <Center minH={"100vh"}>
        <Flex>
          <Image
            display={{ base: "none", md: "block" }}
            w={"50%"}
            objectFit={"cover"}
            src={require("../Assets/Image/illust.png")}
            alt="Lovely Image"
            fallback={<Skeleton />}
          />

          <Flex
            direction="column"
            align="center"
            flex="1"
            py="12"
            px={{ base: "4", md: "6" }}
          >
            <Box maxW="md" mx="auto">
              <StepsWithCircles currentStep={step} />
              {/* <Logo
            height="4"
            color={useColorModeValue("blue.500", "blue.200")}
            mx="auto"
          /> */}
              {step === 0 && (
                <Box textAlign="left" mx="auto" mt="4">
                  <Heading
                    fontWeight="extrabold"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    bgClip="text"
                    bgGradient="linear(to-r, teal.500, teal.300)"
                  >
                    내게 맞는 영양제 찾기
                  </Heading>
                  <Stack fontSize={{ base: "md", md: "sm" }} mt="2">
                    <Text>
                      이제부터 당신에게 꼭 맞는 영양제를 찾기위한 건강설문을
                      진행할게요
                    </Text>
                    <Text>
                      이 설문은 당신의 건강을 파악하기 위해 SCI 의학 논문을
                      분석하여 만들어졌습니다.
                    </Text>
                  </Stack>
                </Box>
              )}
              {step === 1 && (
                <Box textAlign="left" mx="auto" mt="4">
                  <Heading
                    fontWeight="extrabold"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    bgClip="text"
                    bgGradient="linear(to-r, teal.500, teal.300)"
                  >
                    축하합니다!
                  </Heading>
                  <Stack fontSize={{ base: "md", md: "sm" }} mt="2">
                    <Text>
                      당신은 지금 건강증진을 위한 첫번째 단계를 끝냈습니다. 이제
                      당신의 건강검진 자료와 투약 이력을 알려주세요
                    </Text>
                    <Text>더 정확한 영양제를 추천해드리겠습니다</Text>
                  </Stack>
                </Box>
              )}
              {step === 2 && (
                <Box textAlign="left" mx="auto" mt="4">
                  <Heading
                    fontWeight="extrabold"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    bgClip="text"
                    bgGradient="linear(to-r, teal.500, teal.300)"
                  >
                    이제 거의 다 됐습니다.
                  </Heading>
                  <Stack fontSize={{ base: "md", md: "sm" }} mt="2">
                    <Text>
                      지금 드시는 약을 알려주시면 더 정확한 영양제를 추천해 드릴
                      수 있습니다.
                    </Text>
                  </Stack>
                </Box>
              )}
              {step === 3 && (
                <Box textAlign="left" mx="auto" mt="4">
                  <Heading
                    fontWeight="extrabold"
                    fontSize={{ base: "3xl", md: "4xl" }}
                    bgClip="text"
                    bgGradient="linear(to-r, teal.500, teal.300)"
                  >
                    감사합니다.
                  </Heading>
                  <Stack fontSize={{ base: "md", md: "sm" }} mt="2">
                    <Text>
                      알려주신 소중한 정보로 여러분에게 꼭 맞는 영양제를 찾도록
                      하겠습니다.
                    </Text>
                    <Text>
                      아래 1:1 약사 상담하기 버튼을 클릭하시면 24시간 이내에 AI
                      와 약사가 당신의 정보를 분석하여 알려줄 겁니다.
                    </Text>
                    <Text>정확한 영양제 추천을 위해 조금만 기다려주세요</Text>
                  </Stack>
                </Box>
              )}

              <Stack spacing="7" mt="8" w={"100%"}>
                <Stack direction={{ base: "column", md: "row" }} w={"100%"}>
                  {step === 0 && (
                    <Button onClick={() => navigate("/survey")}>
                      설문 시작하기
                    </Button>
                  )}
                  {step === 1 && (
                    <HStack>
                      <Button
                        w={"full"}
                        onClick={() => {
                          navigate("/cert");
                        }}
                      >
                        건강검진자료 및 투약이력 알려주기
                      </Button>
                    </HStack>
                  )}
                  {step === 2 && (
                    <Button onClick={() => setViewImageUpload(true)}>
                      먹는약 업로드하기
                    </Button>
                  )}
                  {step === 3 && (
                    <Button
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      1:1 약사 상담하기
                    </Button>
                  )}

                  {step < 3 && (
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/find/${step + 1}`)}
                    >
                      건너뛰기
                    </Button>
                  )}
                </Stack>

                <Text
                  fontSize="sm"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  {step === 0
                    ? "설문이 어렵다면 건너뛰셔도 됩니다. 다만 더 정확한 분석을 위해 꼭 설문을 부탁드려요"
                    : step === 1 &&
                      "건강검진, 투약자료 알려주기가 어렵다면 건너뛰기를 눌러주세요. 다만 더 정확한 분석을 위해 꼭 알려주기를 부탁드려요"}
                </Text>
              </Stack>
            </Box>
          </Flex>

          <Modal
            size={{ base: "full", md: "md" }}
            isCentered
            isOpen={step === 2 && viewImageUpload}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                <Stack>
                  <Text fontWeight={"bold"} fontSize="xl">
                    지금 드시는 약의 사진을 업로드 해주세요.
                  </Text>
                  <Text fontSize="sm" color="gray.500" fontWeight={"light"}>
                    사진은 성분명이 잘 나오도록 올려주세요.
                  </Text>
                </Stack>
              </ModalHeader>

              <ModalCloseButton onClick={() => setViewImageUpload(false)} />
              <ModalBody>
                <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
                  {imageList.map((url) => (
                    <Box key={url} aspectRatio={1}>
                      <IconButton
                        aria-label=""
                        icon={<FiX />}
                        position={"absolute"}
                        mt={2}
                        ml={2}
                        variant={"solid"}
                        colorScheme={"gray"}
                        size={"sm"}
                        zIndex={9999}
                        onClick={() =>
                          setImageList(imageList.filter((i) => i !== url))
                        }
                      />
                      <AspectRatio key={url} ratio={1} cursor={"pointer"}>
                        <Image
                          src={url}
                          objectFit="cover"
                          rounded={"lg"}
                          fallback={<Skeleton />}
                        />
                      </AspectRatio>
                    </Box>
                  ))}
                  <Center
                    cursor={"pointer"}
                    onClick={() => imageRef.current?.click()}
                    aspectRatio={1}
                    border={"3px dashed #d9d9d9"}
                    borderRadius={"lg"}
                  >
                    <MdAdd fontSize="100px" color="#d9d9d9" />
                    <Input
                      type="file"
                      display={"none"}
                      ref={imageRef}
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </Center>
                </SimpleGrid>
              </ModalBody>

              <ModalFooter mb={4}>
                <Button
                  w={"full"}
                  colorScheme="teal"
                  onClick={() => {
                    navigate(`/find/${step + 1}`);
                    onClose();
                  }}
                >
                  완료
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Flex>
      </Center>
    </Container>
  );
}

export default Find;
