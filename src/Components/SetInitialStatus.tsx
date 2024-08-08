import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spacer,
  Stack,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Text,
  Textarea,
  useSteps,
} from "@chakra-ui/react";
import { ActionCodeOperation, signOut, User } from "firebase/auth";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { auth, checkUserIdExists, checkUsernameExists } from "./firebase";
import { ChevronRightIcon, DragHandleIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  userStatus: {
    username: string;
    userId: string;
    bid: string;
  };
  setUserStatus: React.Dispatch<
    React.SetStateAction<{
      username: string;
      userId: string;
      bid: string;
    }>
  >;
  user: User | null;
}

const steps = [
  { title: "First", description: "ユーザ情報" },
  { title: "Second", description: "ユーザ名" },
  { title: "Third", description: "これでよろしいですか？" },
];

const SetInitialStatus = ({ userStatus, setUserStatus, user }: Props) => {
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [input] = useState("");

  const forms = [<FirstSetStatusForm />, <SecondSetStatusForm />];

  // ステータスメッセージ文字数警告用

  const activeStepText = steps[activeStep].description;

  function FirstSetStatusForm() {
    const [isInvalid, setIsInvalid] = useState<boolean>(false);
    const [isInvalidOnUserId, setIsInvalidOnUserId] = useState<boolean>(true);
    const [isInvalidOnUsername, setIsInvalidOnUsername] =
      useState<boolean>(true);

    if (!user) {
      return null;
    }

    if (!user.displayName) {
      return null;
    }

    const [inputValues, setInputValues] = useState({
      username: user.displayName,
      userId: "",
      bid: "",
      tags: [],
    });
    const handleInputChange = async (e: any) => {
      const { name, value } = e.target;
      if (name === "bid" && value.length > 200) {
        setIsInvalid(true);
      } else {
        setIsInvalid(false);
      }
      setInputValues((prevUser: any) => ({
        ...prevUser,
        [name]: value,
      }));
      console.log(inputValues);
    };

    useEffect(() => {
      console.log("Component mounted or updated", inputValues);
    }, [inputValues]);

    const [errorMEssage, setErrorMessage] = useState<string | null>("");

    const handleNextStep = async () => {
      const existedUserId = await checkUserIdExists(inputValues.userId);

      if (inputValues.userId === "") {
        if (inputValues.username === "") {
          setIsInvalidOnUsername(false);
          setIsInvalidOnUserId(false);
        } else {
          setIsInvalidOnUsername(true);
          setIsInvalidOnUserId(false);
        }
        setErrorMessage("値が入力されていません");
      } else if (existedUserId) {
        if (inputValues.username === "") {
          setIsInvalidOnUsername(false);
          setIsInvalidOnUserId(false);
        } else {
          setIsInvalidOnUsername(true);
          setIsInvalidOnUserId(false);
        }
        setErrorMessage("すでに存在しています");
      } else {
        setActiveStep((pre) => pre + 1);
      }
    };

    return (
      <Center>
        <Box
          w="80%"
          h="500px"
          bg="gray.100"
          borderRadius={"lg"}
          shadow={"lg"}
          position="relative"
        >
          <Box>
            <FormControl
              pt="40px"
              w="60%"
              mx="auto"
              isInvalid={!isInvalidOnUsername}
            >
              <FormLabel>1, ユーザ名</FormLabel>
              <Input
                name="username"
                type="text"
                value={inputValues.username}
                onChange={(e) => handleInputChange(e)}
              />
              {isInvalidOnUsername ? (
                <FormHelperText></FormHelperText>
              ) : (
                <FormErrorMessage>ユーザ名を入力してください</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              pt="20px"
              isInvalid={!isInvalidOnUserId}
              w="60%"
              mx="auto"
            >
              <FormLabel>2, ユーザID</FormLabel>
              <Input
                name="userId"
                type="text"
                value={inputValues.userId}
                onChange={handleInputChange}
              />
              {isInvalidOnUserId ? (
                <FormHelperText></FormHelperText>
              ) : (
                <FormErrorMessage>{errorMEssage}</FormErrorMessage>
              )}
            </FormControl>

            <Box w="60%" mx="auto" mt="20px">
              <FormLabel>3, ステータスメッセージ(200文字以内):</FormLabel>
              <FormControl isInvalid={isInvalid}>
                <Textarea
                  resize="none"
                  name="bid"
                  value={inputValues.bid}
                  onChange={handleInputChange}
                  placeholder="Here is a sample placeholder"
                  size="sm"
                />
                {isInvalid && (
                  <FormErrorMessage>
                    200文字以内にしてください。
                  </FormErrorMessage>
                )}
              </FormControl>
            </Box>
            <Box position="absolute" width="100%" bottom="0" left="0" p={4}>
              <Flex w="80%" mx="auto" justify="center" alignItems="center">
                <Button
                  onClick={() =>
                    setActiveStep((pre) => (activeStep == 0 ? pre : pre - 1))
                  }
                >
                  あああ
                </Button>
                <Spacer />
                <Button onClick={() => handleNextStep()}>Next</Button>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Center>
    );
  }

  function SecondSetStatusForm({ inputValues, setInputValues }: any) {
    const [newTag, setNewTag] = useState({
      name: "",
      duration: 0,
      unit: "",
    });

    const handleAddTag = () => {
      setInputValues((prevState: any) => ({
        ...prevState,
        tags: [...prevState.tags, newTag],
      }));
      setNewTag({ name: "", duration: 0, unit: "日" });
    };

    console.log(newTag);
    return (
      <Center>
        <Box
          w="80%"
          h="700px"
          bg="gray.100"
          borderRadius={"lg"}
          shadow={"lg"}
          position="relative"
        >
          <Box textAlign="center">
            <Flex mt="80px" w="80%">
              <Box flex="2">
                <Stack pl="20px">
                  <FormLabel pl="20px">
                    4, ユーザアイコンを設定してください <br />
                    <Text fontSize="14px" color="gray">
                      　(設定しなかったらgoogleアカウントのアイコンを使用します)
                    </Text>
                  </FormLabel>

                  <Input
                    w="350px"
                    p="5px 0 0 20px"
                    // {...ragister("preview_url")}
                    type="file"
                    accept="image/*"
                    // onChange={onFileInputChange}
                  />
                </Stack>
              </Box>
              <Box flex="1">
                <Avatar src="https://bit.ly/broken-link" w="100px" h="100px" />
              </Box>
            </Flex>
            <Flex mt="40px" w="80%">
              <Box flex="2">
                <Stack pl="20px">
                  <FormLabel pl="20px">
                    5, ヘッダー画像を設定してください <br />
                  </FormLabel>

                  <Input
                    w="350px"
                    p="5px 0 0 20px"
                    // {...ragister("preview_url")}
                    type="file"
                    accept="image/*"
                    // onChange={onFileInputChange}
                  />
                </Stack>
              </Box>
              <Box flex="1">
                <Image
                  w="300px"
                  h="150px"
                  src="gibbresh.png"
                  fallbackSrc="https://via.placeholder.com/150"
                />
              </Box>
            </Flex>

            <Box>
              <FormLabel mt="40px" pl="40px">
                6, タグを追加してください
              </FormLabel>
              <Flex>
                <Center>
                  <Input
                    w="100px"
                    ml="30px"
                    value={newTag.name}
                    onChange={(e) =>
                      setNewTag((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                  <NumberInput
                    size="md"
                    w="100px"
                    defaultValue={0}
                    min={0}
                    value={newTag.duration}
                  >
                    <NumberInputField
                      onChange={(e) =>
                        setNewTag((prev) => ({
                          ...prev,
                          duration: Number(e.target.value),
                        }))
                      }
                    />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Select
                    placeholder="選択してください"
                    w="200px"
                    value={newTag.unit}
                    onChange={(e) =>
                      setNewTag((prev) => ({ ...prev, unit: e.target.value }))
                    }
                  >
                    <option value="option1">日</option>
                    <option value="option2">ヵ月</option>
                    <option value="option3">年</option>
                  </Select>
                  <Button ml="20px" onClick={handleAddTag}>
                    追加
                  </Button>
                </Center>
              </Flex>
            </Box>
            <Box position="absolute" width="100%" bottom="0" left="0" p={4}>
              <Flex w="80%" mx="auto" justify="center" alignItems="center">
                <Button
                  onClick={() =>
                    setActiveStep((pre) => (activeStep == 0 ? pre : pre - 1))
                  }
                >
                  あああ
                </Button>
                <Spacer />
                <Button onClick={() => setActiveStep((pre) => pre + 1)}>
                  Next
                </Button>
              </Flex>
              {/* <Flex wrap="wrap" justify="center">
                {inputValues.tags.map((tag: any, index: any) => (
                  <Box
                    key={index}
                    bg="gray.200"
                    borderRadius="md"
                    px="4"
                    py="2"
                    m="2"
                  >
                    {tag.name} ({tag.duration} {tag.unit})
                  </Box>
                ))}
              </Flex> */}
            </Box>
          </Box>
        </Box>
      </Center>
    );
  }

  return (
    <>
      <Box bg={"green.200"} h="100vh" w="100vw">
        <Flex justifyContent="center">
          <Box h="100vh" bg={"gray.200"} w="50%">
            <Flex justifyContent="center" pt="50px">
              <Stack>
                <Stepper size="sm" index={activeStep} gap="0" w="500px">
                  {steps.map((step, index) => (
                    <Step key={index} gap="0">
                      <StepIndicator>
                        <StepStatus complete={<StepIcon />} />
                      </StepIndicator>
                      <StepSeparator _horizontal={{ ml: "0" }} />
                    </Step>
                  ))}
                </Stepper>
                <Text>
                  Step {activeStep + 1}: <b>{activeStepText}</b>
                </Text>
              </Stack>
            </Flex>
            <Flex justifyContent="center" mt="10px">
              <Box position="relative" overflow="hidden" h="100vh" w="100vw">
                <AnimatePresence initial={false}>
                  {forms.map((form, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: index === 0 ? 0 : "100%" }}
                      animate={{
                        x:
                          index === activeStep
                            ? 0
                            : index < activeStep
                            ? "-100%"
                            : "100%",
                      }}
                      transition={{ type: "tween", duration: 0.5 }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      {form}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default SetInitialStatus;
