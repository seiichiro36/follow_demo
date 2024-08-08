import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  HStack,
  Image,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Children, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

var tagList = [
  { tagName: "python", carrer: "1年" },
  { tagName: "ロードバイク", carrer: "1年" },
  { tagName: "ロッククライミング", carrer: "1年" },
  { tagName: "python", carrer: "1年" },
  { tagName: "python", carrer: "1年" },
  { tagName: "JavaScript", carrer: "1年" },
  { tagName: "JavaScript", carrer: "1年" },
  { tagName: "JavaScript", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
  { tagName: "ドラゴンクエスト", carrer: "1年" },
];

interface Prop {
  setGridCount: React.Dispatch<React.SetStateAction<"1" | "2" | "3">>;
}

const Mypage = ({ setGridCount }: Prop) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("ログアウトしました");

      navigate("/");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      alert("ログアウトに失敗しました。もう一度お試しください。");
    }
  };
  return (
    <>
      <Box bg={"green.200"} h="100vh">
        <Flex justifyContent="center">
          <Box w="50%" minWidth="600px" bg={"white"} h="100vh">
            <Box pr="10%">
              <Flex>
                <Spacer />
                <Button onClick={handleLogout}>ログアウト</Button>
              </Flex>
            </Box>
            <Flex align="center" justify="center" direction="column">
              <Box
                bg={"gray.50"}
                mt="20px"
                w="80%"
                h="500px"
                shadow={"lg"}
                borderRadius={"lg"}
                position="relative"
                backgroundImage="url('../../test.png')"
                objectFit="fill"
                backgroundSize="cover"
                backgroundPosition="center"
              >
                <Box
                  position="absolute"
                  bottom="10px"
                  left="0"
                  right="0"
                  height="110px"
                  backdropFilter="blur(10px)"
                  zIndex=""
                ></Box>
                {/* <Image
                    src="../../test.png"
                    borderRadius={"lg"}
                    alt="Dan Abramov"
                    zIndex="1"
                    w="100%"
                    h="100%"
                    userSelect="none"
                  /> */}
                {/* <Box w="100%" borderColor="gray.200" h="90px" position="absolute" bottom="20px" filter="auto" blur="10px" zIndex="2"></Box> */}
                <Box
                  zIndex="10"
                  position="absolute"
                  bottom="25px"
                  left="30px"
                  w="90%"
                >
                  <Flex>
                    <HStack>
                      <Avatar w="80px" h="80px">
                        <Tooltip label="ログイン中">
                        <AvatarBadge boxSize="1.25em" bg="green.500" />
                        </Tooltip>
                      </Avatar>
                      <Stack pl="10px">
                        <Text>sss</Text>
                        <Text>sss</Text>
                      </Stack>
                    </HStack>
                    <Spacer />
                    <Stack>
                      <Button
                        w="200px"
                        bg="teal"
                        color="white"
                        onClick={() => setGridCount("2")}
                      >
                        フォロー
                      </Button>
                      <Button
                        w="200px"
                        bg="teal"
                        color="white"
                        onClick={() => setGridCount("2")}
                      >
                        フォロワー
                      </Button>
                    </Stack>
                  </Flex>
                </Box>
              </Box>
              <Box mt="20px" w="100%">
                <Text ml="8%">▼ 興味のあるものタグ</Text>
                <Box w="80%" ml="8%">
                  <Flex flexWrap="wrap">
                    {tagList.map(({ tagName, carrer }, index) => (
                      <Tag
                        transition="all 0.2s"
                        key={index}
                        size={"lg"}
                        m="5px"
                        variant="solid"
                        colorScheme="teal"
                        cursor="pointer"
                        _hover={{ background: "tomato" }}
                      >
                        <Tooltip label={carrer}>
                          <TagLabel transition="all 0.2s">{tagName}</TagLabel>
                        </Tooltip>
                      </Tag>
                    ))}
                  </Flex>
                </Box>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Mypage;
