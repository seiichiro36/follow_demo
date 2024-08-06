import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowLeftIcon } from "@chakra-ui/icons";
import { toggleFollow, updateUserProfile } from "./firebase";
import { User } from "firebase/auth";

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
  return (
    <>
      <Box h="100vh">
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
      </Box>
    </>
  );
}
function Follower() {
  return (
    <>
      <p>Follower</p>
    </>
  );
}
function Search() {
  return (
    <>
      <p>Search Page</p>
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
          _hover={{ bg: "aqua" }}
          _active={{ bg: "aqua" }}
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
