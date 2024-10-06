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
import { toggleFollow, updateUserProfile, get_following, get_follower,  getFollowingUsers, get_follow_userinfo } from "./firebase";
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

function Follow({user}: any) {
  const [isFollowed, setIsFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [followingUsers, setFollowingUsers] = useState<string[] | null>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const user_followers = await get_following(user.uid);
          console.log("followingUser", user_followers);
          if (user_followers.length > 0) {
            const following = await get_follow_userinfo(user_followers);
            console.log("Fetched following users:", following);
            setFollowingUsers(following);
          } else {
            setFollowingUsers([]);
          }
        } catch (error) {
          console.error("ユーザデータの取得中にエラーが発生しました", error);
          setFollowingUsers([]);
        }
      }
    };
    fetchData();
  }, [user]);
  
  console.log("followingUsers", followingUsers);

  const handleFollow = (username: any) => {
    // setIsLoading(true);
    // setTimeout(() => {
    //   // ここにフォロー処理を記述
    //   setIsFollow((prev) => !prev);
    //   setIsLoading(false);
    // }, 1000)
    console.log(username);
    
  };

  console.log("folloeingUsers", followingUsers)

  const tags = ["Python", "ロードバイク", "カメラ"];
  return (
    <>
      {followingUsers.map(({username, userId, bid}: any) => (
        <Card w="90%" variant="elevated" my={2} key={userId}>
        <CardBody>
          <HStack spacing={4}>
            <Avatar size="md" />
            <Box flexGrow={1}>
              <Flex justifyContent="space-between" alignItems="center">
                <Box>
                  <Heading size="sm">{username}</Heading>
                  <Text fontSize="sm" color="gray.600">
                    @{userId}
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
                {bid}
              </Text>
            </Box>
          </HStack>
        </CardBody>
        <CardFooter justifyContent="end">
          <Button
            colorScheme={username === username ? "blue" : "green"}
            isLoading={isLoading}
            size="sm"
            onClick={() => handleFollow(username)}
          >
            {username === username ? "フォロー済" : "フォロー"}
          </Button>
        </CardFooter>
      </Card>
      ))}
    </>
  );
}

function Follower({user}: any) {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          console.log(user.uid)
          const user_followers = await get_follower(user.uid)
          console.log("followingUser", user_followers)
          if (user_followers.length > 0) {
            const follower =  getFollowingUsers(user_followers);
            setFollowingUsers(await follower);
          } else {
            
          }
        } catch (error) {
          console.error("ユーザデータの取得中にエラーが発生しました", error);
        }
      }
    };
    fetchData()
   
  }, [user]);
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
      {followingUsers.map(({username, userId, bid}: any) => (
        <Card w="90%" variant="elevated" my={2}>
          <CardBody>
            <HStack spacing={4}>
              <Avatar size="md" />
              <Box flexGrow={1}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Heading size="sm">{username}</Heading>
                    <Text fontSize="sm" color="gray.600">
                      @{userId}
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
                  {bid}
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
              <Follow user={user}/>
            </TabPanel>
            <TabPanel>
              <Follower user={user}/>
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
