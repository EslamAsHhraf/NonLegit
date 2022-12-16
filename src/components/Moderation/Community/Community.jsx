/* eslint-disable max-len */
import { Box, Switch, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import patchData from '../../SubReddit/SideBar/Mderation/ModerationServer';
import FormDialog from '../../HomePage/HomePageContainer/PersonalReddit/PopUpSubReddit/PopUp';
import getSubredditAllData from '../../SubReddit/SubrridetDataServer';
import CommunityMianTopic from './CommumityMainTopics/CmmunityMainTopics';
import RadioBtn from './CommunityType/CommunityType';
import CountrySelect from './Region/Region';
import {
  AboutString,
  AboutSubString,
  Add,
  AddFlair,
  Adult,
  BackHomeButton,
  Container,
  Count,
  Disc,
  FlexBox,
  FlexBoxColumn,
  InputName,
  LeftAlighne,
  NotFoundBox,
  NotFountImage,
  NSFWs,
  Section,
  SmallDisc,
  TextArea,
  TotalContainer,
  Warning,
} from './style';

export default function Community() {
  const [count, setCount] = useState(100);
  const [countDisc, setCountDisc] = useState(100);

  const [type, setType] = useState('');
  const [primaryTopic, setPrimaryTopic] = useState('');
  const [disc, setDisc] = useState('');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [nsfw, setNsfw] = useState();
  const [topics, setTopics] = useState([]);
  const [showPopUp, setShowPopUp] = useState(false);

  const [exist, setExist] = useState(true);

  const { subReddit } = useParams();

  const [data, dataError, statusCode] = getSubredditAllData(subReddit);
  const value = useMemo(() => ({ data, dataError }), [data, dataError]);
  console.log(value, data);
  useEffect(() => {
    if (statusCode === 404) {
      setExist(false);
    }
    setName(data?.name);
    setDisc(data?.description);
    setTopics(data?.topics);
    setPrimaryTopic(data?.primaryTopic);
    setType(data?.type);
    setNsfw(data?.nsfw);
    setRegion(data?.region);
  }, [data, statusCode]);

  useEffect(() => {
    console.log(type);
    console.log(nsfw === true);
    console.log(region);
  }, [nsfw]);
  const myType = (t) => {
    setType(t);
  };
  const check = (e) => {
    const ele = e?.target?.value;
    setName(ele);
    setCount(100 - ele.length);
  };
  const checkDisc = (e) => {
    const ele = e?.target?.value;
    setDisc(ele);
    setCountDisc(100 - ele.length);
  };
  const redirect = () => {
    window.location.pathname = '/';
  };

  const createCommunity = async () => {
    await setShowPopUp(true);
    const ele = document.getElementById('popup-form-button');
    ele.click();
  };
  const SendData = () => {
    patchData(subReddit, {
      topics,
      primaryTopic,
      name,
      description: disc,
      nsfw,
      region,
      type,
    }); // fetch api
  };
  return (

    exist
      ? (
        <TotalContainer>
          <AddFlair><Add onClick={SendData}>Save Change</Add></AddFlair>
          <LeftAlighne>
            <Container>
              <AboutString>
                Community settings
              </AboutString>
              <Disc>COMMUNITY PROFILE</Disc>
              <Section>
                <AboutSubString>
                  Community name
                </AboutSubString>
                <InputName
                  type="text"
                  defaultValue={subReddit}
                  onChange={check}
                  onInput={(e) => {
                  // eslint-disable-next-line radix
                    e.target.value = e.target.value.slice(0, 100);
                  }}
                />
                <Count
                  condition={(count === 0).toString()}
                >
                  {count}
                  {' '}
                  Characters remaining
                </Count>
              </Section>
              {/* community topics */}
              <Section>
                <FlexBox>
                  <FlexBoxColumn>
                    <AboutSubString>Community topics</AboutSubString>
                    <SmallDisc>This will help Reddit recommend your community to relevant users and other discovery experiences.</SmallDisc>
                  </FlexBoxColumn>
                  <Count
                    condition={(count === 25).toString()}
                  >
                    {topics?.length}
                    /
                    25
                  </Count>
                </FlexBox>
                <CommunityMianTopic topics={topics} Name={name} primaryTopic={primaryTopic} setTopics={setTopics} setPrimaryTopic={setPrimaryTopic} />
              </Section>
              <Section>
                <AboutSubString>
                  Community description
                </AboutSubString>
                <SmallDisc>
                  This is how new members come to understand your community.
                </SmallDisc>
                <TextArea
                  onChange={checkDisc}
                  defaultValue={disc}
                  onInput={(e) => {
                  // eslint-disable-next-line radix
                    e.target.value = e.target.value.slice(0, 100);
                  }}
                />
                <Count
                  condition={(countDisc === 0).toString()}
                >
                  {countDisc}
                  {' '}
                  Characters remaining
                </Count>
              </Section>
              <Section>
                <Disc>COMMUNITY LOCATION AND MAIN LANGUAGE</Disc>
                <SmallDisc marginTop="-14px">
                  Adding a location helps your community show up in search results and
                  recommendations and helps local redditors find it easier.
                </SmallDisc>
              </Section>
              <Section>
                <AboutSubString>
                  Region
                </AboutSubString>
                <Box sx={{ marginLeft: '17px' }}>
                  <CountrySelect Location={region} />
                </Box>
              </Section>
              <Section>
                <Disc>COMMUNITY TYPE</Disc>
              </Section>
              <Section>
                {(type === 'Public')
                && <RadioBtn myType={myType} type="Public" />}
                {(type === 'Restricted')
                && <RadioBtn myType={myType} type="Restricted" />}
                { (type === 'Private')
               && <RadioBtn myType={myType} type="Private" />}
              </Section>
              <Section>
                <FlexBox>
                  <FlexBoxColumn>
                    <Adult>
                      <Warning>18+ year old community</Warning>
                      <NSFWs>NSFW</NSFWs>
                    </Adult>
                    <SmallDisc>
                      When your community is marked as an 18+ community, users must be flagged as 18+ in their user settings
                    </SmallDisc>
                  </FlexBoxColumn>
                  { nsfw
                    && <Switch defaultChecked onClick={() => { setNsfw(!nsfw); }} />}
                  {!nsfw
                    && <Switch defaultChecked={false} onClick={() => { setNsfw(!nsfw); }} />}
                </FlexBox>
              </Section>
            </Container>
          </LeftAlighne>
        </TotalContainer>
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
