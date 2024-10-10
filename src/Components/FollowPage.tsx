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
  Spinner,
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
import { toggleFollow, updateUserProfile, get_following, get_follower,  getFollowingUsers, get_follow_userinfo, unfollow_user, testCreateFollowData } from "./firebase";
import { User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
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

  const [ loadingStates, setLoadingStates] = useState({});

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
  
  // console.log("followingUsers", followingUsers);


  // const handleFollow = (userId: any) => {
  //  function testUnfollow() {
  //     setIsLoading(true)
  //     setTimeout(async ()=> {
  //       await unfollow_user({targetUserId: userId});
  //       setIsLoading(false)
  //       await updateFollowList()
  //     }, 1000 ) 
  //   }
  //   testUnfollow();
  // };

    // ページ更新用関数
    const  updateFollowList = async() => {
      const followings = await get_following(user.uid);
      const following = await get_follow_userinfo(followings);
      setFollowingUsers(following)
    }

  const handleFollow = useCallback((userId: any) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    

    const testUnfollow = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
        await unfollow_user({ targetUserId: userId });
        await updateFollowList();
      } finally {
        setLoadingStates(prev => ({ ...prev, [userId]: false }));
        console.log(loadingStates);
      }
    };

    testUnfollow();
  }, [unfollow_user, updateFollowList]);



  if (!followingUsers) {
    return null
  }
  
  const handletestCreate = () => {
    testCreateFollowData()
    updateFollowList()
  }

  const tags = ["Python", "ロードバイク", "カメラ"];
  return (
    <>
    <Button onClick={handletestCreate}>作成</Button>
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
            onClick={() => handleFollow(userId)}
            borderWidth="0"
          >
            {loadingStates[userId] ?  <Spinner />: "フォロー済み" }
            {/* {username === username ? "フォロー済" : "フォロー"} */}

           
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
