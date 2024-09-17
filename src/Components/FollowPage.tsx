import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tag,
  TagLabel,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { toggleFollow, updateUserProfile } from "./firebase";
import { User } from "firebase/auth";
import { useState } from "react";

const userData = {
  username: "新しいユーザー名",
  userId: "newUserId123",
  statusMessage: "こんにちは、よろしくお願いします！",
  tags: ["プログラミング", "読書", "旅行", "ロードバイク"],
};

interface Prop {
  setGridCount: React.Dispatch<React.SetStateAction<"1" | "2" | "3">>;
  user: User | null;
}

const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function Follow() {
  const tags = ["Python", "ロードバイク", "カメラ"];
  return (
    <>
      {/* <Box h="100vh">
        <Box mt="20px" ml="20px">
          <Flex justifyContent="space-between">
            <Text>○○ 人</Text>
          </Flex>
          <Flex justifyContent="center">
            <Box w="95%" bg="gray.200" borderRadius={"md"}>
              <Flex alignItems="center" pt="70px" pb="40px" direction="column">
                {list.map(() => (
                  <Box
                    w="98%"
                    bg="gray.50"
                    h="100px"
                    borderRadius="lg"
                    shadow="lg"
                    m="4px"
                  >
                    <Flex>
                      <Box pt="20px" pl="10px">
                        <Avatar w="50px" h="50px">
                          <Tooltip label="ログイン中">
                            <AvatarBadge boxSize="1.25em" bg="green.500" />
                          </Tooltip>
                        </Avatar>
                      </Box>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box> */}
      {list.map(() => (
        <Card w="90%" variant="elevated" my={2}>
          <CardBody>
            <HStack spacing={4}>
              <Avatar size="md" />
              <Box flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading size="sm">せい</Heading>
                    <Text fontSize="sm" color="gray.600">
                      @seisei
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    {tags.map((tag, index) => (
                      <Tag key={index} size="sm">
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Flex>
                <Text mt={2}>こんにちは世界</Text>
              </Box>
            </HStack>
          </CardBody>
          <CardFooter justifyContent="end">
            <Button colorScheme="green">Follow</Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}

function Follower() {
  const tags = ["Python", "ロードバイク", "カメラ"];

  const [isFollowed, setIsFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFollow = () => {
    setIsLoading(true);
    setTimeout(() => {
      // ここにフォロー処理を記述
      setIsFollow((prev) => !prev);
      setIsLoading(false);
    }, 1000);
  };
  return (
    <>
      {list.map(() => (
        <Card w="90%" variant="elevated" my={2}>
          <CardBody>
            <HStack spacing={4}>
              <Avatar size="md" />
              <Box flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading size="sm">せい</Heading>
                    <Text fontSize="sm" color="gray.600">
                      @seisei
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    {tags.map((tag, index) => (
                      <Tag key={index} size="sm">
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                </Flex>
                <Text mt={2}>
                  こんにちは、ChatGPTです。AIを使ってさまざまな質問に答えたり、情報を提供したりすることができます。言語理解や生成が得意で、文章の作成、アイデアの提案、プログラミングのサポートなど、幅広いタスクをサポートします。あなたのニーズに合わせた助言やサポートを提供し、プロジェクトの進行をお手伝いしますので、何でも気軽に聞いてください。いつでも、どこでも、あなたのサポート役としてお役に立てれば嬉しいです。
                </Text>
              </Box>
            </HStack>
          </CardBody>
          <CardFooter justifyContent="end">
            <Button
              colorScheme={isFollowed ? "blue" : "green"}
              isLoading={isLoading}
              size="sm"
              onClick={handleFollow}
            >
              {isFollowed ? "フォロー済" : "フォロー"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
function Search() {
  return (
    <>
      <Box>
        <Flex justify="center" alignItems="center" direction="column">
          <Text>ユーザ名で検索</Text>
          <Text>タグ名で検索</Text>
        </Flex>
      </Box>
    </>
  );
}

const Timeline = ({ setGridCount, user }: Prop) => {
  const handleToggleFollow = () => {
    toggleFollow(user, "d9kwELKe39TVlHT7nkNU5gONTGI2");
  };

  const handleSetInitialStatus = () => {
    updateUserProfile(user, userData);
  };

  return (
    <>
      <Box>
        <Button
          bg=""
          _hover={{ bg: "gray.200" , borderColor: "white"}}
          _active={{ bg: "gray.100"}}
          onClick={() => setGridCount("1")}
        >
          <ArrowLeftIcon />
        </Button>
        <Tabs variant="soft-rounded" colorScheme="green" ml="30px" mt="30px">
          <TabList>
            <Tab>Follow</Tab>
            <Tab ml="20px">Follower</Tab>
            <Tab ml="20px">Search</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Follow />
            </TabPanel>
            <TabPanel>
              <Follower />
            </TabPanel>
            <TabPanel>
              <Search />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Timeline;
