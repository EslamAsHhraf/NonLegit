import { Box, ThemeProvider, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import FormDialog from '../HomePage/HomePageContainer/PersonalReddit/PopUpSubReddit/PopUp';
import MainContent from '../MainContent/MainContent';
import PostSubreddit from '../Post/Post';
import CreatePostInSubreddit from '../HomePage/HomePageContainer/CreatePostInHome/CreatePostInHome';
import SideBar from './SideBar/SideBar';
import {
  Com, Content, Cover, Data, Desc, IconContainer, Image, Join, Logo, Namee, PostHeader, TotalHeader, JoinCommunity, NotFountImage, NotFoundBox, BackHomeButton, ImageWarning,
} from './style';
// import PostsClassificationSubreddit from './PostClassificationSubreddit/PostClassification';
import PostsClassificationSubreddit from '../HomePage/HomePageContainer/PostsClassification/PostsClassification';
import theme2 from '../../styles/theme/layout';
import SubredditData from './SubrridetDataServer';
import ModeratorData from './subriddetDataModeratorServer';
import PostsData from './subredditPostsServer';
import PostJoin from './PostJoin';
// import leave from './leaveServer';
import SubredditNotification from './Notifications/SubriddetNotifications';
import { useCreatePostInSubredditContext } from '../../contexts/CreatePostInSubredditContext';
/**
 * Subreddit page
 * @component
 * @return {React.Component} - Subreddit page
 */

function Header() {
  const [posts, setPosts] = useState([]);
  const [icon, setIcon] = useState();
  const [join, setJoin] = useState('');
  const [disc, setDisc] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [primaryTopic, setPrimaryTopic] = useState();
  const [topics, setTopics] = useState([]);
  const [moderatoesName, setModeratoesName] = useState([]);
  const [fixedName, setFixedName] = useState();
  const [cookies] = useCookies(['redditUser']);
  const [username, setUserName] = useState('');
  const [members, setMembers] = useState();
  const [exist, setExist] = useState(true);
  const [showPopUp, setShowPopUp] = useState(false);
  const [name, setName] = useState();
  const [nsfw, setNsfw] = useState();
  const [userNsfw, setUserNsfw] = useState();
  const [warning, setWarning] = useState(false);

  const redirect = () => {
    window.location.pathname = '/';
  };

  const createCommunity = async () => {
    await setShowPopUp(true);
    const ele = document.getElementById('popup-form-button');
    ele.click();
  };

  useEffect(() => { setUserName(cookies.redditUser?.userName); setUserNsfw(cookies.redditUser?.adultContent); }, [cookies]);

  const { Name, postClass } = useParams();

  const [data, dataError, statusCode] = SubredditData(Name);
  const { setSubredditId, setSubredditName, setSubredditIcon } = useCreatePostInSubredditContext();
  const value = useMemo(() => ({ data, dataError }), [data, dataError]);
  console.log(value);

  const [data3, dataError3] = PostsData(name, postClass);
  console.log(dataError3);
  useEffect(() => {
    if (statusCode === 404) {
      setExist(false);
    }
    setName(data?.name);
    setIcon(data?.icon);
    setDisc(data?.description);
    setTopics(data?.topics);
    setPrimaryTopic(data?.primaryTopic);
    setCreatedAt(data?.createdAt);
    setModeratoesName(data?.moderators);
    setFixedName(data?.fixedName);
    setMembers(data?.membersCount);
    setSubredditId(data?.id);
    setSubredditName(Name);
    setSubredditIcon(data?.icon);
    setNsfw(data?.nsfw);
    console.log(data?._id);
    setPosts(data3?.data);
    // join and comment another endpoint line 95
    // setJoin(data?.isJoined);
    if (userNsfw === false && nsfw === true) {
      setWarning(true);
    } else {
      setWarning(false);
    }
    console.log(warning);
  }, [data, postClass, data3, statusCode, cookies]);

  // fetch data of communities i am a moderator of

  const [data2, dataError2] = ModeratorData();

  const value2 = useMemo(() => ({ data2, dataError2 }), [data2, dataError2]);
  console.log(value2);

  useEffect(() => {
    console.log(dataError2);

    if ((data2?.filter((e) => e?.fixedName === Name?.toString()))?.length > 0) {
      setJoin(true);
    } else {
      setJoin(false);
    }
  }, [data2, username]);

  // subscribr or unsubscribe
  const sendData = (b) => {
    PostJoin(`/subreddits/${name}/subscribe`, b);
    // leave(Name, { isJoined: b });
  };
  // const leaveCommunity = (b) => {
  //   leave(Name, { isJoined: b });
  // };
  return (
    exist ? (
      warning ? (
        <NotFoundBox>
          <ImageWarning src="https://www.redditstatic.com/desktop2x/img/content-gate-icons/nsfw.png" />
          <Typography sx={{ fontWeight: 700, marginBottom: 2, fontSize: '18px' }}>You must be 18+ to view this community</Typography>
          <Typography sx={{ marginBottom: 4, fontSize: '14px' }}>
            You must be at least eighteen years old to view this content. Are you over eighteen and willing to see adult content?
          </Typography>
          <Box>
            <BackHomeButton variant="contained" onClick={redirect}>No</BackHomeButton>
            <BackHomeButton variant="outlined" onClick={() => setWarning(false)} sx={{ textTransform: 'unset' }}>Yes</BackHomeButton>
          </Box>
        </NotFoundBox>
      )
        : (
          <>
            <Cover />
            <Logo>
              <IconContainer>
                <Data>
                  <Image src={icon} />
                  <Content>
                    <Desc>
                      <Namee>
                        r/
                        { name }
                      </Namee>
                      <Com>
                        r/
                        {fixedName}
                      </Com>
                    </Desc>
                    <Box sx={{ display: 'flex' }}>
                      {!join
                && <JoinCommunity onClick={() => { setJoin(true); sendData('sub'); }}>Join</JoinCommunity>}
                      {join
                && (
                <>
                  <Join onClick={() => { setJoin(false); sendData('unsub'); }} onMouseEnter={(e) => { e.target.innerHTML = 'Leave'; }} onMouseLeave={(e) => { e.target.innerHTML = 'Joined'; }}>Joined</Join>

                  <SubredditNotification />
                </>
                )}

                    </Box>
                  </Content>
                </Data>
                <PostHeader>Posts</PostHeader>
              </IconContainer>
            </Logo>
            <TotalHeader>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                margin: '0 auto',
                '@media screen and (max-width: 435px)': {
                  width: '100%',
                },
              }}
              >
                <MainContent width={640}>
                  <ThemeProvider theme={theme2}>
                    <CreatePostInSubreddit subredditName={Name} />
                  </ThemeProvider>
                  <PostsClassificationSubreddit subredditName={Name} />
                  { posts?.map((posts) => (
                    <PostSubreddit
                      createdAt={createdAt}
                      title={posts?.title}
                      ownerIcon={icon}
                      ownerName={Name}
                      authorName={posts?.author?.name}
                      flairText={posts?.flairId?.flairText}
                      flairBackgroundColor={posts?.flairId?.flairBackgroundColor}
                      flairColor={posts?.flairId?.flairColor}
                      images={posts?.images}
                      videos={posts?.videos}
                      kind={posts?.kind}
                      votes={posts?.votes}
                      commentCount={posts?.commentCount}
                      text={posts?.text}
                      key={posts?.id}
                      subredit
                    />
                  ))}
                </MainContent>
                <SideBar members={members} Name={Name} username={username} topics={topics} disc={disc} primaryTopic={primaryTopic} createdAt={createdAt} moderatoesName={moderatoesName} />
              </Box>
            </TotalHeader>

          </>
        )
    )
      : (
        <NotFoundBox>
          <NotFountImage src="https://www.redditstatic.com/desktop2x/img/snoomoji/snoo_thoughtful.png" />
          <Typography sx={{ fontWeight: 700, marginBottom: 2, fontSize: '18px' }}>Sorry, there aren’t any communities on Reddit with that name.</Typography>
          <Typography sx={{ marginBottom: 4, fontSize: '14px' }}>This community may have been banned or the community name is incorrect.</Typography>
          <Box>
            <BackHomeButton variant="outlined" onClick={createCommunity} sx={{ textTransform: 'unset' }}>Create community</BackHomeButton>
            <BackHomeButton variant="contained" onClick={redirect}>Go Home</BackHomeButton>
          </Box>
          {showPopUp && <Box sx={{ display: 'absolute' }}><FormDialog display="none" /></Box>}
        </NotFoundBox>
      )
  );
}
export default Header;
