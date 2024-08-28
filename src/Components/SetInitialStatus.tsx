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
import { User } from "firebase/auth";
import { useCallback, useRef, useState } from "react";
import { checkUserIdExists, db } from "./firebase";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Navigate, useNavigate } from "react-router-dom";

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
  // console.log(user);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const activeStepText = steps[activeStep].description;

  const forms = [
    <FirstSetStatusForm />,
    <SecondSetStatusForm />,
    <ThirdSetStatusFormForConfirm />,
  ];

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    watch,
  } = useForm({ mode: "onChange" });

  function FirstSetStatusForm() {
    const onSubmit = async (data: any) => {
      setIsSubmitting(true);
      try {
        const userIdExists = await checkUserIdExists(data.userId);
        if (userIdExists) {
          setError("userId", {
            type: "manual",
            message: "このユーザIDは既に使用されています",
          });
        } else {
          clearErrors("userId");
          console.log("通過");

          console.log(data);
          setActiveStep((pre) => pre + 1);
        }
      } catch (error) {
        console.error("Error checking userId:", error);
      } finally {
        setIsSubmitting(false);
      }
    };
    if (!user) {
      return null;
    }
    if (!user.displayName) {
      return null;
    }

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
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                pt="40px"
                w="60%"
                mx="auto"
                isInvalid={!!errors.username}
              >
                <FormLabel>1, ユーザ名</FormLabel>
                <Input
                  // name="username"
                  type="text"
                  defaultValue={user.displayName}
                  {...register("username", {
                    required: "ユーザ名を入力してください",
                  })}
                />
                {errors.username && (
                  <FormErrorMessage>
                    {errors.username.message as React.ReactNode}
                  </FormErrorMessage>
                )}
              </FormControl>
              <FormControl
                pt="20px"
                w="60%"
                mx="auto"
                isInvalid={!!errors.userId}
              >
                <FormLabel>2, ユーザID</FormLabel>
                <Input
                  // name="userId"
                  type="text"
                  {...register("userId", {
                    required: "ユーザIDを入力してください",
                  })}
                />
                {errors.userId && (
                  <FormErrorMessage>
                    {errors.userId.message as React.ReactNode}
                  </FormErrorMessage>
                )}
              </FormControl>
              <Box w="60%" mx="auto" mt="20px">
                <FormLabel>3, ステータスメッセージ(200文字以内):</FormLabel>
                <FormControl isInvalid={!!errors.bid}>
                  <Textarea
                    resize="none"
                    // name="bid"
                    {...register("bid", {
                      maxLength: {
                        value: 200,
                        message: "200文字以内にしてください",
                      },
                    })}
                    placeholder="こんにちは。ありがとう。さようなら"
                    size="sm"
                  />
                  {errors.bid && (
                    <FormErrorMessage>
                      {errors.bid.message as React.ReactNode}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Box>
              <Box position="absolute" width="100%" bottom="0" left="0" p={4}>
                <Flex w="80%" mx="auto" justify="center" alignItems="center">
                  <Spacer />
                  <Button type="submit">Next</Button>
                </Flex>
              </Box>
            </form>
          </Box>
        </Box>
      </Center>
    );
  }

  function SecondSetStatusForm() {
    const [profileImage, setProfileImage] = useState<string | null>("");
    const [iconFilename, setIconFilename] = useState<string | any>("");
    const [headerImage, setHeaderImage] = useState<string | null>("");
    const [fileName, setFileName] = useState("");

    const onProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const fileObject = e.target.files[0];
      setProfileImage(window.URL.createObjectURL(fileObject));
      console.log(fileObject);
      setIconFilename(fileObject.name);
      setFileName(fileObject.name); // ファイル名を状態として保存
    };

    const resetProfileImageFileInput = useCallback(() => {
      // setIconFilename("");
      setProfileImage(null);
    }, []);

    const resetHeaderFileInput = useCallback(() => {
      setHeaderImage(null);
    }, []);

    const onHeaderInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      // React.ChangeEvent<HTMLInputElement>よりファイルを取得
      const fileObject = e.target.files[0];
      // オブジェクトURLを生成し、useState()を更新
      setHeaderImage(window.URL.createObjectURL(fileObject));
    };

    const onSubmit = (data: any) => {
      console.log(data);
      setActiveStep((pre) => pre + 1);
    };

    if (!user?.photoURL) {
      return null;
    }

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box textAlign="center">
              <Flex mt="80px" w="80%">
                <Box flex="2">
                  <Stack pl="20px">
                    <FormLabel pl="20px">
                      4, ユーザアイコンを設定してください
                      <br />
                      <Text fontSize="14px" color="gray">
                        　(設定しなかったらgoogleアカウントのアイコンを使用します)
                      </Text>
                      <Button
                        variant="outline"
                        size="xs"
                        colorScheme="green"
                        onClick={resetProfileImageFileInput}
                      >
                        リセット
                      </Button>
                    </FormLabel>
                    <Input
                      w="350px"
                      p="5px 0 0 20px"
                      {...register("icon_filename")}
                      type="file"
                      accept="image/*"
                      onChange={onProfileInputChange}
                    />
                  </Stack>
                </Box>
                <Box flex="1">
                  <Avatar
                    src={profileImage ? profileImage : user.photoURL}
                    w="100px"
                    h="100px"
                  />
                </Box>
              </Flex>
              <Flex mt="40px" w="80%">
                <Box flex="2">
                  <Stack pl="20px">
                    <FormLabel pl="20px">
                      5, ヘッダー画像を設定してください <br />
                    </FormLabel>
                    <Button
                      variant="outline"
                      size="xs"
                      colorScheme="green"
                      pl="20px"
                      w="160px"
                      onClick={resetHeaderFileInput}
                    >
                      リセット
                    </Button>

                    <Input
                      w="350px"
                      p="5px 0 0 20px"
                      type="file"
                      accept="image/*"
                      {...register("header_filename")}
                      onChange={onHeaderInputChange}
                    />
                  </Stack>
                </Box>
                <Box flex="1">
                  <Image
                    w="300px"
                    h="150px"
                    // src="gibbresh.png"
                    fallbackSrc={
                      headerImage
                        ? headerImage
                        : "https://via.placeholder.com/150"
                    }
                  />
                </Box>
              </Flex>

              <Box>
                <FormLabel mt="40px" pl="40px">
                  6, タグを追加してください
                </FormLabel>
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
                  <Button type="submit">Next</Button>
                </Flex>
              </Box>
            </Box>
          </form>
        </Box>
      </Center>
    );
  }

  function ThirdSetStatusFormForConfirm() {
    const inputUsername = getValues("username");
    const inputUserId = getValues("userId");
    const bid = getValues("bid");
    const icon_filename = watch("icon_filename");
    const header_filename = watch("header_filename");

    const navigate = useNavigate();

    if (!user) {
      return;
    }

    const onSubmit = async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          username: inputUsername,
          userId: inputUserId,
          bid: bid,
          iconFilename: icon_filename?.[0]?.name,
          headerFilename: header_filename?.[0]?.name,
        }).then(() => {
          console.log("初期設定完了しました。");
          navigate("../welcome");
        });
      } catch (error) {
        console.error("Error writing document: ", error);
      }
    };

    return (
      <>
        <Button onClick={() => setActiveStep((pre) => pre - 1)}>Back</Button>
        <form onSubmit={handleSubmit(onSubmit)}>
          <br />
          ユーザ名: {inputUsername}
          <br />
          ユーザID: {inputUserId}
          <br />
          ステータスメッセージ: {bid}
          <br />
          アイコン画像： {icon_filename?.[0]?.name}
          <br />
          アイコン画像： {header_filename?.[0]?.name}
          <br />
          <Button type="submit">送信</Button>
        </form>
      </>
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
                    <Step
                      key={index}
                      // gap="0"
                    >
                      <StepIndicator>
                        <StepStatus complete={<StepIcon />} />
                      </StepIndicator>
                      <StepSeparator
                      // _horizontal={{ ml: "0" }}
                      />
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
                <AnimatePresence initial={false} custom={activeStep}>
                  {forms.map((form, index) => (
                    <motion.div
                      key={index}
                      custom={activeStep}
                      initial={{ x: "100%" }}
                      animate={{
                        x:
                          activeStep === index
                            ? 0
                            : activeStep > index
                            ? "-100%"
                            : "100%",
                      }}
                      exit={{ x: activeStep > index ? "-100%" : "100%" }}
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
