import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Image,
  Progress,
  SkeletonCircle,
  SkeletonText,
  Spacer,
  Stack,
  Tag,
  TagLabel,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { Children, useCallback, useEffect, useState } from "react";
import { signOut, User } from "firebase/auth";
import { createPost, auth, getUserData, getPosts } from "./firebase";
import { useNavigate, redirect } from "react-router-dom";
import { AddIcon } from "@chakra-ui/icons";

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
  user: any;
}
interface UserData {
  username: string;
  userId: string;
  bid: number;
}
interface Post {
  id: string;
  content: string;
  createdAt: Date;
}

const Mypage: React.FC<Prop> = ({ setGridCount, user }: Prop) => {
  let navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);

  const [postData, setPostData] = useState<Post[] | null>();
  // 投稿内容
  const [postContent, setPostContent] = useState("");
  // ポスト投稿内容記入ウィンドウの表示
  const [displayContentOfPost, setDisplayContentOfPost] = useState(false);

  const [existedPost, setExistedPost] = useState(false);

  const [isFollowed, setIsFollow] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isPosting, setIsPosting] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          const postData = await getPosts(user.uid);
          if (postData.length > 0) {
            setPostData(postData);
            setExistedPost(true);
          } else {
            setPostData([]); // 空の配列をセット
            setExistedPost(false);
          }

          console.log(postData);
          setUserData(data);
        } catch (error) {
          console.error("ユーザデータの取得中にエラーが発生しました", error);
        }
      }
    };
    fetchData();
  }, [user]);

  if (!user) {
    return <div>ログインしていません。</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { username, userId, bid } = userData;

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
  const getBoxHeight = () => {
    if (existedPost) return "auto";
    if (displayContentOfPost) return "auto";
    return "100vh";
  };

  const handleInputChange = (e: any) => {
    setPostContent(e.target.value);
  };

  const handlePost = () => {
    if (!postContent.trim()) return;
    console.log("投稿内容:", postContent);

    setIsPosting(true);
    try {
      createPost(postContent);
      setPostContent("");
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setIsPosting(false);
      setPostContent("");
      setDisplayContentOfPost(false);
    }
  };

  // const handlePost = useCallback(async (content) => {
  //   if (!content.trim()) return;

  //   setIsPosting(true);
  //   const optimisticPost = {
  //     id: Date.now().toString(), // 一時的なID
  //     content: content,
  //     createdAt: new Date(),
  //     username: userData?.username,
  //     userId: userData?.userId,
  //   };

  //   setPosts(prevPosts => [optimisticPost, ...prevPosts]);
  //   setShowPostForm(false);

  //   try {
  //     await createPost(content);
  //     toast({
  //       title: "投稿が完了しました",
  //       status: "success",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //     toast({
  //       title: "投稿に失敗しました",
  //       description: "もう一度お試しください。",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //     // 楽観的に追加した投稿を削除
  //     setPosts(prevPosts => prevPosts.filter(post => post.id !== optimisticPost.id));
  //   } finally {
  //     setIsPosting(false);
  //   }
  // }, [userData, toast]);
  return (
    <>
      <Box bg={"green.200"} h="100%">
        <Flex justifyContent="center">
          <Box w="50%" minWidth="600px" h={getBoxHeight()} bg={"white"}>
            {isPosting && (
              <Box width="100%">
                <Center mb={2}>ポスト中...</Center>
                <Progress size="xs" isIndeterminate colorScheme="green" />
              </Box>
            )}
            <Box pr="10%" pt="40px">
              <Flex>
                <Spacer />
                <Button
                  mr="10px"
                  backgroundColor={"blue.200"}
                  borderRadius="10px"
                  onClick={() => setDisplayContentOfPost((pre) => !pre)}
                >
                  <AddIcon />
                </Button>
                <Button
                  onClick={handleLogout}
                  backgroundColor={"tomato"}
                  color={"white"}
                >
                  ログアウト
                </Button>
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
                        <Text>{username}</Text>
                        <Text>{userId}</Text>
                      </Stack>
                    </HStack>
                    <Spacer />
                    <Stack>
                      <Button
                        w="200px"
                        colorScheme="green"
                        color="white"
                        onClick={() => setGridCount("2")}
                      >
                        フォロー
                      </Button>
                      <Button
                        w="200px"
                        colorScheme="green"
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
                        colorScheme="green"
                        cursor="pointer"
                        _hover={{ background: "tomato" }}
                      >
                        <Tooltip label={carrer}>
                          <TagLabel transition="all 0.2s">{tagName}</TagLabel>
                        </Tooltip>
                      </Tag>
                    ))}
                  </Flex>
                  {displayContentOfPost ? (
                    <Box maxWidth="700px" margin="auto" padding={4}>
                      <HStack spacing={4}>
                        <Textarea
                          // value={postContent}
                          onChange={handleInputChange}
                          placeholder="ここに投稿内容を入力してください"
                          size="md"
                          resize="none"
                          colorScheme="green"
                        />
                        <Button
                          type="submit"
                          colorScheme="green"
                          onClick={handlePost}
                          // isDisabled={!postContent.trim()}
                        >
                          投稿する
                        </Button>
                      </HStack>
                    </Box>
                  ) : (
                    <></>
                  )}

                  <Box mt="20px">
                    {existedPost ? (
                      <div>
                        {postData?.map((post, index) => (
                          <Card variant="elevated" my={2} key={index}>
                            <CardBody>
                              <HStack spacing={4}>
                                <Avatar size="md" />
                                <Box flexGrow={1}>
                                  <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Box>
                                      <Heading size="sm">せい</Heading>
                                      <Text fontSize="sm" color="gray.600">
                                        @seisei
                                      </Text>
                                    </Box>
                                    <HStack spacing={2}>
                                      <Tag size="sm">
                                        <TagLabel>Python</TagLabel>
                                      </Tag>
                                    </HStack>
                                  </Flex>
                                  <Text mt={2}>{post.content}</Text>
                                </Box>
                              </HStack>
                            </CardBody>
                            <CardFooter justifyContent="end">
                              <Button
                                colorScheme={isFollowed ? "blue" : "green"}
                                isLoading={isLoading}
                                size="sm"
                              >
                                {isFollowed ? "フォロー済" : "フォロー"}
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      // <Box padding="6" boxShadow="lg" bg="white">
                      //   <SkeletonCircle size="10" />
                      //   <SkeletonText
                      //     mt="4"
                      //     noOfLines={4}
                      //     spacing="4"
                      //     skeletonHeight="2"
                      //   />
                      // </Box>
                      <Box pt="30px">
                        <Center>投稿がありません</Center>
                      </Box>
                    )}
                  </Box>
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
