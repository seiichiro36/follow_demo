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
import { toggleFollow, updateUserProfile, get_followers, getFollowingUsers } from "./firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";

const userData = {
  username: "新しいユーザー名",
  userId: "newUserId123",
  statusMessage: "こんにちは、よろしくお願いします！",
  tags: ["プログラミング", "読書", "旅行", "ロードバイク"],
};

interface Prop {
  setGridCount: React.Dispatch<React.SetStateAction<"1" | "2" | "3">>;
  user: User | null;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>
}

const list = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

function Follow() {
  const tags = ["Python", "ロードバイク", "カメラ"];


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

const Timeline = ({ setGridCount, user, tabIndex ,setTabIndex }: Prop) => {
  const [userfollowers, setUserfollowers] =  useState<DocumentData[]>([]);
  // 下が表示されるフォロー一覧表示
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log(user.uid)
          const user_followers = await get_followers(user.uid)

          console.log(user_followers);
          setUserfollowers(user_followers);
          
          const following = getFollowingUsers(user_followers);
          setFollowingUsers(following);

        } catch (error) {
          console.error("ユーザデータの取得中にエラーが発生しました", error);
        }
      }
    };
    fetchData()

  }, [user]);
  


  const handleToggleFollow = () => {
    toggleFollow(user, "d9kwELKe39TVlHT7nkNU5gONTGI2");
  };

  const handleSetInitialStatus = () => {
    updateUserProfile(user, userData);
  };


  const handleTabChange = (index:any) => {
    setTabIndex(index);
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
        <Tabs variant="soft-rounded" colorScheme="green" ml="30px" mt="30px" index={tabIndex} onChange={handleTabChange}>
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
